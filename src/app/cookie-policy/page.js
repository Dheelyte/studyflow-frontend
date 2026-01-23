export const metadata = {
  title: 'Cookie Policy',
};

export default function CookiePolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px 80px' }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px' }}>Cookie Policy</h1>
      <p style={{ color: 'var(--secondary)', marginBottom: '40px' }}>Last updated: January 11, 2026</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', lineHeight: '1.6' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>1. What Are Cookies</h2>
          <p style={{ color: 'var(--secondary)' }}>
            Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>2. How We Use Cookies</h2>
          <p style={{ color: 'var(--secondary)' }}>
            When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, to enable advertisements delivery, including behavioral advertising.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>3. Types of Cookies</h2>
          <p style={{ color: 'var(--secondary)' }}>
            We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
          </p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '24px', color: 'var(--secondary)', marginTop: '12px' }}>
            <li>Essential cookies: We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
            <li>Analytics cookies: We use these cookies to track information how the Service is used so that we can make improvements.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>4. Your Choices</h2>
          <p style={{ color: 'var(--secondary)' }}>
            If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>5. Contact Us</h2>
          <p style={{ color: 'var(--secondary)' }}>
            If you have any questions about this Cookie Policy, please contact us at: primerly.app@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
