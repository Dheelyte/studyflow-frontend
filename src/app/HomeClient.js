"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { ZapIcon, SearchIcon, StarIcon, ChevronRight, CheckCircleIcon, VideoIcon, MessageSquareIcon } from '@/components/Icons';
import IntegratedSearchBar from '@/components/IntegratedSearchBar';
import FadeIn from '@/components/FadeIn';

const HowItWorksAnimation = dynamic(() => import('@/components/HowItWorksAnimation'), { ssr: false });

export default function HomeClient() {
    const router = useRouter();

    const handleSearch = (params) => {
        const query = { topic: params.topic };
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

    const testimonials = [
        {
            quote: "I was overwhelmed by the amount of React tutorials online. Primerly curated exactly what I needed.",
            name: "Chinedu O.",
            role: "Frontend Dev",
            color: "#eab308",
            gradient: "linear-gradient(135deg, #eab308, #f59e0b)"
        },
        {
            quote: "The gamification keeps me coming back. I finally finished a course without dropping out halfway!",
            name: "Amara N.",
            role: "Student",
            color: "#10b981",
            gradient: "linear-gradient(135deg, #10b981, #3b82f6)"
        },
        {
            quote: "Community support is unmatched. I got help with my Python bug in minutes.",
            name: "Yusuf I.",
            role: "Data Analyst",
            color: "#ec4899",
            gradient: "linear-gradient(135deg, #f59e0b, #ec4899)"
        },
        {
            quote: "I landed my first job after completing the Full Stack path. Best investment ever.",
            name: "Sarah J.",
            role: "Junior Dev",
            color: "#6366f1",
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)"
        },
        {
            quote: "The personalized roadmap saved me months of aimless searching.",
            name: "David K.",
            role: "Product Designer",
            color: "#f43f5e",
            gradient: "linear-gradient(135deg, #f43f5e, #fb7185)"
        }
    ];

    const marqueeTestimonials = [...testimonials, ...testimonials];

    return (
        <div className={styles.container}>

            <header className={styles.header}>
                <div className={styles.headerBrand}>
                    <ZapIcon size={24} fill="var(--primary)" /> Primerly
                </div>
                <div className={styles.headerActions}>
                    <Link href="/login" style={{ color: 'var(--foreground)', fontWeight: '600', textDecoration: 'none' }}>Log In</Link>
                    <Link href="/signup" className={styles.ctaSmall}>Sign Up</Link>
                </div>
            </header>

            {/* 1. HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroBgExtra} aria-hidden />
                <div className={styles.heroGrain} aria-hidden />
                <FadeIn direction="up">
                    <h1 className={styles.title}>
                        Master <span className={styles.titleAccent}>any skill</span> with your personal <span className={styles.titleAccent}>AI tutor</span>.
                    </h1>
                </FadeIn>
                <FadeIn direction="up" delay={0.1}>
                    <p className={styles.subtitle}>
                        AI builds your personalized roadmap, an on-demand video tutor explains every concept, smart quizzes lock in what you learn, and a community keeps you moving.
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

                <FadeIn direction="up" delay={0.3} style={{ width: '100%', maxWidth: '900px', marginTop: '12px' }}>
                    <IntegratedSearchBar onSearch={handleSearch} />
                </FadeIn>
            </section>

            {/* 2. HOW IT WORKS SECTION */}
            <section className={styles.howItWorks}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>How it works</h2>
                </FadeIn>
                <div className={styles.featureStack}>
                    {[
                        {
                            icon: <SearchIcon size={28} />,
                            title: "Set your goal",
                            description: "Tell Primerly the topic you want to master. A single sentence turns into a full, personalized learning path — hand-picked videos, notes, and quizzes.",
                            scene: "setYourGoal",
                        },
                        {
                            icon: <VideoIcon size={28} />,
                            title: "Learn with your AI Tutor",
                            description: "Watch curated videos organized into a clear curriculum. Tap Explain this ✨ on any lesson and your tutor breaks it down — no judgement, no context-switching.",
                            scene: "learnWithAITutor",
                        },
                        {
                            icon: <CheckCircleIcon size={28} />,
                            title: "Master with quizzes",
                            description: "Every module ends with an AI-generated quiz. Get instant feedback, celebrate the wins, and move on only when you've actually got it.",
                            scene: "quiz",
                        },
                        {
                            icon: <ZapIcon size={28} />,
                            title: "Stay motivated",
                            description: "Streaks, XP, and a heatmap of your grind turn every study session into visible progress you'll want to protect.",
                            scene: "gamifiedMotivation",
                        },
                        {
                            icon: <MessageSquareIcon size={28} />,
                            title: "Grow with community",
                            description: "Ask questions in topic communities and learn from people on the same path. Likes, comments, and friendly nudges make the journey feel less solo.",
                            scene: "communityQuestion",
                        },
                    ].map((card, i) => (
                        <FadeIn
                            key={card.scene}
                            direction="up"
                            delay={0.05}
                            className={`${styles.featureCard} ${i % 2 === 1 ? styles.featureCardReverse : ""}`}
                        >
                            <div className={styles.featureCardText}>
                                <div className={styles.featureCardIcon}>{card.icon}</div>
                                <h3 className={styles.featureCardTitle}>{card.title}</h3>
                                <p className={styles.featureCardDescription}>{card.description}</p>
                            </div>
                            <div className={styles.featureCardMedia}>
                                <HowItWorksAnimation scene={card.scene} />
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* 4. LEARN BETTER TOGETHER (COMMUNITY) SECTION */}
            <section className={styles.communitySection}>
                <div className={styles.communityContent}>
                    <FadeIn direction="right">
                        <h2 className={styles.communityTitle}>Learn better, together.</h2>
                        <p className={styles.communityText}>Join thousands of learners in topic-specific channels. Share progress, drop reactions, spin up threaded replies, and stay motivated together.</p>
                        <div className={styles.communityTags}>
                            <span className={styles.communityTag}>#ReactJs</span>
                            <span className={styles.communityTag}>#Python</span>
                            <span className={styles.communityTag}>#MachineLearning</span>
                            <span className={styles.communityTag}>#Web3</span>
                            <span className={styles.communityTag}>#Design</span>
                        </div>
                        <Link href="/community" className={styles.ctaButtonOutline}>Explore Communities</Link>
                    </FadeIn>
                </div>
                <div className={styles.communityVisual}>
                    <FadeIn direction="left" delay={0.2} className={styles.mockPostStack}>
                        <div className={styles.mockPostCard}>
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
                                <span>❤️ 142</span>
                                <span>💬 18</span>
                                <span>🔁 6</span>
                            </div>
                        </div>
                        <div className={styles.mockReplyCard}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}></div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>David K.</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>replying to Sarah</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                                Same! The quiz on module 3 cemented it for me 🧠✨
                            </div>
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
                <div className={styles.marqueeContainer} style={{ marginTop: '60px', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                    <div className={styles.testimonialMarqueeTrack}>
                        {marqueeTestimonials.map((item, i) => (
                            <div key={i} className={styles.testimonialCard}>
                                <div style={{ marginBottom: '24px', display: 'flex', gap: '4px', color: '#eab308' }}>
                                    {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} size={16} fill="currentColor" stroke="none" />)}
                                </div>
                                <p className={styles.quote}>&quot;{item.quote}&quot;</p>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div className={styles.avatarRing} style={{ background: item.gradient || 'var(--primary)' }}>
                                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--card)' }}></div>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>{item.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. CTA SECTION */}
            <section className={styles.ctaSection}>
                <FadeIn direction="up" className={styles.flexColumnCentered}>
                    <h2>Ready to start your flow?</h2>
                    <p>Join learners mastering new skills every day.</p>
                    <Link href="/signup" className={styles.ctaButtonLarge}>Get Started for Free</Link>
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
                            <Link href="/curriculum">Curriculum</Link>
                            <Link href="/library">Library</Link>
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/community">Community</Link>
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
        { q: "How accurate is the AI?", a: "We use Claude to curate high-quality resources. The content is constantly vetted by our algorithm." },
        { q: "How does the streak system work?", a: "You build a streak by completing at least one lesson or quiz every day. Streaks unlock special badges and community flair!" },
        { q: "Can I share my progress?", a: "Absolutely. You can share your daily streaks to social media or directly with your friends." },
        { q: "What topics can I learn?", a: "Anything! From 'Quantum Physics' to 'Cake Baking'. If it has online resources, Primerly can build a path for it." },
        { q: "How do I join a community?", a: "Once you start a course, you're automatically invited to the relevant topic channel where you can chat with fellow learners." },
        { q: "What is the AI Tutor?", a: "Every lesson opens in an interactive video player. Hit 'Explain this ✨' whenever something feels fuzzy and the AI tutor breaks it down in plain language, in context." },
        { q: "How do quizzes work?", a: "Each module ships with an AI-generated quiz tuned to the lessons you just finished. Passing it earns XP, fuels your streak, and confirms you've actually mastered the material." },
        { q: "Can I sign in with Google, GitHub, or Apple?", a: "Yes. One-click social sign-in is supported for Google, GitHub, and Apple — no password required." },
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


