"use client";
import { useCallback, useEffect, useRef, useState } from 'react';

// Speech only needs a narrow band, and this keeps an uncompressed WAV small.
const TARGET_SAMPLE_RATE = 16000;
const MAX_SECONDS = 60;

function encodeWav(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeString = (offset, str) => {
        for (let i = 0; i < str.length; i += 1) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);          // PCM chunk size
    view.setUint16(20, 1, true);           // format: PCM
    view.setUint16(22, 1, true);           // mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true);           // block align
    view.setUint16(34, 16, true);          // bits per sample
    writeString(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i += 1, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
}

function base64FromBuffer(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const CHUNK = 0x8000; // avoid blowing the argument limit on long recordings
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
}

/**
 * MediaRecorder gives us WebM/Opus, which Gemini does not accept as audio input,
 * so the recording is decoded, downmixed to 16 kHz mono and re-encoded as WAV.
 */
async function blobToWavDataUrl(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    try {
        const decoded = await ctx.decodeAudioData(arrayBuffer);
        const frames = Math.ceil(decoded.duration * TARGET_SAMPLE_RATE);
        const offline = new OfflineAudioContext(1, frames, TARGET_SAMPLE_RATE);
        const source = offline.createBufferSource();
        source.buffer = decoded;
        source.connect(offline.destination);
        source.start();
        const rendered = await offline.startRendering();
        const wav = encodeWav(rendered.getChannelData(0), TARGET_SAMPLE_RATE);
        return `data:audio/wav;base64,${base64FromBuffer(wav)}`;
    } finally {
        ctx.close();
    }
}

export default function useAudioRecorder() {
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [error, setError] = useState(null);

    const isSupported =
        typeof window !== 'undefined' &&
        typeof MediaRecorder !== 'undefined' &&
        !!navigator.mediaDevices?.getUserMedia;

    const cleanup = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = null;
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        recorderRef.current = null;
        setIsRecording(false);
        setSeconds(0);
    }, []);

    // Never leave the microphone open behind us.
    useEffect(() => cleanup, [cleanup]);

    const start = useCallback(async () => {
        setError(null);
        if (!isSupported) {
            setError('This browser cannot record audio.');
            return false;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];

            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (e) => {
                if (e.data?.size) chunksRef.current.push(e.data);
            };
            recorder.start();
            recorderRef.current = recorder;
            setIsRecording(true);

            setSeconds(0);
            let elapsed = 0;
            timerRef.current = setInterval(() => {
                elapsed += 1;
                setSeconds(elapsed);
                if (elapsed >= MAX_SECONDS) {
                    // Close the recording off at the cap. What was captured stays
                    // buffered for stop() to collect, so the learner's click still
                    // sends it.
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    if (recorder.state !== 'inactive') recorder.stop();
                }
            }, 1000);
            return true;
        } catch (err) {
            if (err?.name !== 'NotAllowedError') {
                setError(err?.message || 'Could not start recording.');
            } else {
                setError('Microphone permission was declined.');
            }
            cleanup();
            return false;
        }
    }, [isSupported, cleanup]);

    /** Stop and resolve to a WAV data URL, or null if nothing usable was captured. */
    const stop = useCallback(() => {
        const recorder = recorderRef.current;
        if (!recorder) return Promise.resolve(null);

        const collect = async () => {
            const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
            cleanup();
            if (!blob.size) return null;
            try {
                return await blobToWavDataUrl(blob);
            } catch (err) {
                setError('Could not process that recording.');
                return null;
            }
        };

        return new Promise((resolve) => {
            // Already stopped — by the duration cap, or because the track ended.
            // The chunks are still buffered, so use them rather than dropping the
            // recording on the floor.
            if (recorder.state === 'inactive') {
                resolve(collect());
                return;
            }
            recorder.onstop = () => resolve(collect());
            recorder.stop();
        });
    }, [cleanup]);

    const cancel = useCallback(() => {
        const recorder = recorderRef.current;
        if (recorder && recorder.state !== 'inactive') {
            recorder.onstop = null;
            recorder.stop();
        }
        cleanup();
    }, [cleanup]);

    return { isSupported, isRecording, seconds, error, start, stop, cancel };
}
