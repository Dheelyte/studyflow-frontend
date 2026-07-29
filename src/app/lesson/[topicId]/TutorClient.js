"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { ChevronLeft, VideoIcon, CheckCircleIcon, ZapIcon } from "@/components/Icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ScreenTutorPanel from "@/components/ScreenTutorPanel";

// Help icon (question mark in circle)
const HelpIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

// Lightbulb icon for the panel
const LightbulbIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
    </svg>
);

export default function TutorClient({ params }) {
    const resolvedParams = React.use(params);
    const topicId = resolvedParams?.topicId;
    const router = useRouter();

    const [videoId, setVideoId] = useState(null);
    const [topicTitle, setTopicTitle] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [playerReady, setPlayerReady] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completing, setCompleting] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [chatExpanded, setChatExpanded] = useState(false);

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const ytScriptLoaded = useRef(false);
    const messagesContainerRef = useRef(null);
    const chatInputRef = useRef(null);

    const autoSizeChatInput = () => {
        const el = chatInputRef.current;
        if (!el) return;
        el.style.height = "auto";
        const maxHeight = 140;
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
        el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
    };

    useEffect(() => {
        autoSizeChatInput();
    }, [chatInput]);

    // Close the clear-chat confirmation modal on Escape
    useEffect(() => {
        if (!showClearConfirm) return;
        const onKey = (e) => {
            if (e.key === "Escape" && !clearing) setShowClearConfirm(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [showClearConfirm, clearing]);

    // Sync the browser tab title with the current topic title
    useEffect(() => {
        if (typeof document === "undefined") return;
        const previous = document.title;
        if (topicTitle) {
            document.title = topicTitle;
        }
        return () => {
            document.title = previous;
        };
    }, [topicTitle]);

    // Fetch video data for this topic
    useEffect(() => {
        if (!topicId) return;

        const fetchVideo = async () => {
            try {
                setLoading(true);
                const data = await curriculum.getTopicVideo(topicId);
                setVideoId(data.youtube_video_id);
                if (data.title) setTopicTitle(data.title);
                if (data.description) setTopicDescription(data.description);
                setIsCompleted(Boolean(data.is_completed));
            } catch (err) {
                console.error("Failed to fetch topic video:", err);
                setError(err.message || "Failed to load video");
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [topicId]);

    // Load YouTube IFrame API and create player once videoId is available
    const initPlayer = useCallback(() => {
        if (!videoId || !playerContainerRef.current) return;
        if (playerRef.current) {
            // Player already exists, just load new video
            playerRef.current.loadVideoById(videoId);
            return;
        }

        const createPlayer = () => {
            playerRef.current = new window.YT.Player(playerContainerRef.current, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                    fs: 1,
                    iv_load_policy: 3,
                },
                events: {
                    onReady: () => setPlayerReady(true),
                },
            });
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
            return;
        }

        if (!ytScriptLoaded.current) {
            ytScriptLoaded.current = true;
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = createPlayer;
    }, [videoId]);

    useEffect(() => {
        initPlayer();

        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === "function") {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [initPlayer]);

    // Load existing chat history for this topic
    useEffect(() => {
        if (!topicId) return;
        let cancelled = false;
        (async () => {
            try {
                setChatLoading(true);
                const data = await curriculum.getChatSession(topicId);
                if (!cancelled) {
                    setMessages(data.messages || []);
                    setHasMoreMessages(Boolean(data.has_more));
                }
            } catch (err) {
                console.error("Failed to load chat:", err);
            } finally {
                if (!cancelled) setChatLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [topicId]);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            setShowScrollDown(false);
        }
    };

    useEffect(() => {
        const el = messagesContainerRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        if (distanceFromBottom < 80) {
            el.scrollTop = el.scrollHeight;
            setShowScrollDown(false);
        } else {
            setShowScrollDown(true);
        }
    }, [messages, sending]);

    // On first load, jump to the bottom of the chat once messages are rendered
    const didInitialScrollRef = useRef(false);
    useEffect(() => {
        if (didInitialScrollRef.current) return;
        if (chatLoading) return;
        const el = messagesContainerRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
        setShowScrollDown(false);
        didInitialScrollRef.current = true;
    }, [chatLoading, messages]);

    const loadOlderMessages = async () => {
        if (loadingOlder || !hasMoreMessages || messages.length === 0) return;
        const el = messagesContainerRef.current;
        const previousHeight = el ? el.scrollHeight : 0;
        const previousTop = el ? el.scrollTop : 0;
        const oldestId = messages[0]?.id;
        if (oldestId == null || typeof oldestId !== "number") return;
        try {
            setLoadingOlder(true);
            const page = await curriculum.getChatMessagesPage(topicId, {
                beforeId: oldestId,
                limit: 50,
            });
            const older = page.messages || [];
            setHasMoreMessages(Boolean(page.has_more));
            if (older.length > 0) {
                setMessages((prev) => [...older, ...prev]);
                requestAnimationFrame(() => {
                    const node = messagesContainerRef.current;
                    if (node) {
                        node.scrollTop =
                            node.scrollHeight - previousHeight + previousTop;
                    }
                });
            }
        } catch (err) {
            console.error("Failed to load older messages:", err);
        } finally {
            setLoadingOlder(false);
        }
    };

    const handleMessagesScroll = () => {
        const el = messagesContainerRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setShowScrollDown(distanceFromBottom > 80);
        if (el.scrollTop < 60 && hasMoreMessages && !loadingOlder) {
            loadOlderMessages();
        }
    };

    const handleClearChat = () => {
        if (clearing || messages.length === 0) return;
        setShowClearConfirm(true);
    };

    const confirmClearChat = async () => {
        if (clearing) return;
        try {
            setClearing(true);
            await curriculum.clearChatSession(topicId);
            setMessages([]);
            setHasMoreMessages(false);
            setShowClearConfirm(false);
        } catch (err) {
            console.error("Failed to clear chat:", err);
        } finally {
            setClearing(false);
        }
    };

    const getCurrentTimestamp = () => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
            return playerRef.current.getCurrentTime();
        }
        return null;
    };

    const sendMessage = async (content, { timestamp = null, pauseVideo = false } = {}) => {
        if (!content.trim() || sending) return;

        if (pauseVideo && playerRef.current && typeof playerRef.current.pauseVideo === "function") {
            playerRef.current.pauseVideo();
        }

        const optimisticUser = {
            id: `tmp-${Date.now()}`,
            role: "user",
            content,
            video_timestamp: timestamp,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticUser]);
        setSending(true);
        requestAnimationFrame(() => scrollToBottom());

        const streamingAssistantId = `streaming-${Date.now()}`;
        let streamingStarted = false;
        let streamingErrored = false;
        let accumulated = "";

        try {
            for await (const event of curriculum.streamChatMessage(topicId, {
                content,
                video_timestamp: timestamp,
            })) {
                if (event.type === "user_message" && event.message) {
                    // Swap optimistic user message with the persisted one
                    setMessages((prev) => [
                        ...prev.filter((m) => m.id !== optimisticUser.id),
                        event.message,
                    ]);
                } else if (event.type === "chunk" && typeof event.text === "string") {
                    accumulated += event.text;
                    if (!streamingStarted) {
                        streamingStarted = true;
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: streamingAssistantId,
                                role: "assistant",
                                content: accumulated,
                                video_timestamp: timestamp ?? null,
                                created_at: new Date().toISOString(),
                                _streaming: true,
                            },
                        ]);
                    } else {
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === streamingAssistantId
                                    ? { ...m, content: accumulated }
                                    : m
                            )
                        );
                    }
                } else if (event.type === "done" && event.message) {
                    setMessages((prev) => {
                        const withoutStreaming = prev.filter(
                            (m) => m.id !== streamingAssistantId
                        );
                        return [...withoutStreaming, event.message];
                    });
                } else if (event.type === "error") {
                    streamingErrored = true;
                    console.error("Chat stream error:", event.error);
                }
            }
        } catch (err) {
            console.error("Failed to stream message:", err);
            streamingErrored = true;
            setMessages((prev) => {
                const withoutStreaming = prev.filter(
                    (m) => m.id !== streamingAssistantId && m.id !== optimisticUser.id
                );
                return [
                    ...withoutStreaming,
                    {
                        id: `err-${Date.now()}`,
                        role: "assistant",
                        content: "Sorry, I couldn't reply right now. Please try again.",
                        video_timestamp: null,
                        created_at: new Date().toISOString(),
                    },
                ];
            });
        } finally {
            setSending(false);
            if (streamingErrored && !accumulated) {
                // No partial reply arrived — error UI already added above.
            }
        }
    };

    const handleExplain = () => {
        const timestamp = getCurrentTimestamp();
        const tsLabel = timestamp != null ? ` (at ${Math.round(timestamp)}s)` : "";
        sendMessage(
            `I don't understand what's happening in the video${tsLabel}. Can you explain?`,
            { timestamp: timestamp != null ? Math.round(timestamp) : null, pauseVideo: true }
        );
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        const content = chatInput.trim();
        if (!content) return;
        setChatInput("");
        const ts = getCurrentTimestamp();
        sendMessage(content, {
            timestamp: ts != null && ts > 0 ? Math.round(ts) : null,
        });
    };

    // Mark complete handler
    const handleComplete = async () => {
        if (completing || isCompleted) return;

        try {
            setCompleting(true);
            await curriculum.completeTopic(topicId);
            setIsCompleted(true);
        } catch (err) {
            console.error("Failed to mark topic complete:", err);
        } finally {
            setCompleting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.inner}>
                    <div className={styles.topBar}>
                        <button className={styles.backButton} onClick={handleBack}>
                            <ChevronLeft size={20} /> Back
                        </button>
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.videoSection}>
                            <div className={styles.playerWrapper}>
                                <div className={styles.playerPlaceholder}>
                                    <VideoIcon size={48} />
                                    <span>Loading video...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorState}>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button className={styles.retryButton} onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <button className={styles.backButton} onClick={handleBack}>
                        <ChevronLeft size={20} /> Back to Course
                    </button>
                    <span className={styles.topicTitle}>{topicTitle}</span>
                    <button
                        className={`${styles.completeButton} ${isCompleted ? styles.completedButton : ""}`}
                        onClick={handleComplete}
                        disabled={completing || isCompleted}
                    >
                        {isCompleted ? (
                            <><CheckCircleIcon size={18} /> Completed</>
                        ) : completing ? (
                            "Saving..."
                        ) : (
                            <><CheckCircleIcon size={18} /> Mark Complete</>
                        )}
                    </button>
                </div>

                {/* Main layout */}
                <div className={styles.layout}>
                    {/* Video section */}
                    <div className={styles.videoSection}>
                        <div className={styles.playerWrapper}>
                            {videoId ? (
                                <>
                                    <div ref={playerContainerRef} style={{ width: "100%", height: "100%" }} />
                                    {!playerReady && (
                                        <div className={styles.playerPlaceholder}>
                                            <VideoIcon size={48} />
                                            <span>Loading video...</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.playerPlaceholder}>
                                    <VideoIcon size={48} />
                                    <span>No video available for this topic</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.videoControls}>
                            <button
                                className={styles.helpButton}
                                onClick={handleExplain}
                                disabled={sending || !videoId}
                            >
                                <HelpIcon size={20} />
                                {sending ? "Thinking..." : "I don't understand this part"}
                            </button>
                        </div>

                        {topicDescription && (
                            <div className={styles.topicDescription}>
                                <strong>About this topic:</strong> {topicDescription}
                            </div>
                        )}
                    </div>

                    {/* Explanation panel */}
                    <div className={`${styles.panel} ${chatExpanded ? styles.panelExpanded : ""}`}>
                        <div className={styles.panelHeader}>
                            <div className={styles.panelIcon}>
                                <ZapIcon size={20} fill="var(--primary)" />
                            </div>
                            <div className={styles.panelHeaderText}>
                                <h3>AI Chat Tutor</h3>
                                <p>Ask for help at any point in the video</p>
                            </div>
                            {messages.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.clearChatButton}
                                    onClick={handleClearChat}
                                    disabled={clearing}
                                    title="Clear chat"
                                >
                                    {clearing ? "Clearing..." : "Clear"}
                                </button>
                            )}
                            <button
                                type="button"
                                className={styles.expandChatButton}
                                onClick={() => setChatExpanded((v) => !v)}
                                aria-label={chatExpanded ? "Shrink chat" : "Expand chat"}
                                title={chatExpanded ? "Shrink chat" : "Expand chat"}
                            >
                                {chatExpanded ? (
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="4 14 10 14 10 20" />
                                        <polyline points="20 10 14 10 14 4" />
                                        <line x1="14" y1="10" x2="21" y2="3" />
                                        <line x1="3" y1="21" x2="10" y2="14" />
                                    </svg>
                                ) : (
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="15 3 21 3 21 9" />
                                        <polyline points="9 21 3 21 3 15" />
                                        <line x1="21" y1="3" x2="14" y2="10" />
                                        <line x1="3" y1="21" x2="10" y2="14" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div className={styles.panelBody}>
                            <div
                                className={styles.chatMessages}
                                ref={messagesContainerRef}
                                onScroll={handleMessagesScroll}
                            >
                                {chatLoading ? (
                                    <div className={styles.chatSkeleton}>
                                        <div className={`${styles.skeletonBubble} ${styles.skeletonAssistant}`} />
                                        <div className={`${styles.skeletonBubble} ${styles.skeletonUser}`} />
                                        <div className={`${styles.skeletonBubble} ${styles.skeletonAssistant}`} />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <div className={styles.emptyStateIcon}>
                                            <LightbulbIcon size={28} />
                                        </div>
                                        <h4>Ask the AI tutor anything</h4>
                                        <p>
                                            Type a question below, or click "I don't understand this part"
                                            while watching the video to get a contextual explanation.
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`${styles.chatMessage} ${m.role === "user" ? styles.chatMessageUser : styles.chatMessageAssistant}`}
                                        >
                                            <div className={styles.chatBubble}>
                                                {m.role === "assistant" ? (
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {m.content}
                                                    </ReactMarkdown>
                                                ) : (
                                                    <p>{m.content}</p>
                                                )}
                                                {m.video_timestamp != null && (
                                                    <span className={styles.chatTimestamp}>
                                                        @ {Math.round(m.video_timestamp)}s
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                                {sending && !messages.some((m) => m._streaming) && (
                                    <div className={`${styles.chatMessage} ${styles.chatMessageAssistant}`}>
                                        <div className={styles.chatBubble}>
                                            <div className={styles.loadingDots}>
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {showScrollDown && (
                                <button
                                    type="button"
                                    className={styles.scrollDownButton}
                                    onClick={scrollToBottom}
                                    aria-label="Scroll to latest"
                                >
                                    ↓
                                </button>
                            )}

                            <form className={styles.chatInputRow} onSubmit={handleChatSubmit}>
                                <textarea
                                    ref={chatInputRef}
                                    className={styles.chatInput}
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleChatSubmit(e);
                                        }
                                    }}
                                    placeholder="Ask a follow-up question..."
                                    rows={1}
                                    disabled={sending}
                                />
                                <button
                                    type="submit"
                                    className={styles.chatSendButton}
                                    disabled={sending || !chatInput.trim()}
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showClearConfirm && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => {
                        if (!clearing) setShowClearConfirm(false);
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="clear-chat-title"
                >
                    <div
                        className={styles.modalCard}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalIcon}>
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                                <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                            </svg>
                        </div>
                        <h3 id="clear-chat-title" className={styles.modalTitle}>
                            Clear this chat?
                        </h3>
                        <p className={styles.modalBody}>
                            All messages in this conversation will be permanently
                            deleted. This can't be undone.
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.modalCancel}
                                onClick={() => setShowClearConfirm(false)}
                                disabled={clearing}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={styles.modalConfirm}
                                onClick={confirmClearChat}
                                disabled={clearing}
                            >
                                {clearing ? "Clearing..." : "Clear chat"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* On a lesson the context is unambiguous — this exact topic. */}
            <ScreenTutorPanel topicId={topicId ? Number(topicId) : null} courseTitle={topicTitle} />
        </div>
    );
}
