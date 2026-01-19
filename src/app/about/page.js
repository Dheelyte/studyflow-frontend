export const metadata = {
  title: 'About Us',
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>About Primerly</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '60px', lineHeight: '1.6' }}>
        We're on a mission to make mastering any topic accessible, engaging, and efficient for everyone.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>Meet the Team</h2>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px', background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '4px solid var(--primary)' }}>
                <img src="/team/team_member_1.png" alt="Sarah J." style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Delight Olu-Olagbuji</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Software Engineer</p>
              <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginTop: '8px' }}>Passionate about technology, community-building, and AI.</p>
            </div>

            <div style={{ flex: 1, minWidth: '250px', background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '4px solid var(--primary)' }}>
                <img src="/team/team_member_2.jpeg" alt="David C." style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>Kafilat Kolapo</h3>
              <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>Product Manager</p>
              <p style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginTop: '8px' }}>Passionate about finance and community-building.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>Our Story</h2>
          <p style={{ color: 'var(--secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
            Primerly began with a simple observation: there's too much information out there. Whether you want to learn React, Astrophysics, or Gardening, the problem isn't a lack of resources—it's knowing where to start and what path to follow.
          </p>
          <p style={{ color: 'var(--secondary)', lineHeight: '1.6' }}>
            We started Primerly to bridge the gap between "I want to learn" and "I've mastered it." By leveraging advanced AI, we organize the world's knowledge into structured, interactive, and gamified curriculums.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '20px' }}>What We Believe</h2>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'grid', gap: '24px' }}>
            <li style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Learning should be active</h3>
              <p style={{ color: 'var(--secondary)' }}>Passive watching isn't enough. We build tools that make you do, quiz, and discuss.</p>
            </li>
            <li style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Community accelerates growth</h3>
              <p style={{ color: 'var(--secondary)' }}>Learning together is faster and more fun. That's why community is at our core.</p>
            </li>
            <li style={{ background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Education is a right</h3>
              <p style={{ color: 'var(--secondary)' }}>We're committed to keeping our core curriculum generation free for everyone.</p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
