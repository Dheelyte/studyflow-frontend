export const metadata = {
  title: 'Terms of Service',
};

export default function TermsOfService() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>Terms of Service</h1>
      <p style={{ color: 'var(--secondary)', marginBottom: '40px' }}>Last updated: January 11, 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', lineHeight: '1.6' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>1. Agreement to Terms</h2>
          <p style={{ color: 'var(--secondary)' }}>
            By accessing or using Primerly, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you may not access or use the service.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>2. Use of Service</h2>
          <p style={{ color: 'var(--secondary)' }}>
            Primerly provides an AI-powered curriculum generation tool. You are granted a limited, non-exclusive, non-transferable license to use the service for personal, non-commercial purposes.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>3. User Accounts</h2>
          <p style={{ color: 'var(--secondary)' }}>
            To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>4. Content and Conduct</h2>
          <p style={{ color: 'var(--secondary)' }}>
            You agree not to use the service to generate or share content that is illegal, harmful, threatening, abusive, harassment, defamatory, vulgar, obscene, or otherwise objectionable.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>5. Limitation of Liability</h2>
          <p style={{ color: 'var(--secondary)' }}>
            Primerly shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>6. Contact Us</h2>
          <p style={{ color: 'var(--secondary)' }}>
            If you have any questions about these Terms, please contact us at: primerly.app@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
