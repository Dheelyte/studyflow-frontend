"use client";
import { useEffect, useMemo, useState } from "react";

export default function ScrambleText({
    text,
    stagger = 70,
    duration = 600,
    maxAngle = 55,
    className,
    style,
}) {
    const [settled, setSettled] = useState(false);

    const angles = useMemo(
        () =>
            text.split("").map(() => {
                const sign = Math.random() < 0.5 ? -1 : 1;
                return sign * (maxAngle * (0.6 + Math.random() * 0.4));
            }),
        [text, maxAngle]
    );

    useEffect(() => {
        const id = requestAnimationFrame(() => setSettled(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <span className={className} style={style} aria-label={text}>
            {text.split("").map((ch, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        transform: settled ? "rotate(0deg)" : `rotate(${angles[i]}deg)`,
                        transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * stagger}ms`,
                        transformOrigin: "50% 70%",
                    }}
                >
                    {ch}
                </span>
            ))}
        </span>
    );
}
