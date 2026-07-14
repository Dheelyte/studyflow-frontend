"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import { ZapIcon, SearchIcon, StarIcon, ChevronRight, CheckCircleIcon, VideoIcon, MessageSquareIcon } from '@/components/Icons';
import IntegratedSearchBar from '@/components/IntegratedSearchBar';
import FadeIn from '@/components/FadeIn';
import ScrambleText from '@/components/ScrambleText';

const HowItWorksAnimation = dynamic(() => import('@/components/HowItWorksAnimation'), { ssr: false });

export default function HomeClient() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

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
        const query = { topic: params.topic };
        const queryString = new URLSearchParams(query).toString();
        router.push(`/curriculum?${queryString}`);
    };


    const topics = ['Next.js 14', 'Python for AI', 'UI/UX Principles', 'Rust Foundations', 'Cybersecurity', 'Digital Marketing', 'Piano Basics', 'Calculus I', 'Three.js', 'System Design', 'Japanese N5', 'Guitar Solos', 'Docker Mastery', 'Figma Secrets', 'Blockchain Dev'];
    const marqueeTopics = [...topics, ...topics];
    const marqueeTopicsReverse = [...topics.reverse(), ...topics];

    const examples = [
        "Graphic Design", "Software Development", "Forex & Crypto Trading", "Data Analysis",
        "Content Creation", "Cybersecurity", "Virtual Assistance", "UI/UX Design",
        "Copywriting", "Cloud Computing (AWS)", "Social Media Management", "AI & Machine Learning",
        "Video Editing", "Product Management", "SEO", "Mobile App Development",
        "Project Management", "Digital Marketing", "Fintech Development", "DevOps Engineering"
    ];
    const marqueeExamples = [...examples, ...examples];

    const testimonials = [
        {
            quote: "I used to drown in eight React playlists at once. Primerly gave me one path — and an AI tutor that actually answered my questions in context.",
            name: "Chinedu O.",
            role: "Frontend Dev",
            color: "#eab308",
            gradient: "linear-gradient(135deg, #eab308, #f59e0b)"
        },
        {
            quote: "I had never finished a YouTube course before. The streaks and quizzes pulled me all the way through to the certificate.",
            name: "Amara N.",
            role: "Student",
            color: "#10b981",
            gradient: "linear-gradient(135deg, #10b981, #3b82f6)"
        },
        {
            quote: "Asking the tutor at the exact second I got stuck in the video was the unlock. No more pausing to Google what the speaker just said.",
            name: "Yusuf I.",
            role: "Data Analyst",
            color: "#ec4899",
            gradient: "linear-gradient(135deg, #f59e0b, #ec4899)"
        },
        {
            quote: "Structured path plus a verifiable certificate at the end — I finally have something to show recruiters from my self-study.",
            name: "Sarah J.",
            role: "Junior Dev",
            color: "#6366f1",
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)"
        },
        {
            quote: "I stopped opening twelve tabs every time I started a new topic. Primerly just hands me the path.",
            name: "David K.",
            role: "Product Designer",
            color: "#f43f5e",
            gradient: "linear-gradient(135deg, #f43f5e, #fb7185)"
        }
    ];

    const marqueeTestimonials = [...testimonials, ...testimonials];

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
                        <a href="#reviews" className={styles.headerNavLink}>Reviews</a>
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
                        Structured learning, with your personal <span className={styles.titleAccent}>AI tutor</span>
                        {/* Stop scrolling. Start <span className={styles.titleAccent}>learning</span>, with your personal <ScrambleText text="AI tutor" className={styles.titleAccent} /> */}
                    </h1>
                </FadeIn>
                <FadeIn direction="up" delay={0.1}>
                    <p className={styles.subtitle}>
                        Type what you want to learn. Primerly turns YouTube into a structured path, an AI tutor explains anything that's fuzzy right inside the video, and you walk away with a verifiable certificate.
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
            <section id="how-it-works" className={styles.howItWorks}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>How it works</h2>
                </FadeIn>
                <div className={styles.featureStack}>
                    {[
                        {
                            icon: <SearchIcon size={28} />,
                            title: "Type what you want to learn",
                            description: "One sentence — 'data analysis', 'Rust foundations', 'Japanese N5'. Primerly pulls the right YouTube videos and orders them into a focused, end-to-end course so you stop bouncing between random tutorials.",
                            scene: "setYourGoal",
                        },
                        {
                            icon: <VideoIcon size={28} />,
                            title: "Learn with your AI tutor",
                            description: "Every video has a tutor sitting next to it. Ask anything at any timestamp and it answers in context — grounded in what was just said on screen, not a generic web search.",
                            scene: "learnWithAITutor",
                        },
                        {
                            icon: <CheckCircleIcon size={28} />,
                            title: "Prove it with quizzes",
                            description: "Each module ends with an AI-generated quiz tied to the videos you just watched. Move on only when you've actually got it — no more illusion of progress.",
                            scene: "quiz",
                        },
                        {
                            icon: <ZapIcon size={28} />,
                            title: "Earn a verifiable certificate",
                            description: "Streaks, XP, and a progress map keep you moving. Finish every topic and pass every quiz, and you walk away with a shareable Certificate of Completion anyone can verify.",
                            scene: "gamifiedMotivation",
                        },
                        {
                            icon: <MessageSquareIcon size={28} />,
                            title: "Stay accountable with community",
                            description: "Drop questions in topic channels and compare paths with people learning the same thing on YouTube. Less of the lonely tab-hopping, more of the 'we figured it out together'.",
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

            {/* 3. REVIEWS (TESTIMONIALS) SECTION */}
            <section id="reviews" className={styles.testimonialsSection}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>Loved by self-taught learners</h2>
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

            {/* 4. LEARN BETTER TOGETHER (COMMUNITY) SECTION */}
            <section id="community" className={styles.communitySection}>
                <div className={styles.communityContent}>
                    <FadeIn direction="right">
                        <h2 className={styles.communityTitle}>Learn better, together.</h2>
                        <p className={styles.communityText}>Compare paths, swap tips, and stay accountable with people learning the same things on YouTube. Topic channels, threaded replies, and reactions — without the algorithm-driven distractions.</p>
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
            <section id="topics" className={styles.topicsSection}>
                <FadeIn>
                    <h2 className={styles.sectionHeading}>If it's on YouTube, you can master it here</h2>
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

            {/* 7. CTA SECTION */}
            <section className={styles.ctaSection}>
                <FadeIn direction="up" className={styles.flexColumnCentered}>
                    <h2>Stop scrolling. Start finishing.</h2>
                    <p>Turn YouTube into a structured course you'll actually complete — free.</p>
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
                        <p>Turn YouTube into a structured learning path. Earn a real certificate.</p>
                    </div>
                    <div className={styles.footerColumn}>
                        <h4>Product</h4>
                        <div className={styles.footerLinks}>
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
        { q: "Is Primerly really free?", a: "Yes. You can build unlimited learning paths on the free plan. We may introduce premium features later." },
        { q: "Where do the videos come from?", a: "Straight from YouTube. We curate the most useful videos for what you want to learn and wrap them in a structured path with a tutor, quizzes, and a certificate — so you get the upside of free content without the rabbit hole." },
        { q: "How is the AI tutor different from ChatGPT in another tab?", a: "It's grounded in the exact video you're watching. Ask a question at any timestamp and the tutor answers using what was just said on screen, so explanations are in context instead of generic." },
        { q: "Do I get a certificate?", a: "Yes. Finish every topic and pass every module quiz, and you'll earn a Certificate of Completion with a unique verification code — shareable and verifiable by anyone via a public link." },
        { q: "How does the streak system work?", a: "You build a streak by completing at least one lesson or quiz every day. Streaks unlock badges and community flair." },
        { q: "Can I share my progress?", a: "Yes. Share streaks, XP, and certificates directly to social media or with a public verification link." },
        { q: "What topics can I learn?", a: "Anything with good YouTube coverage — from 'quantum physics' to 'cake baking'. If creators teach it on YouTube, Primerly can structure it for you." },
        { q: "How do I join a community?", a: "When you start a course, you're invited to the matching topic channel — that's where you compare paths and ask questions when the tutor isn't enough." },
        { q: "How do quizzes work?", a: "Each module ships with an AI-generated quiz tied to the videos you just watched. Passing earns XP, fuels your streak, and counts toward your certificate." },
        { q: "Can I sign in with Google, GitHub, or Apple?", a: "Yes. One-click social sign-in is supported for Google, GitHub, and Apple — no password required." },
        { q: "Is there a mobile app?", a: "Primerly is fully responsive and works great on any device. A native app is coming soon." }
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


