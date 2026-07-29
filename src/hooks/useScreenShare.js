"use client";
import { useCallback, useEffect, useRef, useState } from 'react';

// Screenshots of code need to stay legible, but a raw full-screen PNG is far too
// large to post: downscale to this width and encode as JPEG before upload.
const MAX_FRAME_WIDTH = 1920;
const JPEG_QUALITY = 0.85;
// Below this a "selection" is really a stray click.
const MIN_CROP_PX = 16;

/**
 * Holds a screen-share session locally for the lifetime of the page and grabs
 * single frames on demand. The stream is never sent anywhere — only the frames
 * the learner explicitly captures are, and only when they press send.
 */
export default function useScreenShare() {
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const lastFrameRef = useRef(null);

    const [isSharing, setIsSharing] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState(null);

    const isSupported =
        typeof navigator !== 'undefined' &&
        !!navigator.mediaDevices?.getDisplayMedia;

    const teardown = useCallback(() => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current = null;
        }
        // The retained frame belongs to the session that just ended; keeping it
        // would let a later crop be taken from a screen no longer being shared.
        lastFrameRef.current = null;
        setIsSharing(false);
        setIsPaused(false);
    }, []);

    // Stop cleanly if the page goes away with a share still active.
    useEffect(() => teardown, [teardown]);

    const start = useCallback(async () => {
        setError(null);
        if (!isSupported) {
            setError('Your browser cannot share a screen. Try Chrome or Edge.');
            return false;
        }
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: 5 },
                audio: false,
            });
            streamRef.current = stream;

            const video = document.createElement('video');
            video.srcObject = stream;
            video.muted = true;
            await video.play();
            videoRef.current = video;

            // Fires when the learner stops sharing from the browser's own bar.
            stream.getVideoTracks()[0]?.addEventListener('ended', teardown);

            setIsSharing(true);
            setIsPaused(false);
            return true;
        } catch (err) {
            // Cancelling the picker is a normal choice, not an error worth shouting about.
            if (err?.name !== 'NotAllowedError') {
                setError(err?.message || 'Could not start screen sharing.');
            }
            return false;
        }
    }, [isSupported, teardown]);

    const togglePause = useCallback(() => {
        const track = streamRef.current?.getVideoTracks()[0];
        if (!track) return;
        // Disabling the track blanks the feed without giving up the permission,
        // so resuming doesn't need another browser prompt.
        track.enabled = !track.enabled;
        setIsPaused(!track.enabled);
    }, []);

    /** Grab the current frame as a downscaled JPEG data URL, or null.
     *
     * The native-resolution frame is retained so a later crop is taken from the
     * moment that was captured — the live feed has moved on by then — and at full
     * detail rather than from the already-downscaled upload.
     */
    const captureFrame = useCallback(() => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) return null;

        const native = document.createElement('canvas');
        native.width = video.videoWidth;
        native.height = video.videoHeight;
        native.getContext('2d').drawImage(video, 0, 0);
        lastFrameRef.current = native;

        const scale = Math.min(1, MAX_FRAME_WIDTH / native.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(native.width * scale);
        canvas.height = Math.round(native.height * scale);
        canvas.getContext('2d').drawImage(native, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    }, []);

    /** Crop the captured frame to a normalised rect ({x,y,w,h} in 0..1). */
    const cropFrame = useCallback((rect) => {
        const native = lastFrameRef.current;
        if (!native || !rect) return null;

        const sx = Math.max(0, Math.round(rect.x * native.width));
        const sy = Math.max(0, Math.round(rect.y * native.height));
        const sw = Math.min(native.width - sx, Math.round(rect.w * native.width));
        const sh = Math.min(native.height - sy, Math.round(rect.h * native.height));

        // Ignore stray clicks and hairline drags.
        if (sw < MIN_CROP_PX || sh < MIN_CROP_PX) return null;

        const scale = Math.min(1, MAX_FRAME_WIDTH / sw);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(sw * scale);
        canvas.height = Math.round(sh * scale);
        canvas.getContext('2d').drawImage(
            native, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height
        );
        return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
    }, []);

    return {
        isSupported,
        isSharing,
        isPaused,
        error,
        start,
        stop: teardown,
        togglePause,
        captureFrame,
        cropFrame,
    };
}
