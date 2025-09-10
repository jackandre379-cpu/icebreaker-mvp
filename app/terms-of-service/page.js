'use client';

export default function TermsPage() {
  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Inter, Arial, sans-serif",
        lineHeight: "1.6",
      }}
    >
      <h1 style={{ color: "#065f46" }}>Terms of Service</h1>
      <p>
        <strong>Effective Date:</strong> September 10, 2025
      </p>

      <p>
        Welcome to Aldingo (“we,” “our,” or “us”). By downloading or using the
        Aldingo mobile application (the “App”), you agree to these Terms of
        Service (“Terms”). Please read them carefully.
      </p>

      <h2 style={{ color: "#065f46" }}>1. Eligibility</h2>
      <p>
        You must be at least 18 years old to use Aldingo. By creating a profile,
        you confirm that the information you provide (name, bio, photo, social
        links) is accurate and not misleading.
      </p>

      <h2 style={{ color: "#065f46" }}>2. Accounts & Profiles</h2>
      <ul>
        <li>
          A profile is required to use check-in features (name is mandatory,
          other fields are optional).
        </li>
        <li>You are responsible for the content you post in your profile.</li>
        <li>
          You may not impersonate others, use offensive content, or violate any
          laws.
        </li>
      </ul>

      <h2 style={{ color: "#065f46" }}>3. Acceptable Use</h2>
      <p>You agree to use Aldingo in a respectful and lawful manner:</p>
      <ul>
        <li>Do not harass, abuse, or harm other users.</li>
        <li>Do not use the app for spamming or unwanted solicitation.</li>
        <li>
          Do not attempt to disrupt or misuse the app’s check-in or location
          features.
        </li>
      </ul>
      <p>We may suspend or delete accounts that violate these rules.</p>

      <h2 style={{ color: "#065f46" }}>4. Privacy & Data</h2>
      <p>
        Your use of the App is also governed by our{" "}
        <a href="/privacy-policy" style={{ color: "#065f46" }}>
          Privacy Policy
        </a>
        . Profile information and check-in data you choose to share may be
        visible to other users. Location data is temporary and expires
        automatically.
      </p>

      <h2 style={{ color: "#065f46" }}>5. Safety Disclaimer</h2>
      <p>
        Aldingo provides a platform to connect people but does not verify user
        identities. We are not responsible for interactions between users
        outside the app. Use caution and judgment when meeting new people.
      </p>

      <h2 style={{ color: "#065f46" }}>6. Account Deletion</h2>
      <p>
        You may delete your account at any time in the App by selecting “Delete
        my account” in your Profile. Once deleted, your profile, connections,
        and related data are permanently erased and cannot be recovered.
      </p>

      <h2 style={{ color: "#065f46" }}>7. Service Availability</h2>
      <p>
        We may update, limit, suspend, or discontinue the App at any time. We
        make no guarantees that the App will always be available or free from
        errors.
      </p>

      <h2 style={{ color: "#065f46" }}>8. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Aldingo is provided “as is”
        without warranties. We are not liable for damages arising from use of
        the App, including lost connections, misuse by others, or service
        interruptions.
      </p>

      <h2 style={{ color: "#065f46" }}>9. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Updates will be posted in
        the App and on our website with a new effective date. Continued use of
        the App means you accept the new Terms.
      </p>

      <h2 style={{ color: "#065f46" }}>10. Contact Us</h2>
      <p>If you have questions about these Terms, please contact us:</p>
      <p>
        📧 Email:{" "}
        <a href="mailto:info@aldingo.com" style={{ color: "#065f46" }}>
          info@aldingo.com
        </a>
        <br />
        🌐 Website:{" "}
        <a href="https://aldingo.com" style={{ color: "#065f46" }}>
          aldingo.com
        </a>
      </p>
       <p style={{ marginTop: "30px" }}>
  You can also view our{" "}
  <a href="/privacy-policy" style={{ color: "#065f46" }}>
    Privacy Policy
  </a>
  .
</p>

    </main>
  );
}
