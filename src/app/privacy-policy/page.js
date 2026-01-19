export const metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--secondary)', marginBottom: '40px' }}>Last updated: January 11, 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', lineHeight: '1.6' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>1. Introduction</h2>
          <p style={{ color: 'var(--secondary)' }}>
            Welcome to Primerly. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you as to how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>2. Data We Collect</h2>
          <p style={{ color: 'var(--secondary)' }}>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'var(--secondary)', marginTop: '12px' }}>
            <li>Identity Data includes first name, last name, username or similar identifier.</li>
            <li>Contact Data includes email address.</li>
            <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
            <li>Usage Data includes information about how you use our website and services.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>3. How We Use Your Data</h2>
          <p style={{ color: 'var(--secondary)' }}>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'var(--secondary)', marginTop: '12px' }}>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>4. Data Security</h2>
          <p style={{ color: 'var(--secondary)' }}>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>5. Contact Us</h2>
          <p style={{ color: 'var(--secondary)' }}>
            If you have any questions about this privacy policy or our privacy practices, please contact us at: primerlyapp@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
