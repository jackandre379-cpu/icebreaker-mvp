'use client';

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", fontFamily: "Inter, Arial, sans-serif", lineHeight: "1.6" }}>
      <h1 style={{ color: "#065f46" }}>Privacy Policy</h1>
      <p><strong>Effective Date:</strong> [September 10, 2025]</p>
      <p>
        Aldingo (“we,” “our,” or “us”) values your privacy. This Privacy Policy explains how we
        collect, use, and protect your information when you use the Aldingo mobile application
        (the “App”). By using our App, you agree to the terms outlined below.
      </p>

      <h2 style={{ color: "#065f46" }}>1. Information We Collect</h2>
      <ul>
        <li><strong>Profile Information:</strong> Display name, optional profile photo, bio, and social links you choose to provide.</li>
        <li><strong>Location Data:</strong> Used only when you check in to a venue. Location data expires automatically after approximately 60 minutes.</li>
        <li><strong>Connections:</strong> Requests, acceptances, and mutual matches to help you manage your network.</li>
        <li><strong>Device & Usage Data:</strong> Technical details such as device type, app version, and logs to improve performance and security.</li>
      </ul>

      <h2 style={{ color: "#065f46" }}>2. How We Use Your Information</h2>
      <ul>
        <li>To enable check-ins and display nearby users.</li>
        <li>To facilitate mutual connections and message requests.</li>
        <li>To improve and secure our App.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2 style={{ color: "#065f46" }}>3. Data Sharing</h2>
      <ul>
        <li>We do <strong>not</strong> sell or rent your personal data.</li>
        <li>We may share limited data with:
          <ul>
            <li>Other users (only when you choose to share or accept a request).</li>
            <li>Service providers (e.g., Google Firebase for hosting and storage).</li>
            <li>Authorities, if required by law.</li>
          </ul>
        </li>
      </ul>

      <h2 style={{ color: "#065f46" }}>4. Data Retention</h2>
      <ul>
        <li>Check-in locations are stored temporarily and expire after ~60 minutes.</li>
        <li>Your profile and connections remain until you delete your account.</li>
        <li>When you delete your account, your profile and related data are permanently erased from our systems.</li>
      </ul>

      <h2 style={{ color: "#065f46" }}>5. Your Privacy Choices</h2>
      <ul>
        <li>You can update or delete your profile at any time.</li>
        <li>You may choose not to check in if you prefer not to share your location.</li>
        <li>
          <strong>Profile Photos:</strong>  
          If you choose to upload a profile picture, Aldingo will first ask for your permission to access your camera or photo library.  
          This permission is used <em>only</em> for selecting or capturing a profile photo and is never used for any other purpose.
        </li>
        <li>
          <strong>Account Deletion:</strong>  
          You can permanently delete your account directly in the App by scrolling to the bottom of your Profile page and selecting “Delete my account.”  
          For verification, you will be asked to type your display name before confirming.  
          Once deleted, your profile, connections, and related data are permanently removed and cannot be recovered.
        </li>
      </ul>

      <h2 style={{ color: "#065f46" }}>6. Security</h2>
      <p>
        We use encryption, secure storage, and access controls to protect your data. However, no
        system is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 style={{ color: "#065f46" }}>7. Children’s Privacy</h2>
      <p>
        The Aldingo App is not intended for individuals under the age of 18. We do not knowingly
        collect personal data from minors.
      </p>

      <h2 style={{ color: "#065f46" }}>8. International Users</h2>
      <p>
        Your data may be stored on servers located outside your country of residence. By using
        Aldingo, you consent to the transfer of your data to such locations.
      </p>

      <h2 style={{ color: "#065f46" }}>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted in the App and
        on our website with an updated effective date.
      </p>

      <h2 style={{ color: "#065f46" }}>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us:
      </p>
      <p>
        📧 Email: <a href="mailto:info@aldingo.com">info@aldingo.com</a><br />
        🌐 Website: <a href="https://aldingo.com">aldingo.com</a>
      </p>
    </main>
  );
}
