"use client";
import React, { useEffect, useState } from "react";
import { curriculum } from "@/services/api";
import styles from "./page.module.css";

export default function CertificateClient({ params }) {
    const resolved = React.use(params);
    const code = resolved?.code;

    const [cert, setCert] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!code) return;
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await curriculum.verifyCertificate(code);
                if (!cancelled) setCert(data);
            } catch (err) {
                if (!cancelled) setError(err?.message || "Certificate not found");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [code]);

    if (loading) {
        return (
            <div className={styles.pageWrap}>
                <div className={styles.statusBox}>Loading certificate...</div>
            </div>
        );
    }

    if (error || !cert) {
        return (
            <div className={styles.pageWrap}>
                <div className={styles.statusBox}>
                    <h2>Certificate not found</h2>
                    <p>The verification code <code>{code}</code> didn't match any issued certificate.</p>
                </div>
            </div>
        );
    }

    const issuedDate = new Date(cert.issued_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handlePrint = () => {
        if (typeof window !== "undefined") window.print();
    };

    return (
        <div className={styles.pageWrap}>
            <div className={styles.actions}>
                <button className={styles.printButton} onClick={handlePrint}>
                    Print / Save as PDF
                </button>
            </div>

            <div className={styles.certificate}>
                <div className={styles.certHeader}>
                    <div className={styles.brand}>Primerly</div>
                    <div className={styles.divider} />
                    <div className={styles.eyebrow}>Certificate of Completion</div>
                </div>

                <div className={styles.body}>
                    <p className={styles.presented}>This certificate is proudly presented to</p>
                    <h1 className={styles.recipient}>{cert.recipient_name}</h1>
                    <p className={styles.forCompleting}>for successfully completing</p>
                    <h2 className={styles.courseTitle}>{cert.playlist_title}</h2>
                    <p className={styles.summary}>
                        Including every lesson and module assessment in the course.
                    </p>
                </div>

                <div className={styles.footerRow}>
                    <div className={styles.footerCell}>
                        <div className={styles.footerValue}>{issuedDate}</div>
                        <div className={styles.footerLabel}>Issued</div>
                    </div>
                    <div className={styles.seal}>
                        <span>✓</span>
                    </div>
                    <div className={styles.footerCell}>
                        <div className={styles.footerValue}>{cert.verification_code}</div>
                        <div className={styles.footerLabel}>Verification code</div>
                    </div>
                </div>
            </div>

            <p className={styles.verifyHint}>
                Verify this certificate at any time by visiting this page.
            </p>
        </div>
    );
}
