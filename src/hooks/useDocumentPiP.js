"use client";
import { useCallback, useEffect, useRef, useState } from 'react';

const PIP_WIDTH = 420;
const PIP_HEIGHT = 640;

/**
 * A Document Picture-in-Picture window starts as a blank document: it inherits
 * none of the page's CSS. Copy every stylesheet across, or the portalled UI
 * renders completely unstyled.
 */
function clonePageStyles(pipWindow) {
    for (const sheet of Array.from(document.styleSheets)) {
        try {
            const cssText = Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join('\n');
            const style = pipWindow.document.createElement('style');
            style.textContent = cssText;
            pipWindow.document.head.appendChild(style);
        } catch {
            // Cross-origin sheets throw on cssRules access , re-link them instead.
            if (sheet.href) {
                const link = pipWindow.document.createElement('link');
                link.rel = 'stylesheet';
                link.href = sheet.href;
                pipWindow.document.head.appendChild(link);
            }
        }
    }
}

export default function useDocumentPiP() {
    const [pipWindow, setPipWindow] = useState(null);
    const [error, setError] = useState(null);
    const windowRef = useRef(null);

    const isSupported =
        typeof window !== 'undefined' && 'documentPictureInPicture' in window;

    const close = useCallback(() => {
        windowRef.current?.close();
        windowRef.current = null;
        setPipWindow(null);
    }, []);

    // Never leave a floating window orphaned when the page navigates away.
    useEffect(() => () => windowRef.current?.close(), []);

    const open = useCallback(async () => {
        setError(null);
        if (!isSupported) {
            setError('Floating window needs Chrome or Edge.');
            return false;
        }
        try {
            // Must be called from a user gesture.
            const w = await window.documentPictureInPicture.requestWindow({
                width: PIP_WIDTH,
                height: PIP_HEIGHT,
            });

            clonePageStyles(w);

            // CSS variables are keyed off data-theme on the root element.
            const theme = document.documentElement.getAttribute('data-theme');
            if (theme) w.document.documentElement.setAttribute('data-theme', theme);

            w.document.body.style.margin = '0';
            w.document.body.style.background = 'var(--background)';
            w.document.body.style.color = 'var(--foreground)';

            // Closing from the window's own chrome should drop us back inline.
            w.addEventListener('pagehide', () => {
                windowRef.current = null;
                setPipWindow(null);
            });

            windowRef.current = w;
            setPipWindow(w);
            return true;
        } catch (e) {
            setError(e?.message || 'Could not open the floating window.');
            return false;
        }
    }, [isSupported]);

    return { isSupported, pipWindow, open, close, error };
}
