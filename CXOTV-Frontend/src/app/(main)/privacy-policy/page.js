export const revalidate = 86400; // — ISR

import Head from "next/head";

const PrivacyPolicy = () => {
  const lastUpdated = "29 Nov 2025";

  return (
    <div className="flex flex-col w-full font-normal font-fira text-[#666666] text-[16px]">
      <Head>
        <title>Privacy Policy - Techplus Media</title>
        <meta
          name="description"
          content="Privacy Policy for Techplus Media Pte Ltd (TMPL) covering CXO TV, itVARnews and other Techplus properties."
        />
      </Head>

      {/* Hero Section */}
      <div
        className="flex items-center justify-center my-10"
        style={{
          backgroundImage: "url(/assets/page2logo.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "80px",
        }}
      >
        <p className="lg:text-[68px] text-[20px] text-white font-fira capitalize">
          Privacy Policy
        </p>
      </div>

      <div className="flex flex-col py-6 mx-auto w-[95%] gap-5">
        <p className="font-noto font-bold text-black">Privacy Policy for Techplus Media Pte Ltd (TMPL)</p>
        <p className="text-sm text-[#888]">Last Updated: <span className="font-noto font-bold">{lastUpdated}</span></p>

        <p>
          <strong>Covers:</strong> CXOTV, itVARnews, Health Technologies, BFSI &amp; Fintech,
          Education Technology, CXOVerse, LeadXchange.ai, and all affiliated digital
          properties operated by Techplus Media Pte Ltd (TMPL) and Techplus Media Pvt. Ltd.
        </p>

        <p>
          Techplus Media Pte Ltd (“TMPL”, “we”, “our”, or “us”) is committed to safeguarding your privacy and handling your personal
          data with transparency and accountability. This Privacy Policy explains how we collect, use, store, disclose, and protect
          personal information across all our digital platforms, editorial properties, events, marketing activities, and associated services.
        </p>

        <p>
          TMPL complies with applicable global data protection laws including:
        </p>
        <ul className="list-disc pl-6">
          <li>EU GDPR</li>
          <li>UK Data Protection Act</li>
          <li>Singapore PDPA</li>
          <li>India’s Digital Personal Data Protection Act (DPDPA 2023)</li>
          <li>Australia Privacy Act 1988</li>
          <li>Applicable U.S. state privacy laws (e.g., CCPA/CPRA)</li>
        </ul>

        <p>By accessing our platforms or submitting personal information, you acknowledge and agree to the terms of this Privacy Policy.</p>

        <h3 className="font-noto font-bold mt-4">1. Scope of This Policy</h3>
        <p>
          This policy applies to all individuals interacting with TMPL’s digital and physical properties, including:
        </p>
        <ul className="list-disc pl-6">
          <li>Websites under the Techplus Media network</li>
          <li>Newsletters and editorial content</li>
          <li>Virtual and physical events</li>
          <li>Registration forms, surveys, and subscription portals</li>
          <li>Lead generation programs</li>
          <li>Media distribution, syndication, and partner-driven content</li>
          <li>CXO interviews, webinars, and editorial programs</li>
        </ul>
        <p>
          TMPL acts as a data controller for personal data processed under applicable laws in Australia, Singapore, India, the EU/UK, and the United States.
        </p>

        <h3 className="font-noto font-bold mt-4">2. Data We Collect</h3>
        <p>
          We collect only the data necessary for our editorial, business, and operational purposes, in alignment with principles of data minimization.
        </p>

        <h4 className="font-noto font-bold mt-2">a) Basic Professional Identifiers</h4>
        <ul className="list-disc pl-6">
          <li>Name</li>
          <li>Job title</li>
          <li>Company name</li>
          <li>Business email address</li>
          <li>Business phone number</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">b) Demographic &amp; Firmographic Data</h4>
        <ul className="list-disc pl-6">
          <li>Industry</li>
          <li>Company size</li>
          <li>Job role / seniority</li>
          <li>Country / region</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">c) Engagement &amp; Behavioral Data</h4>
        <p>Collected through our websites and newsletters:</p>
        <ul className="list-disc pl-6">
          <li>Page views, session duration, content interaction</li>
          <li>Event attendance history</li>
          <li>Download and resource access history</li>
          <li>Newsletter open / click rates</li>
          <li>Social and referral traffic patterns</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">d) Device &amp; Technical Information</h4>
        <ul className="list-disc pl-6">
          <li>IP address</li>
          <li>Browser type</li>
          <li>Device type</li>
          <li>Operating system</li>
          <li>Cookie identifiers</li>
          <li>Log files</li>
          <li>Location data (approximate, not GPS)</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">e) Marketing and Communication Preferences</h4>
        <ul className="list-disc pl-6">
          <li>Newsletter opt-ins</li>
          <li>Event communication preferences</li>
          <li>Subscription categories</li>
        </ul>

        <p>We do not collect sensitive personal data unless strictly required and explicitly consented.</p>

        <h3 className="font-noto font-bold mt-4">3. How We Collect Data</h3>
        <p>We collect personal data through the following methods:</p>

        <h4 className="font-noto font-bold mt-2">a) Direct Collection</h4>
        <ul className="list-disc pl-6">
          <li>Form submissions</li>
          <li>Contact forms</li>
          <li>Newsletter sign-ups</li>
          <li>Event and webinar registrations</li>
          <li>CXO interview participation</li>
          <li>Surveys and feedback forms</li>
          <li>Media interactions and editorial contributions</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">b) Automatic Collection</h4>
        <p>Through cookies and tracking technologies:</p>
        <ul className="list-disc pl-6">
          <li>Google Analytics</li>
          <li>Marketing pixels</li>
          <li>Lead-tracking tools such as LinkedIn Insight Tag</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">c) Third-Party Sources</h4>
        <ul className="list-disc pl-6">
          <li>Verified B2B data providers</li>
          <li>Event partners</li>
          <li>Sponsors (only where consent has been given)</li>
          <li>Publicly available professional data (e.g., LinkedIn, corporate websites)</li>
        </ul>

        <h3 className="font-noto font-bold mt-4">4. How We Use Your Data</h3>
        <p>We use your personal data to:</p>

        <h4 className="font-noto font-bold mt-2">a) Deliver and Improve Our Services</h4>
        <ul className="list-disc pl-6">
          <li>Provide access to news, videos, interviews, reports</li>
          <li>Personalize your content experience</li>
          <li>Recommend relevant articles or videos</li>
          <li>Enhance platform performance and content quality</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">b) Communication &amp; Marketing</h4>
        <p>With your consent where required:</p>
        <ul className="list-disc pl-6">
          <li>Send newsletters and editorial updates</li>
          <li>Notify you about events, webinars, and new features</li>
          <li>Share industry insights, reports, and relevant professional resources</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">c) Event Management</h4>
        <ul className="list-disc pl-6">
          <li>Register attendees</li>
          <li>Communicate session details</li>
          <li>Issue confirmations and reminders</li>
          <li>Deliver certificates, summaries, or recordings</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">d) Sponsorship-Related Communication</h4>
        <p>Only with explicit opt-in consent, we may share your data with:</p>
        <ul className="list-disc pl-6">
          <li>Event sponsors</li>
          <li>Partner organizations</li>
          <li>Technology solution providers</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">e) Legal and Compliance Purposes</h4>
        <ul className="list-disc pl-6">
          <li>Fraud prevention</li>
          <li>Regulatory compliance</li>
          <li>Contractual obligations</li>
          <li>Security monitoring</li>
        </ul>

        <p className="font-noto font-bold">TMPL does not sell personal data.</p>

        <h3 className="font-noto font-bold mt-4">5. Legal Basis for Processing</h3>
        <p>Depending on your region, we rely on:</p>
        <ul className="list-disc pl-6">
          <li>Consent – for email marketing, newsletters, cookies, event sponsor sharing</li>
          <li>Contractual necessity – to deliver services you signed up for</li>
          <li>Legitimate interests – analytics, improving editorial content, protecting platform integrity</li>
          <li>Legal obligations – compliance, audits, law enforcement requests</li>
        </ul>

        <h3 className="font-noto font-bold mt-4">6. International Data Transfers</h3>
        <p>
          Your data may be stored or processed in Singapore, India, the United States, or other jurisdictions.
          TMPL ensures appropriate safeguards such as:
        </p>
        <ul className="list-disc pl-6">
          <li>Standard Contractual Clauses (SCCs)</li>
          <li>Contractual Data Processing Agreements</li>
          <li>Regional equivalents under PDPA and DPDPA</li>
          <li>Vendor privacy and security compliance checks</li>
        </ul>

        <h3 className="font-noto font-bold mt-4">7. Data Sharing</h3>
        <p>We may share data only under controlled conditions with:</p>

        <h4 className="font-noto font-bold mt-2">a) TMPL Group Companies</h4>
        <p>To streamline operations across all media properties.</p>

        <h4 className="font-noto font-bold mt-2">b) Event &amp; Content Sponsors</h4>
        <p>Only when the user has opted-in to receive communication.</p>

        <h4 className="font-noto font-bold mt-2">c) Service Providers</h4>
        <p>Under binding agreements:</p>
        <ul className="list-disc pl-6">
          <li>Cloud hosting</li>
          <li>Analytics / email automation</li>
          <li>CRM and marketing technologies</li>
          <li>Video platforms</li>
        </ul>

        <h4 className="font-noto font-bold mt-2">d) Legal Authorities</h4>
        <p>Where required to comply with law or enforce rights.</p>

        <h3 className="font-noto font-bold mt-4">8. Data Retention</h3>
        <p>
          We retain personal data only as long as reasonably necessary for:
        </p>
        <ul className="list-disc pl-6">
          <li>The purposes outlined in this policy</li>
          <li>Compliance with legal obligations</li>
          <li>Operational needs</li>
          <li>Resolving disputes or defending claims</li>
        </ul>
        <p>Retention periods vary based on regional regulations.</p>

        <h3 className="font-noto font-bold mt-4">9. Your Rights by Region</h3>
        <p>EU/UK (GDPR)</p>
        <ul className="list-disc pl-6">
          <li>Access</li>
          <li>Rectification</li>
          <li>Erasure</li>
          <li>Restriction</li>
          <li>Objection</li>
          <li>Data portability</li>
        </ul>

        <p>Australia</p>
        <ul className="list-disc pl-6">
          <li>Access</li>
          <li>Correction</li>
          <li>Privacy complaints</li>
        </ul>

        <p>Singapore (PDPA)</p>
        <ul className="list-disc pl-6">
          <li>Access</li>
          <li>Correction</li>
          <li>Withdrawal of consent</li>
        </ul>

        <p>India (DPDPA 2023)</p>
        <ul className="list-disc pl-6">
          <li>Correction</li>
          <li>Erasure</li>
          <li>Grievance redressal</li>
          <li>Data portability</li>
        </ul>

        <p>United States (CCPA/CPRA)</p>
        <ul className="list-disc pl-6">
          <li>Access</li>
          <li>Delete</li>
          <li>Opt-out of sale/sharing</li>
          <li>Non-discrimination</li>
        </ul>

        <p>
          To exercise any rights, email: <a href="mailto:privacy@techplusmedia.com" className="text-[#1a73e8]">privacy@techplusmedia.com</a>
        </p>

        <h3 className="font-noto font-bold mt-4">10. Cookies &amp; Tracking Technologies</h3>
        <p>
          TMPL uses cookies and similar technologies for:
        </p>
        <ul className="list-disc pl-6">
          <li>Analytics</li>
          <li>Content personalization</li>
          <li>Advertising measurement</li>
          <li>Audience segmentation</li>
          <li>Security and fraud detection</li>
        </ul>
        <p>Users may manage preferences through browser controls. A standalone Cookie Policy can also be generated if needed.</p>

        <h3 className="font-noto font-bold mt-4">11. Editorial Integrity &amp; Transparency</h3>
        <p>(Added for Google News compliance)</p>
        <ul className="list-disc pl-6">
          <li>TMPL maintains strict editorial independence.</li>
          <li>Sponsored content is clearly labeled as “Partner Content”.</li>
          <li>Advertisers cannot influence editorial news reporting.</li>
          <li>AI tools may assist drafting but all content is reviewed by human editors.</li>
          <li>Corrections and updates follow our Corrections Policy.</li>
          <li>Journalistic accuracy and transparency are core to our operations.</li>
        </ul>

        <h3 className="font-noto font-bold mt-4">12. Minors</h3>
        <p>
          Our content and services are not directed at individuals under 13. We do not knowingly collect data from children.
        </p>

        <h3 className="font-noto font-bold mt-4">13. Updates to This Policy</h3>
        <p>
          We may update this Privacy Policy to reflect changes in legal requirements or operational practices. Material updates will be notified via website banners or email communications.
        </p>

        <h3 className="font-noto font-bold mt-4">14. Contact Us</h3>
        <p>
          For questions, rights requests, or concerns: <a href="mailto:privacy@techplusmedia.com" className="text-[#1a73e8]">privacy@techplusmedia.com</a>
        </p>

        <p className="mt-2">
          <span className="font-noto font-bold">Techplus Media Pte Ltd</span><br />
          <span className="font-noto font-bold">Techplus Media Pvt. Ltd.</span>
        </p>

        <h4 className="font-noto font-bold mt-4">Disposal Of Private Information</h4>
        <p>
          Whenever a visitor / user unsubscribes from our connection through email / phone / both, and informs us via any modes of communication;
          Techplus Media removes the information of the user / visitor from its contact information stored. The information is purged and no backup
          or secondary storage is kept for the removed private information of the user.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
