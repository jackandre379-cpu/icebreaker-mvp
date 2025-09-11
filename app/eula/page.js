'use client';

export default function EulaPage() {
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
      <h1 style={{ color: "#065f46" }}>End User License Agreement (EULA)</h1>
      <p>
        <strong>Effective Date:</strong> September 10, 2025
      </p>

      <p>
        This End User License Agreement (“Agreement”) is a legal contract between you
        (“User”) and <strong>Inven LLC</strong> (“Company,” “we,” or “us”), the owner of
        the Aldingo mobile application (“App”). By downloading, installing, or using
        Aldingo, you agree to be bound by this Agreement.
      </p>

      <h2 style={{ color: "#065f46" }}>1. License Grant</h2>
      <p>
        Inven LLC grants you a limited, non-exclusive, non-transferable, revocable
        license to use Aldingo solely for personal, non-commercial purposes, in
        accordance with this Agreement.
      </p>

      <h2 style={{ color: "#065f46" }}>2. Ownership</h2>
      <p>
        The Aldingo App, including its software, code, design, trademarks, and content,
        is the property of Inven LLC. This Agreement does not transfer any ownership
        rights to you.
      </p>

      <h2 style={{ color: "#065f46" }}>3. Restrictions</h2>
      <ul>
        <li>You may not copy, modify, distribute, or sell any part of Aldingo.</li>
        <li>You may not reverse-engineer, decompile, or attempt to extract the source code.</li>
        <li>You may not use Aldingo for illegal purposes, harassment, spam, or harmful activities.</li>
      </ul>

      <h2 style={{ color: "#065f46" }}>4. User Content & Conduct</h2>
      <p>
        You are responsible for the content you share and the way you interact with
        others through Aldingo. Inven LLC reserves the right to suspend or terminate
        accounts that violate this Agreement or our community guidelines.
      </p>

      <h2 style={{ color: "#065f46" }}>5. Location & Connectivity</h2>
      <p>
        Aldingo may use your device’s location and connectivity to display nearby
        users. You are responsible for your interactions with others. Inven LLC does
        not guarantee the safety of in-person meetings. Exercise caution and discretion.
      </p>

      <h2 style={{ color: "#065f46" }}>6. Disclaimers & Limitation of Liability</h2>
      <p>
        Aldingo is provided “as is” without warranties of any kind. To the fullest
        extent permitted by law, Inven LLC shall not be liable for damages, losses,
        or negative experiences resulting from your use of Aldingo or interactions
        with other users.
      </p>

      <h2 style={{ color: "#065f46" }}>7. Termination</h2>
      <p>
        Inven LLC may suspend or terminate your access to Aldingo at any time, with
        or without notice, if you violate this Agreement.
      </p>

      <h2 style={{ color: "#065f46" }}>8. Governing Law</h2>
      <p>
        This Agreement shall be governed by and construed in accordance with the laws
        of [Your Country/State], without regard to its conflict of law principles.
      </p>

      <h2 style={{ color: "#065f46" }}>9. Contact Us</h2>
      <p>
        If you have questions about this Agreement, please contact us:
      </p>
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
        </a>{" "}
        and{" "}
        <a href="/terms-of-service" style={{ color: "#065f46" }}>
          Terms of Service
        </a>
        .
      </p>
    </main>
  );
}
