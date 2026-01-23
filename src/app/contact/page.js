export const metadata = {
  title: 'Contact Us',
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>Contact Us</h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '60px', lineHeight: '1.6' }}>
        Have questions, feedback, or just want to say hello? We'd love to hear from you.
      </p>

      <div style={{ display: 'grid', gap: '40px' }}>
        <div style={{ background: 'var(--card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px' }}>Get in Touch</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Email Support</div>
              <a href="mailto:primerly.app@gmail.com" style={{ color: 'var(--primary)', fontSize: '1.1rem', textDecoration: 'none' }}>primerly.app@gmail.com</a>
            </div>

            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Twitter / X</div>
              <a href="https://x.com/primerlyapp" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '1.1rem', textDecoration: 'none' }}>@primerlyapp</a>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--card)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--secondary)', marginBottom: '16px' }}>
            You might find your answer instantly in our FAQ section.
          </p>
          <a href="/#faq" style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', fontWeight: '600' }}>Visit FAQ</a>
        </div>
      </div>
    </div>
  );
}
