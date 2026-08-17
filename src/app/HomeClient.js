"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { ZapIcon, SearchIcon, ChevronRight, CheckCircleIcon, VideoIcon, MessageSquareIcon } from '@/components/Icons';
import IntegratedSearchBar from '@/components/IntegratedSearchBar';
import FadeIn from '@/components/FadeIn';
import CourseMarquee from '@/components/CourseMarquee';
import PricingSection from '@/components/PricingSection';
import { faqs } from '@/lib/faq';

const HowItWorksAnimation = dynamic(() => import('@/components/HowItWorksAnimation'), { ssr: false });

export default function HomeClient({ featuredCourses = [] }) {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    // Owned here so the scrolling skill pills can fill the hero search box.
    const [heroQuery, setHeroQuery] = useState('');
    const heroInputRef = useRef(null);

    const pickExample = (example) => {
        setHeroQuery(example);
        heroInputRef.current?.focus();
    };

    useEffect(() => {
        const scroller = document.querySelector('main');
        const target = scroller || window;
        const getY = () => (target === window ? window.scrollY : target.scrollTop);
        const onScroll = () => setScrolled(getY() > 0);
        onScroll();
        target.addEventListener('scroll', onScroll, { passive: true });
        return () => target.removeEventListener('scroll', onScroll);
    }, []);

    const handleSearch = (params) => {
        // params carries the topic plus any duration / level picked on the bar.
        const queryString = new URLSearchParams(params).toString();
        router.push(`/curriculum?${queryString}`);
    };


    const topics = ['Next.js 14', 'Python for AI', 'UI/UX Principles', 'Rust Foundations', 'Cybersecurity', 'Digital Marketing', 'SQL & Databases', 'AWS Fundamentals', 'Three.js', 'System Design', 'Git & GitHub', 'API Design', 'Docker Mastery', 'Figma Secrets', 'Blockchain Dev'];
    const marqueeTopics = [...topics, ...topics];
    const reversedTopics = [...topics].reverse();
    const marqueeTopicsReverse = [...reversedTopics, ...reversedTopics];

    const examples = [
        "Graphic Design", "Software Development", "Forex & Crypto Trading", "Data Analysis",
        "Content Creation", "Cybersecurity", "Virtual Assistance", "UI/UX Design",
        "Copywriting", "Cloud Computing (AWS)", "Social Media Management", "AI & Machine Learning",
        "Video Editing", "Product Management", "SEO", "Mobile App Development",
        "Project Management", "Digital Marketing", "Fintech Development", "DevOps Engineering"
    ];
    const marqueeExamples = [...examples, ...examples];

    const whyCards = [
        {
            title: "One path, not eight playlists",
            text: "Type a tech skill and get a single ordered course built from the best YouTube videos , no more juggling half-finished playlists and twelve open tabs.",
            gradient: "linear-gradient(135deg, #eab308, #f59e0b)"
        },
        {
            title: "Answers inside the video",
            text: "The AI tutor sits next to every video. Ask at the exact timestamp you got stuck and it answers in context , no pausing to Google what the speaker just said.",
            gradient: "linear-gradient(135deg, #10b981, #3b82f6)"
        },
        {
            title: "Quizzes that keep you honest",
            text: "Every module ends with an AI-generated quiz tied to the videos you just watched, so progress means you actually got it , not that you let it autoplay.",
            gradient: "linear-gradient(135deg, #f59e0b, #ec4899)"
        },
        {
            title: "A certificate anyone can verify",
            text: "Finish the path and pass the quizzes to earn a Certificate of Completion with a unique verification code and a public link.",
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)"
        },
        {
            title: "Momentum built in",
            text: "Streaks, XP, and a progress map turn showing up daily into a habit , designed to get you to the end, not just the sign-up.",
            gradient: "linear-gradient(135deg, #f43f5e, #fb7185)"
        }
    ];

    const marqueeWhyCards = [...whyCards, ...whyCards];

    return (
        <div className={styles.container}>

            <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
                <div className={styles.headerInner}>
                    <div className={styles.headerBrand}>
                        <Image src="/Primerly Logo.png" alt="Primerly" width={24} height={24} priority />
                        Primerly
                    </div>
                    <nav className={styles.headerNav} aria-label="Primary">
                        <a href="#how-it-works" className={styles.headerNavLink}>How it works</a>
                        {/* <Link href="/explore" className={styles.headerNavLink}>Explore</Link> */}
                        <a href="#reviews" className={styles.headerNavLink}>Why Primerly</a>
                        <a href="#community" className={styles.headerNavLink}>Community</a>
                        <a href="#topics" className={styles.headerNavLink}>Topics</a>
                        <a href="#faq" className={styles.headerNavLink}>FAQ</a>
                    </nav>
                    <div className={styles.headerActions}>
                        <Link href="/login" className={styles.headerLogin}>Log In</Link>
                        <Link href="/signup" className={styles.ctaSmall}>Sign Up</Link>
                    </div>
                </div>
            </header>

            {/* 1. HERO SECTION */}
            <section className={styles.hero}>
                <div className={styles.heroGrain} aria-hidden />
                <FadeIn direction="up">
                    <h1 className={styles.title}>
                        Learn in-demand tech skills, with your personal <span className={styles.titleAccent}>AI tutor</span>
                    </h1>
                </FadeIn>
                <FadeIn direction="up" delay={0.1}>
                    <p className={styles.subtitle}>
                        Primerly builds a personalised & structured course from the best YouTube videos. You get an AI tutor, quizzes, practice projects, and a community to keep you consistent.
                    </p>
                </FadeIn>

                <FadeIn direction="up" delay={0.2} className={styles.heroFooter} style={{ width: '100%', flexDirection: 'column' }}>
                    <div className={styles.marqueeContainer} style={{ maxWidth: '900px', margin: '0 auto', maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)' }}>
                        <div className={styles.marqueeTrack} style={{ animationDuration: '60s' }}>
                            {marqueeExamples.map((ex, i) => (
                                <button
                                    key={`${ex}-${i}`}
                                    type="button"
                                    className={styles.examplePill}
                                    style={{ whiteSpace: 'nowrap' }}
                                    onClick={() => pickExample(ex)}
                                    aria-label={`Search for ${ex}`}
                                >
                                    {ex}
                                </button>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                <IntegratedSearchBar
                    onSearch={handleSearch}
                    value={heroQuery}
                    onValueChange={setHeroQuery}
                    inputRef={heroInputRef}
                />
            </section>

            {/* 2. PUBLISHED COURSES , only rendered when real published courses exist */}
            {/* {featuredCourses.length > 0 && (
                <section id="courses" className={styles.courseMarqueeSection}>
                    <FadeIn>
                        <div className={styles.courseMarqueeHeader}>
                            <h2 className={styles.courseMarqueeHeading}>
                                Courses built by Primerly learners
                            </h2>
                            <Link href="/explore" className={styles.courseMarqueeLink}>
                                Explore all courses →
                            </Link>
                        </div>
                    </FadeIn>
                    <CourseMarquee courses={featuredCourses} />
                </section>
            )} */}

            {/* 3. HOW IT WORKS SECTION */}
            <section id="how-it-works" className={styles.howItWorks}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>How it works</h2>
                </FadeIn>
                <div className={styles.featureStack}>
                    {[
                        {
                            icon: <SearchIcon size={28} />,
                            title: "Type what you want to learn",
                            description: "Primerly pulls the right YouTube videos, articles, and orders them into a focused course so you stop bouncing between random tutorials.",
                            scene: "setYourGoal",
                        },
                        {
                            icon: <VideoIcon size={28} />,
                            title: "Learn with your AI tutor",
                            description: "Your AI Tutor can see your screen and your current lesson. Ask anything at any time and it answers in context, grounded in what it sees, not a generic web search.",
                            scene: "learnWithAITutor",
                        },
                        {
                            icon: <CheckCircleIcon size={28} />,
                            title: "Prove it with quizzes and projects",
                            description: "Each module ends with a quiz and practice project tied to the videos you just watched. Move on only when you've actually got it.",
                            scene: "quiz",
                        },
                        {
                            icon: <ZapIcon size={28} />,
                            title: "Stay consistent",
                            description: "Streaks, XP, and a progress map keep you moving. Finish every topic and pass every quiz, and you walk away with a shareable Certificate of Completion anyone can verify.",
                            scene: "gamifiedMotivation",
                        },
                        {
                            icon: <MessageSquareIcon size={28} />,
                            title: "Stay accountable with community",
                            description: "Drop questions in topic channels and compare paths with people learning the same thing.",
                            scene: "communityQuestion",
                        },
                    ].map((card, i) => (
                        <FadeIn
                            key={card.scene}
                            direction="up"
                            delay={0.05}
                            className={styles.featureCard}
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

            {/* 4. WHY PRIMERLY SECTION */}
            <section id="reviews" className={styles.testimonialsSection}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>Built for how learners actually learn</h2>
                </FadeIn>
                <div className={styles.marqueeContainer} style={{ marginTop: '60px', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
                    <div className={styles.testimonialMarqueeTrack}>
                        {marqueeWhyCards.map((item, i) => (
                            <div key={i} className={styles.testimonialCard}>
                                <div style={{ width: '44px', height: '4px', borderRadius: '2px', background: item.gradient, marginBottom: '20px' }}></div>
                                <div style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '10px' }}>{item.title}</div>
                                <p className={styles.quote}>{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. LEARN BETTER TOGETHER (COMMUNITY) SECTION */}
            <section id="community" className={styles.communitySection}>
                <div className={styles.communityContent}>
                    <FadeIn direction="right">
                        <h2 className={styles.communityTitle}>Learn better, together.</h2>
                        <p className={styles.communityText}>Join communities, share your progress, and stay accountable with people learning the same thing.</p>
                        <div className={styles.communityTags}>
                            <span className={styles.communityTag}>#DataScience</span>
                            <span className={styles.communityTag}>#VideoEditing</span>
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
                                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>A learner in #ReactMastery</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>example post</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Finally understood <strong>useEffect</strong> thanks to the module 3 visualizer! 🚀
                            </div>
                        </div>
                        <div className={styles.mockReplyCard}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}></div>
                                <div>
                                    <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>A reply from the channel</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>example reply</div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                                Same! The quiz on module 3 cemented it for me 🧠✨
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* 6. POPULAR TOPICS SECTION */}
            <section id="topics" className={styles.topicsSection}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>Endless Learning Possibilities</h2>
                </FadeIn>
                <div className={styles.marqueeContainer} style={{ marginBottom: '24px' }}>
                    <div className={styles.marqueeTrack}>
                        {marqueeTopics.map((topic, i) => (
                            <div key={`${topic}-${i}-1`} className={styles.topicCard} style={{ minWidth: '220px' }}>
                                <div className={styles.topicTitle}>{topic}</div>
                                <div className={styles.topicMeta}>
                                    <span>Path • Quizzes • Certificate</span>
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
                                    <span>Path • Quizzes • Certificate</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. PRICING SECTION */}
            <PricingSection />

            {/* 8. CTA SECTION */}
            <section className={styles.ctaSection}>
                <FadeIn direction="up" className={styles.flexColumnCentered}>
                    <h2>Stop scrolling. Start finishing.</h2>
                    <p>Turn your goal into a personalised course you'll actually complete.</p>
                    <Link href="/signup" className={styles.ctaButtonLarge}>Get Started for Free</Link>
                </FadeIn>
            </section>

            {/* 8. FAQ SECTION */}
            <div id="faq"><FAQSection /></div>

            {/* 9. FOOTER */}
            <footer className={styles.mainFooter}>
                <div className={styles.footerGrid}>
                    <div className={styles.footerBrand}>
                        <div style={{ display: 'flex', gap: '8px', fontWeight: '800', fontSize: '1.2rem', alignItems: 'center' }}>
                            <Image src="/Primerly Logo.png" alt="Primerly" width={24} height={24} />
                            Primerly
                        </div>
                        <p>Personalised learning roadmap + AI Tutor + Community.</p>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Contact</h4>
                        <div className={styles.footerLinks}>
                            <a href="https://x.com/primerlyapp" aria-label="Twitter">Twitter / X</a>
                            <a href="https://www.linkedin.com/company/primerly/" aria-label="LinkedIn">LinkedIn</a>
                            <a href="mailto:hello@primerly.app">Email</a>
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
                    <div>&copy; {new Date().getFullYear()} Primerly All Rights Reserved.</div>
                </div>
            </footer>
        </div>
    );
}

function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className={styles.faqSection}>
            <div className={styles.faqContainer}>
                <FadeIn>
                    <h2 className={styles.sectionHeading} style={{ marginBottom: '40px', textAlign: 'center' }}>Frequently Asked Questions</h2>
                </FadeIn>
                <div style={{ width: '100%' }}>
                    {faqs.map((item, i) => (
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


