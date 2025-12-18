"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import { ZapIcon, TrophyIconSimple, CheckIcon, UsersIcon, SearchIcon, PlayIcon, StarIcon, PlusIcon, ChevronRight } from '@/components/Icons';
import IntegratedSearchBar from '@/components/IntegratedSearchBar';
import ThemeToggle from '@/components/ThemeToggle';
import FadeIn from '@/components/FadeIn';
import GenerationOverlay from '@/components/GenerationOverlay';

export default function LandingPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [genParams, setGenParams] = useState(null);
  const router = useRouter();

  const handleSearch = (params) => {
    setGenParams(params);
    setIsGenerating(true);
  };

  const onGenerationComplete = () => {
    if (!genParams) return;
     const query = {
        topic: genParams.topic,
        experience: genParams.experience,
        duration: genParams.duration
    };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/playlist/1?${queryString}`);
  };

  const topics = ['Next.js 14', 'Python for AI', 'UI/UX Principles', 'Rust Foundations', 'Cybersecurity', 'Digital Marketing', 'Piano Basics', 'Calculus I', 'Three.js', 'System Design', 'Japanese N5', 'Guitar Solos', 'Docker Mastery', 'Figma Secrets', 'Blockchain Dev'];
  const marqueeTopics = [...topics, ...topics];
  const marqueeTopicsReverse = [...topics.reverse(), ...topics];

  return (
    <div className={styles.container}>
      {isGenerating && genParams && (
        <GenerationOverlay 
            topic={genParams.topic} 
            experience={genParams.experience} 
            onComplete={onGenerationComplete} 
        />
      )}

      <header className={styles.header}>
         <div className={styles.headerBrand}>
            <ZapIcon size={24} fill="var(--primary)" /> StudyFlow
         </div>
         <div className={styles.headerActions}>
             <ThemeToggle />
             <Link href="/login" style={{color:'var(--foreground)', fontWeight:'600', textDecoration:'none'}}>Log In</Link>
             <Link href="/signup" className={styles.ctaSmall}>Sign Up</Link>
         </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className={styles.hero}>
        <FadeIn direction="up">
            <h1 className={styles.title}>Master any topic in minutes, not months.</h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.1}>
            <p className={styles.subtitle}>
                The AI-powered curriculum designer that adapts to your pace. Turn any goal into a personalized audio-visual playlist instanly.
            </p>
        </FadeIn>
        
        <FadeIn direction="up" delay={0.2} style={{width:'100%', maxWidth:'900px', marginTop:'32px'}}>
            <IntegratedSearchBar onSearch={handleSearch} />
        </FadeIn>

        <FadeIn direction="up" delay={0.3} className={styles.heroFooter}>
        </FadeIn>

        <FadeIn direction="up" delay={0.4} style={{marginTop: '48px', width: '100%', display: 'flex', justifyContent: 'center'}}>
             <div style={{
                 borderRadius: '16px', 
                 overflow: 'hidden', 
                 boxShadow: '0 20px 50px -10px rgba(0,0,0,0.3)', 
                 border: '1px solid var(--border)',
                 maxWidth: '1000px',
                 width: '100%'
             }}>
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    style={{width: '100%', display: 'block'}}
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
                  <p className={styles.featureText}>Type any skill or topic, from &quot;React Hooks&quot; to &quot;Astrophysics&quot;.</p>
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

      {/* 3. WHY STUDYFLOW (STACKED CARDS) SECTION */}
      <section className={styles.stackedSection}>
        <FadeIn>
             <h2 className={styles.sectionHeading} style={{textAlign:'center'}}>Why StudyFlow?</h2>
        </FadeIn>
        <div className={styles.stackedContainer}>
             {/* Card 1 */}
             <div className={styles.stackedCard} style={{top: '120px', zIndex:1, background: 'var(--card)'}}>
                  <div className={styles.stackedCardContent}>
                      <div className={styles.stackedCardInfo}>
                          <h3 style={{fontSize:'2rem', marginBottom:'16px'}}>AI-Curated Paths</h3>
                          <p style={{fontSize:'1.1rem', color:'var(--secondary)', lineHeight:'1.6'}}>
                              We don&apos;t just serve you random videos. Our Gemini-powered engine analyzes thousands of resources to create a cohesive, step-by-step curriculum tailored to your experience level and time constraints.
                          </p>
                      </div>
                      <div className={styles.stackedCardVisual} style={{background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'white'}}>
                          <ZapIcon size={60} />
                      </div>
                  </div>
             </div>
             {/* Card 2 */}
             <div className={styles.stackedCard} style={{top: '150px', zIndex:2, background: 'var(--card)'}}>
                  <div className={styles.stackedCardContent}>
                      <div className={styles.stackedCardInfo}>
                          <h3 style={{fontSize:'2rem', marginBottom:'16px'}}>Gamified Motivation</h3>
                          <p style={{fontSize:'1.1rem', color:'var(--secondary)', lineHeight:'1.6'}}>
                               Stay consistent with streaks, XP, and daily goals. We turn learning into a game you actually want to play. Compete with friends or beat your own best.
                          </p>
                      </div>
                      <div className={styles.stackedCardVisual} style={{background:'linear-gradient(135deg, #eab308, #f59e0b)', color:'white'}}>
                          <TrophyIconSimple size={60} />
                      </div>
                  </div>
             </div>
             {/* Card 3 */}
             <div className={styles.stackedCard} style={{top: '180px', zIndex:3, background: 'var(--card)'}}>
                  <div className={styles.stackedCardContent}>
                      <div className={styles.stackedCardInfo}>
                          <h3 style={{fontSize:'2rem', marginBottom:'16px'}}>Community Powered</h3>
                          <p style={{fontSize:'1.1rem', color:'var(--secondary)', lineHeight:'1.6'}}>
                               Never learn alone. Join niche communities for every topic. Share your notes, ask questions, and get feedback from learners who are on the same path.
                          </p>
                      </div>
                      <div className={styles.stackedCardVisual} style={{background:'linear-gradient(135deg, #ec4899, #f43f5e)', color:'white'}}>
                          <UsersIcon size={60} />
                      </div>
                  </div>
             </div>
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
                <Link href="/community" className={styles.ctaButtonOutline}>Explore Communities</Link>
            </FadeIn>
        </div>
        <div className={styles.communityVisual}>
            <FadeIn direction="left" delay={0.2} className={`${styles.mockPostCard} ${styles.mockPostCard1}`}>
                 <div style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
                     <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg, #6366f1, #a855f7)'}}></div>
                     <div>
                         <div style={{fontWeight:'700', fontSize:'0.9rem'}}>Sarah J.</div>
                         <div style={{fontSize:'0.75rem', color:'var(--secondary)'}}>Just now • #ReactMastery</div>
                     </div>
                 </div>
                 <div style={{fontSize:'0.9rem', lineHeight:'1.5', marginBottom:'12px'}}>
                     Finally understood <strong>useEffect</strong> thanks to the module 3 visualizer! 🚀
                 </div>
                 <div style={{display:'flex', gap:'16px', color:'var(--secondary)', fontSize:'0.85rem'}}>
                      <span>❤️ 24</span>
                      <span>💬 5</span>
                 </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.4} className={`${styles.mockPostCard} ${styles.mockPostCard2}`}>
                 <div style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
                     <div style={{width:'32px', height:'32px', borderRadius:'50%', background:'linear-gradient(135deg, #f59e0b, #ef4444)'}}></div>
                     <div>
                         <div style={{fontWeight:'700', fontSize:'0.9rem'}}>David C.</div>
                         <div style={{fontSize:'0.75rem', color:'var(--secondary)'}}>2h ago • #Python</div>
                     </div>
                 </div>
                 <div style={{fontSize:'0.9rem', lineHeight:'1.5', marginBottom:'12px'}}>
                     Anyone want to pair program on the Data Science capstone? 🐍
                 </div>
            </FadeIn>
        </div>
      </section>

      {/* 5. POPULAR TOPICS SECTION */}
       <section className={styles.topicsSection}>
           <FadeIn>
                <h2 className={styles.sectionHeading}>Endless Learning Possibilities</h2>
           </FadeIn>
           <div className={styles.marqueeContainer} style={{marginBottom:'24px'}}>
               <div className={styles.marqueeTrack}>
                   {marqueeTopics.map((topic, i) => (
                       <Link href="/dashboard" key={`${topic}-${i}-1`} className={styles.topicCard} style={{minWidth: '220px'}}>
                           <div className={styles.topicTitle}>{topic}</div>
                           <div className={styles.topicMeta}>
                               <span>{40 + i} Resources</span>
                               <span>{1200 + (i * 123)} Learners</span>
                           </div>
                       </Link>
                   ))}
               </div>
           </div>
           <div className={styles.marqueeContainer}>
               <div className={styles.marqueeTrackReverse}>
                   {marqueeTopicsReverse.map((topic, i) => (
                       <Link href="/dashboard" key={`${topic}-${i}-2`} className={styles.topicCard} style={{minWidth: '220px'}}>
                           <div className={styles.topicTitle}>{topic}</div>
                           <div className={styles.topicMeta}>
                               <span>{30 + i} Resources</span>
                               <span>{800 + (i * 45)} Learners</span>
                           </div>
                       </Link>
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
                    <div style={{marginBottom:'24px', display:'flex', gap:'4px', color:'#eab308'}}>
                        {[1,2,3,4,5].map(i => <StarIcon key={i} size={16} fill="currentColor" stroke="none" />)}
                    </div>
                    <p className={styles.quote}>&quot;I was overwhelmed by the amount of React tutorials online. StudyFlow curated exactly what I needed.&quot;</p>
                    <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                        <div className={styles.avatarRing}><div style={{width:'100%', height:'100%', borderRadius:'50%', background:'var(--card)'}}></div></div>
                        <div>
                            <div style={{fontWeight:'700'}}>Marcus L.</div>
                            <div style={{fontSize:'0.8rem', color:'var(--secondary)'}}>Frontend Dev</div>
                        </div>
                    </div>
               </FadeIn>
               <FadeIn delay={0.2} direction="up" className={styles.testimonialCard}>
                    <div style={{marginBottom:'24px', display:'flex', gap:'4px', color:'#eab308'}}>
                        {[1,2,3,4,5].map(i => <StarIcon key={i} size={16} fill="currentColor" stroke="none" />)}
                    </div>
                    <p className={styles.quote}>&quot;The gamification keeps me coming back. I finally finished a course without dropping out halfway!&quot;</p>
                    <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                        <div className={styles.avatarRing} style={{background:'linear-gradient(135deg, #10b981, #3b82f6)'}}><div style={{width:'100%', height:'100%', borderRadius:'50%', background:'var(--card)'}}></div></div>
                        <div>
                            <div style={{fontWeight:'700'}}>Elena R.</div>
                            <div style={{fontSize:'0.8rem', color:'var(--secondary)'}}>Student</div>
                        </div>
                    </div>
               </FadeIn>
               <FadeIn delay={0.3} direction="up" className={styles.testimonialCard}>
                    <div style={{marginBottom:'24px', display:'flex', gap:'4px', color:'#eab308'}}>
                        {[1,2,3,4,5].map(i => <StarIcon key={i} size={16} fill="currentColor" stroke="none" />)}
                    </div>
                    <p className={styles.quote}>&quot;Community support is unmatched. I got help with my Python bug in minutes.&quot;</p>
                    <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                         <div className={styles.avatarRing} style={{background:'linear-gradient(135deg, #f59e0b, #ec4899)'}}><div style={{width:'100%', height:'100%', borderRadius:'50%', background:'var(--card)'}}></div></div>
                        <div>
                            <div style={{fontWeight:'700'}}>James K.</div>
                            <div style={{fontSize:'0.8rem', color:'var(--secondary)'}}>Data Analyst</div>
                        </div>
                    </div>
               </FadeIn>
           </div>
       </section>

      {/* 7. CTA SECTION */}
      <section className={styles.ctaSection}>
          <FadeIn direction="up" className={styles.flexColumnCentered}>
            <h2>Ready to start your flow?</h2>
            <p>Join 10,000+ learners mastering new skills every day.</p>
            <Link href="/signup" className={styles.ctaButtonLarge}>Get Started for Free</Link>
          </FadeIn>
      </section>

      {/* 8. FAQ SECTION */}
      <FAQSection />

      {/* 9. FOOTER */}
      <footer className={styles.mainFooter}>
          <div className={styles.footerGrid}>
              <div className={styles.footerBrand}>
                  <div style={{display:'flex', gap:'8px', fontWeight:'800', fontSize:'1.2rem', alignItems:'center'}}>
                     <ZapIcon size={24} fill="var(--primary)" /> StudyFlow
                  </div>
                  <p>The AI-powered curriculum designer that helps you master any topic. Flow state on demand.</p>
              </div>
              <div className={styles.footerColumn}>
                  <h4>Product</h4>
                  <div className={styles.footerLinks}>
                      <Link href="/dashboard">Curriculum</Link>
                      <Link href="/community">Community</Link>
                      <Link href="#">Gamification</Link>
                      <Link href="#">Pricing</Link>
                  </div>
              </div>
              <div className={styles.footerColumn}>
                  <h4>Company</h4>
                  <div className={styles.footerLinks}>
                      <Link href="#">About Us</Link>
                      <Link href="#">Careers</Link>
                      <Link href="#">Blog</Link>
                      <Link href="#">Contact</Link>
                  </div>
              </div>
              <div className={styles.footerColumn}>
                  <h4>Legal</h4>
                  <div className={styles.footerLinks}>
                      <Link href="#">Privacy Policy</Link>
                      <Link href="#">Terms of Service</Link>
                      <Link href="#">Cookie Policy</Link>
                  </div>
              </div>
          </div>
          <div className={styles.footerBottom}>
              <div>&copy; 2024 StudyFlow Inc.</div>
              <div style={{display:'flex', gap:'16px'}}>
                  <a href="#" aria-label="Twitter">Twitter</a>
                  <a href="#" aria-label="GitHub">GitHub</a>
                  <a href="#" aria-label="LinkedIn">LinkedIn</a>
              </div>
          </div>
      </footer>
    </div>
  );
}

function FAQSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const questions = [
        { q: "Is StudyFlow really free?", a: "Yes! You can generate unlimited curriculums on the free plan. We may introduce premium features later." },
        { q: "How accurate is the AI?", a: "We use Gemini Ultra 1.5 to curate high-quality resources. The content is constantly vetted by our algorithm." },
        { q: "Can I customize the curriculum?", a: "Absolutely. You can edit, remove, or reorder modules as you see fit." },
        { q: "Is there a mobile app?", a: "StudyFlow is fully responsive and works great on any device. A native app is coming soon!" }
    ];

    return (
        <section className={styles.faqSection}>
            <div className={styles.faqContainer}>
                <FadeIn>
                    <h2 className={styles.sectionHeading} style={{marginBottom:'40px', textAlign:'center'}}>Frequently Asked Questions</h2>
                </FadeIn>
                <div style={{width:'100%'}}>
                    {questions.map((item, i) => (
                        <FadeIn key={i} delay={0.1 * i} direction="up" className={styles.faqItem} style={{width:'100%'}}>
                            <button className={styles.faqQuestion} onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                                {item.q}
                                <div style={{transform: openIndex === i ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>
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
