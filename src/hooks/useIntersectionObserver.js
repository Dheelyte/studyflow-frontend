import { useEffect, useRef } from 'react';

export default function useIntersectionObserver({
    onIntersect,
    enabled = true,
    root = null,
    rootMargin = '0px',
    threshold = 1.0
}) {
    const targetRef = useRef(null);

    useEffect(() => {
        if (!enabled) return;

        const element = targetRef.current;
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    onIntersect();
                }
            });
        }, {
            root,
            rootMargin,
            threshold
        });

        observer.observe(element);

        return () => {
            observer.unobserve(element);
            observer.disconnect();
        };
    }, [enabled, onIntersect, root, rootMargin, threshold]);

    return targetRef;
}
