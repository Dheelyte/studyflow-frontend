"use client";
import { useState } from 'react';
import Link from 'next/link';
import { projects, communities, posts } from '@/services/api';
import { CodeIcon, StarIcon, LockIcon } from '@/components/Icons';
import styles from './ProjectPanel.module.css';

const LABELS = {
    practice: 'Practice project',
    capstone: 'Capstone project',
};

const HINTS = {
    practice: 'Apply what you just learned →',
    capstone: 'Build something you can show →',
};

const LOCKED_HINTS = {
    practice: 'Finish this module to unlock',
    capstone: 'Finish every module to unlock',
};

// The card in its unopened state. Shared so the curriculum preview shows the
// same project card the course page does, and so a locked project reads as the
// same thing waiting to be earned.
export function ProjectTeaser({ kind = 'practice', onClick, locked = false, hint }) {
    const isCapstone = kind === 'capstone';
    const text = hint || (locked ? LOCKED_HINTS[kind] : HINTS[kind]);

    return (
        <button
            type="button"
            className={[
                styles.openButton,
                isCapstone ? styles.openCapstone : styles.openPractice,
                locked ? styles.openLocked : '',
            ].join(' ')}
            onClick={locked ? undefined : onClick}
            aria-disabled={locked}
            title={locked ? text : undefined}
        >
            <span className={styles.openIcon}>
                {locked ? (
                    <LockIcon size={18} />
                ) : isCapstone ? (
                    <StarIcon size={20} fill="currentColor" />
                ) : (
                    <CodeIcon size={20} />
                )}
            </span>
            <span className={styles.openText}>
                <span className={styles.openLabel}>{LABELS[kind]}</span>
                <span className={styles.openHint}>{text}</span>
            </span>
        </button>
    );
}

// Three dots that cycle while a project is being designed.
function EllipsisLoader() {
    return (
        <span className={styles.ellipsis} aria-hidden>
            <span />
            <span />
            <span />
        </span>
    );
}

function ShareToCommunity({ project }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(null);
    const [selected, setSelected] = useState('');
    const [status, setStatus] = useState(null);

    const openPicker = async () => {
        setOpen(true);
        if (options) return;
        try {
            const mine = await communities.getMyCommunities();
            const list = Array.isArray(mine) ? mine : [];
            setOptions(list);
            if (list.length) setSelected(String(list[0].id));
        } catch {
            setOptions([]);
        }
    };

    const share = async () => {
        if (!selected) return;
        setStatus('sharing');
        try {
            await posts.create({
                community_id: Number(selected),
                content: `I just finished the project "${project.title}" on Primerly.${project.progress?.submission_url ? ` ${project.progress.submission_url}` : ''}`,
            });
            setStatus('shared');
        } catch {
            setStatus('error');
        }
    };

    if (status === 'shared') {
        return <p className={styles.shareDone}>Shared to your community.</p>;
    }

    if (!open) {
        return (
            <button className={styles.secondaryButton} onClick={openPicker}>
                Share to community
            </button>
        );
    }

    if (options && options.length === 0) {
        return (
            <p className={styles.shareHint}>
                You haven't joined a community yet.{' '}
                <Link href="/community" className={styles.inlineLink}>Find one →</Link>
            </p>
        );
    }

    return (
        <div className={styles.shareRow}>
            <select
                className={styles.select}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                disabled={!options}
            >
                {!options && <option>Loading…</option>}
                {(options || []).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <button
                className={styles.secondaryButton}
                onClick={share}
                disabled={!selected || status === 'sharing'}
            >
                {status === 'sharing' ? 'Sharing…' : 'Share'}
            </button>
            {status === 'error' && <span className={styles.error}>Could not share.</span>}
        </div>
    );
}

export default function ProjectPanel({ kind = 'practice', load, locked = false, lockedHint }) {
    const isCapstone = kind === 'capstone';
    const [project, setProject] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');

    const openPanel = async () => {
        setOpen(true);
        if (project || loading) return;
        setLoading(true);
        setError(null);
        try {
            const data = await load();
            setProject(data);
            setUrl(data.progress?.submission_url || '');
            setNotes(data.progress?.notes || '');
        } catch (err) {
            setError(err.message || 'Could not load this project.');
        } finally {
            setLoading(false);
        }
    };

    const persist = async (payload) => {
        setSaving(true);
        setError(null);
        try {
            const updated = await projects.updateProgress(project.id, payload);
            setProject(updated);
        } catch (err) {
            setError(err.message || 'Could not save your progress.');
        } finally {
            setSaving(false);
        }
    };

    const toggleRequirement = (reqId) => {
        const done = new Set(project.progress?.completed_requirement_ids || []);
        if (done.has(reqId)) {
            done.delete(reqId);
        } else {
            done.add(reqId);
        }
        persist({ completed_requirement_ids: [...done] });
    };

    const saveSubmission = () => persist({ submission_url: url, notes });

    const label = LABELS[kind];

    // Nothing is fetched while locked: the brief is the reward for finishing.
    if (locked) {
        return <ProjectTeaser kind={kind} locked hint={lockedHint} />;
    }

    if (!open) {
        return <ProjectTeaser kind={kind} onClick={openPanel} />;
    }

    if (loading) {
        return (
            <div className={styles.panel}>
                <div className={styles.kicker}>{label}</div>
                <p className={styles.generating}>
                    Designing your project<EllipsisLoader />
                    <span className={styles.generatingNote}>
                        This takes a few seconds the first time.
                    </span>
                </p>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div className={styles.panel}>
                <div className={styles.kicker}>{label}</div>
                <p className={styles.error}>{error}</p>
                <button className={styles.secondaryButton} onClick={() => { setProject(null); openPanel(); }}>
                    Try again
                </button>
            </div>
        );
    }

    if (!project) return null;

    const done = new Set(project.progress?.completed_requirement_ids || []);
    const total = project.requirements?.length || 0;
    const completedCount = project.requirements?.filter((r) => done.has(r.id)).length || 0;

    return (
        <div className={`${styles.panel} ${project.progress?.is_completed ? styles.panelDone : ''}`}>
            <div className={styles.kicker}>{label}</div>
            <h3 className={styles.title}>{project.title}</h3>

            <div className={styles.meta}>
                {project.estimated_time && <span>{project.estimated_time}</span>}
                <span>{completedCount}/{total} requirements</span>
                <span>+{project.xp_reward} XP</span>
            </div>

            <p className={styles.brief}>{project.brief}</p>

            <div className={styles.checklist}>
                {(project.requirements || []).map((req) => (
                    <label key={req.id} className={styles.requirement}>
                        <input
                            type="checkbox"
                            checked={done.has(req.id)}
                            onChange={() => toggleRequirement(req.id)}
                            disabled={saving}
                        />
                        <span className={done.has(req.id) ? styles.reqDone : undefined}>
                            {req.text}
                        </span>
                    </label>
                ))}
            </div>

            <div className={styles.submission}>
                <label className={styles.fieldLabel}>
                    Link to what you built <span className={styles.optional}>(optional)</span>
                </label>
                <input
                    className={styles.input}
                    type="url"
                    placeholder="https://github.com/... , a Figma file, a live site"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <label className={styles.fieldLabel}>
                    Notes <span className={styles.optional}>(optional)</span>
                </label>
                <textarea
                    className={styles.textarea}
                    rows={3}
                    placeholder="What was tricky? What would you do differently?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button className={styles.secondaryButton} onClick={saveSubmission} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                </button>
            </div>

            {project.progress?.is_completed && (
                <div className={styles.doneBanner}>
                    <strong>Project complete.</strong> +{project.xp_reward} XP added.
                    <ShareToCommunity project={project} />
                </div>
            )}

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
