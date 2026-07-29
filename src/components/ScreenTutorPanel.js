"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useScreenShare from '@/hooks/useScreenShare';
import useDocumentPiP from '@/hooks/useDocumentPiP';
import useAudioRecorder from '@/hooks/useAudioRecorder';
import { screenTutor } from '@/services/api';
import { ZapIcon } from '@/components/Icons';
import styles from './ScreenTutorPanel.module.css';

export default function ScreenTutorPanel({
    topicId = null,
    projectId = null,
    courseTitle,
    courseRef = null,
}) {
    const share = useScreenShare();
    const pip = useDocumentPiP();
    const recorder = useAudioRecorder();

    const [open, setOpen] = useState(false);
    const [frame, setFrame] = useState(null);        // frozen frame awaiting confirmation
    const [question, setQuestion] = useState('');
    const [answerStyle, setAnswerStyle] = useState('hint');
    const [answer, setAnswer] = useState('');
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState(null);
    const [quota, setQuota] = useState(null);

    // Region marking: normalised rect over the frozen frame.
    const [region, setRegion] = useState(null);
    const dragRef = useRef(null);
    const imgRef = useRef(null);

    // Pinning: null means "auto-follow whatever lesson they're up to".
    const [targets, setTargets] = useState([]);
    const [pinned, setPinned] = useState(null);

    // Voice: ask by speaking, and/or have the answer read back.
    const [speakAnswers, setSpeakAnswers] = useState(false);
    const spokenRef = useRef('');
    // The recording behind the current answer, so a re-ask can reuse it.
    const lastAudioRef = useRef(null);

    const answerRef = useRef(null);

    // Don't leave the browser talking after the panel goes away.
    useEffect(() => () => window.speechSynthesis?.cancel(), []);

    const loadQuota = useCallback(async () => {
        try {
            setQuota(await screenTutor.getStatus());
        } catch {
            /* quota display is non-essential */
        }
    }, []);

    useEffect(() => {
        if (open) loadQuota();
    }, [open, loadQuota]);

    useEffect(() => {
        if (!open || !courseRef) return;
        let cancelled = false;
        screenTutor
            .getPinTargets(courseRef)
            .then((data) => {
                if (!cancelled) setTargets(data?.targets || []);
            })
            .catch(() => { /* picker is optional; auto-follow still works */ });
        return () => { cancelled = true; };
    }, [open, courseRef]);

    // The answer box grows to fit the whole reply instead of scrolling inside
    // itself, so follow the stream by scrolling whatever encloses it: the docked
    // panel, or the document of the floating PiP window.
    useEffect(() => {
        const el = answerRef.current;
        if (!el) return;
        for (let node = el.parentElement; node; node = node.parentElement) {
            const { overflowY } = node.ownerDocument.defaultView.getComputedStyle(node);
            if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
                node.scrollTop = node.scrollHeight;
                return;
            }
        }
        const doc = el.ownerDocument;
        const root = doc.scrollingElement || doc.documentElement;
        if (root) root.scrollTop = root.scrollHeight;
    }, [answer]);

    // A share ending invalidates the frozen frame. Keying off isSharing rather
    // than wrapping the stop button covers every route out of a session: our
    // button, the browser's own stop bar, and the track dropping on its own.
    useEffect(() => {
        if (share.isSharing) return;
        setFrame(null);
        setRegion(null);
    }, [share.isSharing]);

    const handleCapture = () => {
        setError(null);
        const shot = share.captureFrame();
        if (!shot) {
            setError('Could not read the screen. Try restarting the share.');
            return;
        }
        setAnswer('');
        setRegion(null);
        setFrame(shot);
        lastAudioRef.current = null;
    };

    // Drag a box over the frozen frame to say "this bit".
    const pointFromEvent = (e) => {
        const rect = imgRef.current?.getBoundingClientRect();
        if (!rect) return null;
        return {
            x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
            y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
        };
    };

    const rectFrom = (a, b) => ({
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        w: Math.abs(a.x - b.x),
        h: Math.abs(a.y - b.y),
    });

    const onRegionDown = (e) => {
        const p = pointFromEvent(e);
        if (!p) return;
        e.currentTarget.setPointerCapture?.(e.pointerId);
        dragRef.current = p;
        setRegion({ ...p, w: 0, h: 0 });
    };

    const onRegionMove = (e) => {
        if (!dragRef.current) return;
        const p = pointFromEvent(e);
        if (p) setRegion(rectFrom(dragRef.current, p));
    };

    const onRegionUp = () => {
        dragRef.current = null;
        // Treat a click-without-drag as "no selection".
        setRegion((r) => (r && r.w > 0.01 && r.h > 0.01 ? r : null));
    };

    const resolvePinned = () => {
        if (!pinned) return { topic_id: topicId, project_id: projectId };
        const [kind, rawId] = pinned.split(':');
        const id = Number(rawId);
        return kind === 'project'
            ? { topic_id: null, project_id: id }
            : { topic_id: id, project_id: null };
    };

    // `style` is passed explicitly rather than read from state, because a re-ask
    // fired right after setAnswerStyle would still close over the previous value.
    const send = async (audio = null, style = null) => {
        if (!frame) return;
        setStreaming(true);
        setError(null);
        setAnswer('');
        spokenRef.current = '';
        window.speechSynthesis?.cancel();
        // Remember how this question was asked so a re-ask repeats it rather than
        // silently falling back to whatever is sitting in the text box.
        lastAudioRef.current = audio;
        const regionImage = region ? share.cropFrame(region) : null;
        try {
            for await (const event of screenTutor.ask({
                image: frame,
                region_image: regionImage,
                audio,
                question: audio ? '' : question,
                answer_style: style || answerStyle,
                ...resolvePinned(),
            })) {
                if (event.type === 'chunk') {
                    setAnswer((prev) => prev + event.text);
                } else if (event.type === 'status') {
                    setQuota((q) => ({ ...(q || {}), remaining: event.remaining, daily_limit: event.daily_limit }));
                } else if (event.type === 'done') {
                    setQuota((q) => ({ ...(q || {}), remaining: event.remaining }));
                    // Read the finished answer rather than each chunk, so the voice
                    // doesn't stutter through a streaming response.
                    if (speakAnswers && event.answer) speak(event.answer);
                } else if (event.type === 'error') {
                    setError(event.error);
                }
            }
        } catch (err) {
            setError(err.message || 'Something went wrong asking about your screen.');
        } finally {
            setStreaming(false);
        }
    };

    const speak = (text) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        // Markdown reads badly aloud — strip the syntax, keep the words.
        const plain = text
            .replace(/```[\s\S]*?```/g, ' (code block) ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/[*_#>]/g, '')
            .trim();
        if (!plain || plain === spokenRef.current) return;
        spokenRef.current = plain;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(plain));
    };

    const handleVoiceAsk = async () => {
        if (recorder.isRecording) {
            const audio = await recorder.stop();
            if (!audio) {
                setError('Nothing was recorded. Try again.');
                return;
            }
            send(audio);
        } else {
            recorder.start();
        }
    };

    const askAgainDirect = async () => {
        setAnswerStyle('direct');
        // Re-send the same frame and the same question — including the recording,
        // if they asked out loud — for the full answer.
        send(lastAudioRef.current, 'direct');
    };

    if (!open) {
        return (
            <button className={styles.launcher} onClick={() => setOpen(true)}>
                <ZapIcon size={18} fill="currentColor" />
                AI Screen Tutor
            </button>
        );
    }

    const isFloating = !!pip.pipWindow;

    const body = (
        <div className={isFloating ? styles.pipRoot : styles.panel}>
            <div className={styles.head}>
                <div>
                    <div className={styles.title}>Screen tutor</div>
                    {courseTitle && <div className={styles.subtitle}>Helping with {courseTitle}</div>}
                </div>
                <div className={styles.headActions}>
                    {/* Floating keeps the tutor visible while the learner works in
                        another app — the whole point of the widget. */}
                    {pip.isSupported && (
                        <button
                            className={styles.headButton}
                            onClick={isFloating ? pip.close : pip.open}
                            title={isFloating ? 'Dock back into the page' : 'Float above other windows'}
                        >
                            {isFloating ? 'Dock' : 'Pop out'}
                        </button>
                    )}
                    <button
                        className={styles.close}
                        onClick={() => { pip.close(); setOpen(false); }}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Sharing state is always visible — the learner should never wonder
                whether their screen is being read. */}
            <div className={styles.statusRow}>
                <span className={`${styles.dot} ${share.isSharing && !share.isPaused ? styles.dotLive : styles.dotOff}`} />
                <span className={styles.statusText}>
                    {!share.isSharing
                        ? 'Not sharing your screen'
                        : share.isPaused
                            ? 'Paused — the tutor cannot see your screen'
                            : 'The tutor can read your screen when you ask'}
                </span>
                {quota?.remaining != null && (
                    <span className={styles.quota}>{quota.remaining} left today</span>
                )}
            </div>

            {!share.isSharing ? (
                <div className={styles.intro}>
                    <p className={styles.introText}>
                        Share your editor window and ask questions about what's on screen.
                        Nothing is captured until you press <strong>Capture screen</strong>, and
                        screenshots are never stored — they go to the tutor and are discarded.
                    </p>
                    <p className={styles.introHint}>
                        Tip: share the single window you're working in rather than your whole
                        screen, so nothing private is in shot.
                    </p>
                    <button className={styles.primary} onClick={share.start} disabled={!share.isSupported}>
                        Start screen sharing
                    </button>
                    {!share.isSupported && (
                        <p className={styles.error}>
                            This browser can't share a screen. Try Chrome or Edge.
                        </p>
                    )}
                    {share.error && <p className={styles.error}>{share.error}</p>}
                </div>
            ) : (
                <>
                    <div className={styles.shareControls}>
                        <button className={styles.secondary} onClick={share.togglePause}>
                            {share.isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button className={styles.secondary} onClick={share.stop}>
                            Stop sharing
                        </button>
                    </div>

                    {!frame ? (
                        <button
                            className={styles.primary}
                            onClick={handleCapture}
                            disabled={share.isPaused}
                        >
                            Capture screen
                        </button>
                    ) : (
                        <div className={styles.compose}>
                            {/* The learner sees exactly what will be sent before it leaves,
                                and can drag over the part they're actually asking about. */}
                            <div
                                className={styles.previewWrap}
                                onPointerDown={onRegionDown}
                                onPointerMove={onRegionMove}
                                onPointerUp={onRegionUp}
                            >
                                <img
                                    ref={imgRef}
                                    className={styles.preview}
                                    src={frame}
                                    alt="Captured screen"
                                    draggable={false}
                                />
                                {region && (
                                    <div
                                        className={styles.regionBox}
                                        style={{
                                            left: `${region.x * 100}%`,
                                            top: `${region.y * 100}%`,
                                            width: `${region.w * 100}%`,
                                            height: `${region.h * 100}%`,
                                        }}
                                    />
                                )}
                            </div>

                            <div className={styles.regionHint}>
                                {region ? (
                                    <>
                                        <span>Focusing on the highlighted area</span>
                                        <button className={styles.linkButton} onClick={() => setRegion(null)}>
                                            Clear
                                        </button>
                                    </>
                                ) : (
                                    <span>Drag over the screenshot to point at what you&apos;re stuck on</span>
                                )}
                            </div>

                            {targets.length > 0 && (
                                <label className={styles.pinRow}>
                                    <span className={styles.pinLabel}>Helping with</span>
                                    <select
                                        className={styles.select}
                                        value={pinned || ''}
                                        onChange={(e) => setPinned(e.target.value || null)}
                                    >
                                        <option value="">The lesson I&apos;m up to</option>
                                        {targets.map((t) => (
                                            <option key={`${t.kind}:${t.id}`} value={`${t.kind}:${t.id}`}>
                                                {t.sublabel ? `${t.sublabel} — ${t.label}` : t.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <textarea
                                className={styles.input}
                                rows={2}
                                placeholder="What are you stuck on?"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />

                            <div className={styles.styleRow}>
                                <label className={styles.styleOption}>
                                    <input
                                        type="radio"
                                        checked={answerStyle === 'hint'}
                                        onChange={() => setAnswerStyle('hint')}
                                    />
                                    Give me a hint
                                </label>
                                <label className={styles.styleOption}>
                                    <input
                                        type="radio"
                                        checked={answerStyle === 'direct'}
                                        onChange={() => setAnswerStyle('direct')}
                                    />
                                    Just tell me
                                </label>
                            </div>

                            <label className={styles.styleOption}>
                                <input
                                    type="checkbox"
                                    checked={speakAnswers}
                                    onChange={(e) => {
                                        setSpeakAnswers(e.target.checked);
                                        if (!e.target.checked) window.speechSynthesis?.cancel();
                                    }}
                                />
                                Read the answer out loud
                            </label>

                            <div className={styles.actions}>
                                <button className={styles.primary} onClick={() => send()} disabled={streaming || recorder.isRecording}>
                                    {streaming ? 'Thinking…' : 'Ask'}
                                </button>
                                {recorder.isSupported && (
                                    <button
                                        className={recorder.isRecording ? styles.recording : styles.secondary}
                                        onClick={handleVoiceAsk}
                                        disabled={streaming}
                                        title="Ask out loud instead of typing"
                                    >
                                        {recorder.isRecording ? `Stop & ask (${recorder.seconds}s)` : '🎙 Speak'}
                                    </button>
                                )}
                                <button
                                    className={styles.secondary}
                                    onClick={() => { recorder.cancel(); setFrame(null); setAnswer(''); }}
                                    disabled={streaming}
                                >
                                    Retake
                                </button>
                            </div>

                            {recorder.error && <p className={styles.error}>{recorder.error}</p>}
                        </div>
                    )}
                </>
            )}

            {answer && (
                <div className={styles.answer} ref={answerRef}>
                    <div className={styles.answerBody}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
                    </div>
                    {!streaming && answerStyle === 'hint' && (
                        <button className={styles.linkButton} onClick={askAgainDirect}>
                            Just tell me the answer →
                        </button>
                    )}
                </div>
            )}

            {pip.error && <p className={styles.error}>{pip.error}</p>}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );

    // Portalled into the floating window when open; the same tree either way, so
    // the screen-share session and any in-flight answer survive the move.
    return isFloating ? createPortal(body, pip.pipWindow.document.body) : body;
}
