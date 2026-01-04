"use client";
import React, { useState, useEffect } from 'react';
import styles from './QuizModal.module.css';
import { XIcon, CheckCircleIcon, TrophyIconSimple } from '@/components/Icons';
import { curriculum } from '@/services/api';

export default function QuizModal({ isOpen, onClose, moduleTitle, moduleId, onComplete }) {
    const [step, setStep] = useState('INTRO'); // INTRO, QUESTION, RESULTS
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: optionId }
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showCorrection, setShowCorrection] = useState(false); // To show correct/incorrect after selection

    useEffect(() => {
        if (isOpen && moduleId) {
            loadQuiz();
        } else {
            // Reset state on close
            setStep('INTRO');
            setAnswers({});
            setScore(0);
            setCurrentQuestionIdx(0);
            setShowCorrection(false);
        }
    }, [isOpen, moduleId]);

    const loadQuiz = async () => {
        try {
            setLoading(true);
            const data = await curriculum.getQuiz(moduleId);
            setQuestions(data.questions || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load quiz", err);
            setLoading(false);
        }
    };

    const handleStart = () => {
        setStep('QUESTION');
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
        
        // Submit score
        try {
            await curriculum.submitQuiz(moduleId, finalScore);
            if (onComplete) onComplete(finalScore);
        } catch (err) {
            console.error("Failed to submit quiz", err);
        }

        setStep('RESULTS');
    };

    if (!isOpen) return null;

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

                {/* Content */}
                <div className={styles.content}>
                    {loading ? (
                        <div style={{ color: '#a1a1aa' }}>Loading quiz...</div>
                    ) : (
                        <>
                            {step === 'INTRO' && (
                                <>
                                    <div className={styles.introIcon}>🎯</div>
                                    <h2 className={styles.introTitle}>Ready to test your skills?</h2>
                                    <p className={styles.introDesc}>
                                        You'll face {questions.length} questions to verify your understanding of <strong>{moduleTitle}</strong>.
                                    </p>
                                    <div className={styles.footer} style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                                        <button className={styles.primaryBtn} onClick={handleStart}>
                                            Start Quiz
                                        </button>
                                    </div>
                                </>
                            )}

                            {step === 'QUESTION' && questions.length > 0 && (
                                <div className={styles.questionContainer}>
                                    <div className={styles.progressContainer}>
                                        <div 
                                            className={styles.progressBar} 
                                            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                                        ></div>
                                    </div>

                                    <div style={{ marginBottom: '1rem', color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Question {currentQuestionIdx + 1} of {questions.length}
                                    </div>

                                    <h3 className={styles.questionText}>
                                        {questions[currentQuestionIdx].text}
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
                                                    <span>{opt.text}</span>
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
                            )}

                            {step === 'RESULTS' && (
                                <>
                                    <div className={styles.scoreCircle}>
                                        {score}%
                                    </div>
                                    <h2 className={styles.resultMessage}>
                                        {score >= 80 ? "Excellent Work!" : (score >= 60 ? "Good Job!" : "Keep Learning!")}
                                    </h2>
                                    <p className={styles.resultSubtext}>
                                        You completed the {moduleTitle} quiz.
                                    </p>
                                    <div className={styles.footer} style={{ width: '100%', justifyContent: 'center', gap: '1rem', border: 'none' }}>
                                        <button className={styles.primaryBtn} onClick={onClose}>
                                            Complete & Continue
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
