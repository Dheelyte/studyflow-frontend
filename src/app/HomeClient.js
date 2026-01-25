"use client";
import { useState, useRef, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { ZapIcon, TrophyIconSimple, CheckIcon, UsersIcon, SearchIcon, PlayIcon, StarIcon, PlusIcon, ChevronRight } from '@/components/Icons';
import WaitlistForm from '@/components/WaitlistForm';
import TypingText from '@/components/TypingText';
import FadeIn from '@/components/FadeIn';

export default function HomeClient() {
    const router = useRouter();
    const videoRef = useRef(null);
    const container = useRef(null);
    const { scrollYProgress } = useScroll({ target: container, offset: ['start start', 'end end'] });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        videoRef.current?.play().catch(e => console.log('Autoplay prevented', e));
                    } else {
                        videoRef.current?.pause();
                    }
                });
            },
            { threshold: 0.9 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleSearch = (params) => {
        const query = {
            topic: params.topic,
            experience: params.experience,
            duration: params.duration
        };
        const queryString = new URLSearchParams(query).toString();
        router.push(`/curriculum?${queryString}`);
    };


    const topics = ['Next.js 14', 'Python for AI', 'UI/UX Principles', 'Rust Foundations', 'Cybersecurity', 'Digital Marketing', 'Piano Basics', 'Calculus I', 'Three.js', 'System Design', 'Japanese N5', 'Guitar Solos', 'Docker Mastery', 'Figma Secrets', 'Blockchain Dev'];
    const marqueeTopics = [...topics, ...topics];
    const marqueeTopicsReverse = [...topics.reverse(), ...topics];

    const examples = [
        "Python for Beginners", "History of Jazz", "Calculus II", "Digital Photography",
        "React Hooks", "Machine Learning Basics", "Creative Writing", "SEO Strategies",
        "Public Speaking", "Watercolor Painting", "Financial Literacy", "Yoga for Beginners",
        "Cybersecurity Fundamentals", "Interior Design", "Music Theory"
    ];
    const marqueeExamples = [...examples, ...examples];

    return (
        <div className={styles.container}>

            <header className={styles.header}>
                <div className={styles.headerBrand}>
                    <ZapIcon size={24} fill="var(--primary)" /> Primerly
                </div>
                <div className={styles.headerActions}>
                    {/* <Link href="/login" style={{ color: 'var(--foreground)', fontWeight: '600', textDecoration: 'none' }}>Log In</Link> */}
                    {/* <Link href="/signup" className={styles.ctaSmall}>Sign Up</Link> */}
                </div>
            </header>

            {/* 1. HERO SECTION */}
            <section className={styles.hero}>
                <FadeIn direction="up">
                    <h1 className={styles.title}>Master any skill with an AI roadmap.</h1>
                </FadeIn>
                <FadeIn direction="up" delay={0.1}>
                    <p className={styles.subtitle}>
                        Our AI builds your path, finds the best learning resources for every step, tracks your progress, and connects you with a learning community.
                    </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.2} className={styles.heroFooter} style={{ width: '100%', flexDirection: 'column' }}>
                    <div className={styles.marqueeContainer} style={{ maxWidth: '900px', margin: '0 auto', maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}>
                        <div className={styles.marqueeTrack} style={{ animationDuration: '60s' }}>
                            {marqueeExamples.map((ex, i) => (
                                <span key={`${ex}-${i}`} className={styles.examplePill} style={{ whiteSpace: 'nowrap' }}>
                                    {ex}
                                </span>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.3} style={{ width: '100%', maxWidth: '600px', marginTop: '12px' }}>
                    <WaitlistForm />
                </FadeIn>

                <FadeIn direction="up" delay={0.4} style={{ marginTop: '48px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3)',
                        border: '1px solid var(--border)',
                        maxWidth: '1000px',
                        width: '100%'
                    }}>
                        <video
                            ref={videoRef}
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', display: 'block' }}
                        >
                            <source src="/recording.mp4" type="video/mp4" />
                        </video>
                    </div>
                </FadeIn>
            </section>

            {/* 2. HOW IT WORKS SECTION */}
            <section className={styles.howItWorks}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>How it works</h2>
                </FadeIn>
                <div className={styles.stepsGrid}>
                    <FadeIn direction="up" delay={0.1} className={styles.stepCard}>
                        <div className={styles.stepIconBg}>
                            <SearchIcon size={32} />
                        </div>
                        <h3>Set your Goal</h3>
                        <p className={styles.featureText}>
                            I want to learn <TypingText words={["React Hooks", "Astrophysics", "Python", "Data Science", "Piano", "Spanish"]} />
                        </p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.2} className={styles.stepCard}>
                        <div className={styles.stepIconBg}>
                            <ZapIcon size={32} />
                        </div>
                        <h3>AI Generation</h3>
                        <p className={styles.featureText}>Our engine scrapes the best videos, articles, and quizzes to build your path.</p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.3} className={styles.stepCard}>
                        <div className={styles.stepIconBg}>
                            <PlayIcon size={32} />
                        </div>
                        <h3>Start Learning</h3>
                        <p className={styles.featureText}>Follow the playlist, track progress, and chat with the community.</p>
                    </FadeIn>
                </div>
            </section>

            {/* 3. WHY Primerly (DYNAMIC STACK) SECTION */}
            <section className={styles.stackedSection} ref={container}>
                <FadeIn>
                    <h2 className={styles.sectionHeading} style={{ textAlign: 'center', marginBottom: '40px', marginTop: '40px' }}>Why Primerly?</h2>
                </FadeIn>
                <div className={styles.stackedContainer}>
                    {
                        [
                            {
                                title: "AI-Curated Paths", subtitle: "Personalized curriculum tailored to you",
                                desc: "We don't just serve you random videos. Our Gemini-powered engine analyzes thousands of resources to create a cohesive, step-by-step curriculum.",
                                color: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                visual: (<div className={styles.visualMockup}><div className={styles.pathContainer}><div className={styles.pathLine}></div><div className={styles.pathNode}><div className={styles.pathIcon}><PlayIcon size={12} fill="var(--primary)" /></div><span style={{ fontSize: "0.9rem", fontWeight: "600" }}>React Basics</span></div><div className={styles.pathNode}><div className={styles.pathIcon}><ZapIcon size={12} fill="var(--primary)" /></div><span style={{ fontSize: "0.9rem", fontWeight: "600" }}>Advanced Hooks</span></div><div className={styles.pathNode}><div className={styles.pathIcon}><StarIcon size={12} fill="var(--primary)" /></div><span style={{ fontSize: "0.9rem", fontWeight: "600" }}>Capstone Project</span></div></div></div>)
                            },
                            {
                                title: "Gamified Motivation", subtitle: "Track progress with streaks and XP",
                                desc: "Stay consistent with streaks, XP, and daily goals. We turn learning into a game you actually want to play.",
                                color: "linear-gradient(135deg, #eab308, #f59e0b)",
                                visual: (<div className={styles.streakCard}><div className={styles.streakFlame}>🔥</div><div className={styles.streakText}>12 Day Streak</div></div>)
                            },
                            {
                                title: "Community Powered", subtitle: "Join communities for every topic",
                                desc: "Never learn alone. Join niche communities for every topic. Share your notes and ask questions.",
                                color: "linear-gradient(135deg, #ec4899, #f43f5e)",
                                visual: (<div className={styles.chatContainer}><div className={`${styles.chatBubble} ${styles.chatLeft}`}>Has anyone finished module 4? 🙋‍♀️</div><div className={`${styles.chatBubble} ${styles.chatRight}`}>Yes! The visualizer helps properly.</div></div>)
                            }
                        ].map((card, i) => {
                            const targetScale = 1 - ((3 - i) * 0.05);
                            return <Card key={i} i={i} {...card} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale}>{card.visual}</Card>
                        })
                    }
                </div>
            </section>

            {/* 4. LEARN BETTER TOGETHER (COMMUNITY) SECTION */}
            <section className={styles.communitySection}>
                <div className={styles.communityContent}>
                    <FadeIn direction="right">
                        <h2 className={styles.communityTitle}>Learn better, together.</h2>
                        <p className={styles.communityText}>Join thousands of learners in topic-specific communities. Share your progress, get help, and stay motivated.</p>
                        <div className={styles.communityTags}>
                            <span className={styles.communityTag}>#ReactJs</span>
                            <span className={styles.communityTag}>#Python</span>
                            <span className={styles.communityTag}>#MachineLearning</span>
                            <span className={styles.communityTag}>#Web3</span>
                            <span className={styles.communityTag}>#Design</span>
                        </div>
                        {/* <Link href="/community" className={styles.ctaButtonOutline}>Explore Communities</Link> */}
                    </FadeIn>
                </div>
                <div className={styles.communityVisual}>
                    <FadeIn direction="left" delay={0.2} className={`${styles.mockPostCard} ${styles.mockPostCard1}`}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}></div>
                            <div>
                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>Sarah J.</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Just now • #ReactMastery</div>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '12px' }}>
                            Finally understood <strong>useEffect</strong> thanks to the module 3 visualizer! 🚀
                        </div>
                        <div style={{ display: 'flex', gap: '16px', color: 'var(--secondary)', fontSize: '0.85rem' }}>
                            <span>❤️ 24</span>
                            <span>💬 5</span>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* 5. POPULAR TOPICS SECTION */}
            <section className={styles.topicsSection}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>Endless Learning Possibilities</h2>
                </FadeIn>
                <div className={styles.marqueeContainer} style={{ marginBottom: '24px' }}>
                    <div className={styles.marqueeTrack}>
                        {marqueeTopics.map((topic, i) => (
                            <div key={`${topic}-${i}-1`} className={styles.topicCard} style={{ minWidth: '220px' }}>
                                <div className={styles.topicTitle}>{topic}</div>
                                <div className={styles.topicMeta}>
                                    <span>{40 + i} Resources</span>
                                    <span>{1200 + (i * 123)} Learners</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrackReverse}>
                        {marqueeTopicsReverse.map((topic, i) => (
                            <div key={`${topic}-${i}-2`} className={styles.topicCard} style={{ minWidth: '220px' }}>
                                <div className={styles.topicTitle}>{topic}</div>
                                <div className={styles.topicMeta}>
                                    <span>{30 + i} Resources</span>
                                    <span>{800 + (i * 45)} Learners</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. REVIEWS (TESTIMONIALS) SECTION */}
            <section className={styles.testimonialsSection}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>Loved by learners everywhere</h2>
                </FadeIn>
                <div className={styles.testimonialsGrid}>
                    <FadeIn delay={0.1} direction="up" className={styles.testimonialCard}>
                        <div style={{ marginBottom: '24px', display: 'flex', gap: '4px', color: '#eab308' }}>
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} size={16} fill="currentColor" stroke="none" />)}
                        </div>
                        <p className={styles.quote}>&quot;I was overwhelmed by the amount of React tutorials online. Primerly curated exactly what I needed.&quot;</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className={styles.avatarRing}><div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--card)' }}></div></div>
                            <div>
                                <div style={{ fontWeight: '700' }}>Chinedu O.</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Frontend Dev</div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.2} direction="up" className={styles.testimonialCard}>
                        <div style={{ marginBottom: '24px', display: 'flex', gap: '4px', color: '#eab308' }}>
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} size={16} fill="currentColor" stroke="none" />)}
                        </div>
                        <p className={styles.quote}>&quot;The gamification keeps me coming back. I finally finished a course without dropping out halfway!&quot;</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className={styles.avatarRing} style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}><div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--card)' }}></div></div>
                            <div>
                                <div style={{ fontWeight: '700' }}>Amara N.</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Student</div>
                            </div>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.3} direction="up" className={styles.testimonialCard}>
                        <div style={{ marginBottom: '24px', display: 'flex', gap: '4px', color: '#eab308' }}>
                            {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} size={16} fill="currentColor" stroke="none" />)}
                        </div>
                        <p className={styles.quote}>&quot;Community support is unmatched. I got help with my Python bug in minutes.&quot;</p>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div className={styles.avatarRing} style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)' }}><div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--card)' }}></div></div>
                            <div>
                                <div style={{ fontWeight: '700' }}>Yusuf I.</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Data Analyst</div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* 7. CTA SECTION */}
            <section className={styles.ctaSection}>
                <FadeIn direction="up" className={styles.flexColumnCentered}>
                    <h2>Ready to start your flow?</h2>
                    <p>Join learners mastering new skills every day. Join the Waitlist.</p>
                    <div style={{ width: '100%', maxWidth: '600px' }}>
                        <WaitlistForm />
                    </div>
                </FadeIn>
            </section>

            {/* 8. FAQ SECTION */}
            <FAQSection />

            {/* 9. FOOTER */}
            <footer className={styles.mainFooter}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <div style={{ display: 'flex', gap: '8px', fontWeight: '800', fontSize: '1.2rem', alignItems: 'center' }}>
                            <ZapIcon size={24} fill="var(--primary)" /> Primerly
                        </div>
                        <p>The AI-powered curriculum designer that helps you master any topic.</p>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Product</h4>
                        <div className={styles.footerLinks}>
                            {/* <Link href="/dashboard">Curriculum</Link> */}
                            {/* <Link href="/community">Community</Link> */}
                            <span style={{ color: 'var(--secondary)' }}>Curriculum</span>
                            <span style={{ color: 'var(--secondary)' }}>Community</span>
                        </div>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Company</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/about">About Us</Link>
                            <Link href="/contact">Contact</Link>
                        </div>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Legal</h4>
                        <div className={styles.footerLinks}>
                            <Link href="/privacy-policy">Privacy Policy</Link>
                            <Link href="/terms-of-service">Terms of Service</Link>
                            <Link href="/cookie-policy">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <div>&copy; {new Date().getFullYear()} Primerly.</div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <a href="https://x.com/primerlyapp" aria-label="Twitter">Twitter</a>
                        {/* <a href="#" aria-label="GitHub">GitHub</a> */}
                        <a href="https://www.linkedin.com/company/primerly/" aria-label="LinkedIn">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        { q: "Is Primerly really free?", a: "Yes! You can generate unlimited curriculums on the free plan. We may introduce premium features later." },
        { q: "How accurate is the AI?", a: "We use Gemini 3 Pro to curate high-quality resources. The content is constantly vetted by our algorithm." },
        { q: "Can I customize the curriculum?", a: "Not yet. But in future versions, you should be able to edit, remove, or reorder modules as you see fit." },
        { q: "Is there a mobile app?", a: "Primerly is fully responsive and works great on any device. A native app is coming soon!" }
    ];

    return (
        <section className={styles.faqSection}>
            <div className={styles.faqContainer}>
                <FadeIn>
                    <h2 className={styles.sectionHeading} style={{ marginBottom: '40px', textAlign: 'center' }}>Frequently Asked Questions</h2>
                </FadeIn>
                <div style={{ width: '100%' }}>
                    {questions.map((item, i) => (
                        <FadeIn key={i} delay={0.1 * i} direction="up" className={styles.faqItem} style={{ width: '100%' }}>
                            <button className={styles.faqQuestion} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                                {item.q}
                                <div style={{ transform: openIndex === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                                    <ChevronRight size={20} />
                                </div>
                            </button>
                            {openIndex === i && (
                                <div className={styles.faqAnswer}>
                                    {item.a}
                                </div>
                            )}
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}


function Card({ i, title, subtitle, description, color, children, progress, range, targetScale }) {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    });

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
    const scale = useTransform(progress, range, [1, targetScale]);

    return (
        <div ref={container} className={styles.cardContainer} style={{ top: `${i * 25}px` }}>
            <motion.div
                className={styles.dynamicCard}
                style={{ scale, top: `calc(-5% + ${i * 25}px)` }}
            >
                {/* Floating Background Particles */}
                {[...Array(15)].map((_, idx) => (
                    <div
                        key={idx}
                        className={styles.particle}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 200 + 50}px`,
                            height: `${Math.random() * 200 + 50}px`,
                            opacity: Math.random() * 0.09 + 0.03,
                            animationDuration: `${Math.random() * 10 + 20}s`,
                            animationDelay: `${Math.random() * 5}s`,
                            background: color,
                        }}
                    />
                ))}
                <div className={styles.dynamicCardContent}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: '800' }}>{title}</h3><div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '24px', letterSpacing: '0px', textTransform: 'none' }}>{subtitle}</div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--secondary)', lineHeight: '1.6' }}>{description}</p>
                </div>
                <div className={styles.dynamicCardVisual} style={{ background: color }}>
                    <motion.div style={{ scale: imageScale, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {children}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}