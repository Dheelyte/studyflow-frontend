"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './QuizModal.module.css';
import { XIcon, CheckCircleIcon, TrophyIconSimple, RefreshIcon } from '@/components/Icons'; // Assuming RefreshIcon exists or I'll use text
import Spinner from '@/components/Spinner';
import { curriculum } from '@/services/api';
import confetti from 'canvas-confetti';

export default function QuizModal({ isOpen, onClose, moduleTitle, moduleId, onComplete, curriculumTitle, experienceLevel }) {
    const [step, setStep] = useState('INTRO'); // INTRO, QUESTION, RESULTS
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false); // To show correct/incorrect after selection
    
    // Ref for scrolling content to top
    const contentRef = useRef(null);

    const PASS_MARK = 70;

    useEffect(() => {
        if (!isOpen || !moduleId) {
            resetQuizState();
        } else {
            // Reset questions when opening a new module so we don't show old ones while waiting to start
            setQuestions([]); 
            resetQuizState(); 
        }
    }, [isOpen, moduleId]);

    const resetQuizState = () => {
        setStep('INTRO');
        setAnswers({});
        setScore(0);
        setCurrentQuestionIdx(0);
        setShowCorrection(false);
    };

    const loadQuiz = async () => {
        try {
            setLoading(true);
            const data = await curriculum.getQuiz(moduleId, {
                curriculum_title: curriculumTitle,
                experience_level: experienceLevel
            });
            setQuestions(data.questions || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load quiz", err);
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    };

    const handleStart = async () => {
        if (loading) return; // Prevent start if still loading
        
        if (questions.length === 0) {
            try {
                setLoading(true);
                const data = await curriculum.getQuiz(moduleId, {
                    curriculum_title: curriculumTitle,
                    experience_level: experienceLevel
                });
                
                if (data && data.questions && data.questions.length > 0) {
                    setQuestions(data.questions);
                    setStep('QUESTION');
                    setTimeout(scrollToTop, 0);
                }
            } catch (err) {
                console.error("Failed to load quiz", err);
            } finally {
                setLoading(false);
            }
            return;
        }

        setStep('QUESTION');
        setTimeout(scrollToTop, 0);
    };

    const handleRetry = () => {
         setAnswers({});
         setScore(0);
         setCurrentQuestionIdx(0);
         setShowCorrection(false);
         setStep('QUESTION');
         // Scroll to top when retrying
         setTimeout(scrollToTop, 0);
    };

    const handleOptionSelect = (optionId) => {
        if (showCorrection) return; // Prevent changing after selection
        
        const currentQ = questions[currentQuestionIdx];
        setAnswers(prev => ({ ...prev, [currentQ.id]: optionId }));
        setShowCorrection(true);
    };

    const handleNext = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setShowCorrection(false);
            // Scroll to top on next question
            setTimeout(scrollToTop, 0);
        } else {
            calculateScore();
        }
    };

    const calculateScore = async () => {
        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctOptionId) {
                correctCount++;
            }
        });

        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);
        
        setStep('RESULTS');
        
        // Only submit and celebrate if passed
        if (finalScore >= PASS_MARK) {
            try {
                const payload = { answers: answers || {}, questions: questions || [] }; console.log('QuizModal submitting:', payload); await curriculum.submitQuiz(moduleId, payload);
                // onComplete deferred to button click
            } catch (err) {
                console.error("Failed to submit quiz", err);
            }

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 2000
            });
        }
    };

    // Helper to format text with inline code
    const formatText = (text) => {
        if (!text) return "";
        const parts = text.split('`');
        return parts.map((part, index) => {
            if (index % 2 === 1) {
                // Odd indices are code
                return <code key={index} className={styles.inlineCode}>{part}</code>;
            }
            return part;
        });
    };

    if (!isOpen) return null;

    // Calculate progress for display
    let progressPercentage = 0;
    if (questions.length > 0) {
        if (step === 'RESULTS') {
            progressPercentage = 100;
        } else {
            progressPercentage = ((currentQuestionIdx + 1) / questions.length) * 100;
        }
    }

    const isPassed = score >= PASS_MARK;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        <TrophyIconSimple size={20} fill="#ffd700" />
                        <span>{moduleTitle} Quiz</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <XIcon size={20} />
                    </button>
                </div>

                {/* Progress Bar - Persistent */}
                {questions.length > 0 && step !== 'INTRO' && (
                     <div style={{ width: '100%', padding: '0 2rem', marginTop: '1.5rem' }}>
                        <div className={styles.progressContainer} style={{ marginBottom: 0 }}>
                            <div 
                                className={styles.progressBar} 
                                style={{ width: `${progressPercentage}%`, background: isPassed || step !== 'RESULTS' ? 'linear-gradient(90deg, #10b981, #34d399)' : '#ef4444' }}
                            ></div>
                        </div>
                     </div>
                )}

                {/* Content */}
                <div className={styles.content} ref={contentRef}>
                    {/* Intro State - Always visible initially, button handles loading */}
                    {step === 'INTRO' && (
                        <>
                            <div className={styles.introIcon}>🎯</div>
                            <h2 className={styles.introTitle}>Ready to test your skills?</h2>
                            <p className={styles.introDesc}>
                                You'll face 10 questions to verify your understanding of <strong>{moduleTitle}</strong>.
                                <br/><br/>
                                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Pass Mark: {PASS_MARK}%</span>
                            </p>
                            <div className={styles.footer} style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                                <button 
                                    className={styles.primaryBtn} 
                                    onClick={handleStart}
                                    disabled={loading}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px', justifyContent: 'center' }}
                                >
                                    {loading ? <Spinner size={20} color="white" /> : 'Start Quiz'}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Question State - Renders only if questions exist */}
                    {step === 'QUESTION' && (
                        loading ? (
                             <div style={{ color: '#a1a1aa' }}>Loading fallback...</div> // Should typically be caught by Intro
                        ) : questions.length > 0 ? (
                            <div className={styles.questionContainer}>
                                
                                <div style={{ marginBottom: '1rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Question {currentQuestionIdx + 1} of {questions.length}
                                </div>

                                <h3 className={styles.questionText}>
                                    {formatText(questions[currentQuestionIdx].text)}
                                </h3>

                                <div className={styles.optionsGrid}>
                                    {questions[currentQuestionIdx].options.map(opt => {
                                        const isSelected = answers[questions[currentQuestionIdx].id] === opt.id;
                                        const isCorrect = opt.id === questions[currentQuestionIdx].correctOptionId;
                                        
                                        let className = styles.optionBtn;
                                        if (showCorrection) {
                                            if (isCorrect) className += ` ${styles.correct}`;
                                            else if (isSelected) className += ` ${styles.incorrect}`;
                                        } else if (isSelected) {
                                            className += ` ${styles.selected}`;
                                        }

                                        return (
                                            <button 
                                                key={opt.id}
                                                className={className}
                                                onClick={() => handleOptionSelect(opt.id)}
                                                disabled={showCorrection}
                                            >
                                                <span>{formatText(opt.text)}</span>
                                                {showCorrection && isCorrect && <CheckCircleIcon size={16} fill="currentColor" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className={styles.footer} style={{ marginTop: '2rem', padding: '1.5rem 0 0 0', border: 'none' }}>
                                    <button 
                                        className={styles.primaryBtn}
                                        onClick={handleNext}
                                        disabled={!showCorrection} // Force answer before next
                                    >
                                        {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#ef4444' }}>
                                Failed to load questions. Please try again.
                            </div>
                        )
                    )}

                    {step === 'RESULTS' && (
                        <>
                            <div className={styles.scoreCircle} style={{ 
                                borderColor: isPassed ? '#10b981' : '#ef4444',
                                color: isPassed ? '#10b981' : '#ef4444',
                                background: isPassed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                                boxShadow: isPassed ? '0 0 30px rgba(16, 185, 129, 0.2)' : '0 0 30px rgba(239, 68, 68, 0.2)'
                            }}>
                                {score}%
                            </div>
                            <h2 className={styles.resultMessage}>
                                {isPassed ? "Excellent Work!" : "Keep Learning!"}
                            </h2>
                            <p className={styles.resultSubtext}>
                                {isPassed 
                                    ? `You passed the ${moduleTitle} quiz!` 
                                    : `You need ${PASS_MARK}% to pass. Review the material and try again—you've got this!`}
                            </p>
                            <div className={styles.footer} style={{ width: '100%', justifyContent: 'center', gap: '1rem', border: 'none' }}>
                                {isPassed ? (
                                    <button className={styles.primaryBtn} onClick={() => onComplete(score)}>
                                        Complete & Continue
                                    </button>
                                ) : (
                                    <button className={styles.primaryBtn} onClick={onClose} style={{ background: '#3f3f46', color: 'white' }}>
                                        Retry Quiz
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
