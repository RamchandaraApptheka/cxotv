export const revalidate = 86400; // — ISR

import Head from "next/head";

const TermsOfService = () => {
    const lastUpdated = "29 Nov 2025";

    return (
        <div className="flex flex-col w-full font-normal font-fira text-[#666666] text-[16px]">
            <Head>
                <title>Terms of Service - Techplus Media</title>
                <meta
                    name="description"
                    content="Terms of Service for Techplus Media Pte Ltd (TMPL) covering CXO TV, itVARnews and other Techplus properties."
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
                    Terms of Service
                </p>
            </div>

            <div className="flex flex-col py-6 mx-auto w-[95%] gap-5">
                <p className="font-noto font-bold text-black">Terms of Service</p>
                <p className="text-sm text-[#888]">Last Updated: <span className="font-noto font-bold">{lastUpdated}</span></p>

                <p>
                    <strong>Techplus Media Pte Ltd (TMPL)</strong><br />
                    These Terms of Service (“Terms”) govern your access to and use of all digital properties, media platforms, products, and services
                    operated by Techplus Media Pte Ltd and Techplus Media Pvt. Ltd. (collectively referred to as “TMPL”, “we”, “our” or “us”).
                </p>

                <p>
                    This includes, but is not limited to:
                </p>
                <ul className="list-disc pl-6">
                    <li>CXO TV</li>
                    <li>itVARnews</li>
                    <li>Health Technologies</li>
                    <li>BFSI &amp; Fintech</li>
                    <li>Education Technology</li>
                    <li>CXOVerse</li>
                    <li>LeadXchange.ai</li>
                    <li>All microsites, event portals, newsletters, and subdomains under Techplus Media</li>
                </ul>

                <p>
                    By accessing or using our websites, mobile platforms, content, or services, you agree to be bound by these Terms. If you do not agree
                    with these Terms, do not use our platforms.
                </p>

                <h3 className="font-noto font-bold mt-4">1. Acceptance of Terms</h3>
                <p>
                    By browsing, accessing, or using any TMPL property, you acknowledge that you have read, understood, and accepted these Terms,
                    including our Privacy Policy, Cookie Policy, and editorial guidelines.
                </p>

                <h3 className="font-noto font-bold mt-4">2. About TMPL</h3>
                <p>
                    TMPL is a global multi-platform media organization publishing news, interviews, editorial content, and digital experiences
                    covering enterprise technology, cloud, cybersecurity, digital transformation, business leadership, and industry insights.
                </p>
                <p>We operate registered businesses in:</p>
                <ul className="list-disc pl-6">
                    <li>Singapore (Techplus Media Pte Ltd)</li>
                    <li>India (Techplus Media Pvt. Ltd.)</li>
                </ul>

                <h3 className="font-noto font-bold mt-4">3. Use of Our Content</h3>
                <p>
                    All content published across TMPL platforms—including videos, interviews, articles, reports, presentations, event recordings, and
                    graphics—is protected by copyright and intellectual property laws.
                </p>

                <h4 className="font-noto font-bold mt-2">Permitted Use</h4>
                <ul className="list-disc pl-6">
                    <li>View, share, and link to our content</li>
                    <li>Quote limited portions with clear attribution to TMPL</li>
                    <li>Embed publicly available interview videos (e.g., YouTube embeds)</li>
                </ul>

                <h4 className="font-noto font-bold mt-2">Prohibited Use</h4>
                <ul className="list-disc pl-6">
                    <li>Republish full articles, videos, or interviews without written permission</li>
                    <li>Copy, modify, or commercially exploit our content</li>
                    <li>Sell, license, or re-upload our videos to third-party platforms</li>
                    <li>Scrape content or metadata using automated tools</li>
                    <li>Use our logos, branding, or trademarks without authorization</li>
                </ul>
                <p>Any breach may lead to account suspension or legal action.</p>

                <h3 className="font-noto font-bold mt-4">4. User Conduct &amp; Obligations</h3>
                <p>By accessing TMPL platforms, you agree NOT to:</p>
                <ul className="list-disc pl-6">
                    <li>Engage in unlawful activities</li>
                    <li>Upload harmful files, malware, or unauthorized advertising</li>
                    <li>Attempt to bypass security measures</li>
                    <li>Harvest emails or scrape data for commercial use</li>
                    <li>Misrepresent your identity or affiliation</li>
                    <li>Publish defamatory or harmful content on interactive features</li>
                </ul>
                <p>TMPL reserves the right to block or restrict users engaged in prohibited behavior.</p>

                <h3 className="font-noto font-bold mt-4">5. Account Registration</h3>
                <p>
                    Some services require registration (newsletter, events, CXOVerse, LeadXchange.ai). You must provide accurate information and
                    maintain confidentiality of your login credentials. TMPL may suspend accounts that violate policies or appear fraudulent.
                </p>

                <h3 className="font-noto font-bold mt-4">6. Sponsored Content &amp; Advertising Transparency</h3>
                <p>(Explicitly added for Google News compliance)</p>
                <ul className="list-disc pl-6">
                    <li>TMPL publishes both editorial and sponsored content.</li>
                    <li>Sponsored content is clearly labeled as “Partner Content”, “Sponsored Interview”, or “Brand Feature”.</li>
                    <li>Advertisers and sponsors cannot influence editorial decisions.</li>
                    <li>Editorial independence is maintained at all times.</li>
                    <li>Sponsored events and webinars will include disclosure during registration and in content descriptions.</li>
                </ul>

                <h3 className="font-noto font-bold mt-4">7. Editorial Independence &amp; Accuracy Disclaimer</h3>
                <p>
                    TMPL follows strict editorial standards. However:
                </p>
                <ul className="list-disc pl-6">
                    <li>We do not guarantee the completeness or accuracy of all information.</li>
                    <li>Views expressed by guest authors, speakers, or interviewees are their own.</li>
                    <li>Market data, vendor claims, or technology statements are considered accurate at time of publication but may change.</li>
                </ul>
                <p>TMPL reserves the right to update or correct information.</p>

                <h3 className="font-noto font-bold mt-4">8. Third-Party Links &amp; External Services</h3>
                <p>
                    Our websites may include links to third-party websites, sponsors, advertisers, or tools. TMPL is not responsible for the accuracy of
                    external content, privacy practices of third-party sites, or losses or damages caused by third-party actions. Users access third-party
                    links at their own risk.
                </p>

                <h3 className="font-noto font-bold mt-4">9. Event Participation Terms</h3>
                <p>
                    For conferences, webinars, roundtables, CXO talks, and LeadXchange.ai demos:
                </p>
                <ul className="list-disc pl-6">
                    <li>Registration does not guarantee access</li>
                    <li>TMPL may modify event details</li>
                    <li>TMPL may share registration data with sponsors only if you provide consent</li>
                    <li>Event footage may be recorded and used in future marketing or editorial content</li>
                </ul>
                <p>Users who do not agree to these terms should refrain from participating.</p>

                <h3 className="font-noto font-bold mt-4">10. Data Protection &amp; Privacy</h3>
                <p>
                    The collection and processing of personal data is governed by our Privacy Policy. By using TMPL platforms, you consent to the data
                    practices described there. Your rights under GDPR, PDPA, DPDPA, and CCPA remain fully enforceable.
                </p>

                <h3 className="font-noto font-bold mt-4">11. Intellectual Property Rights</h3>
                <p>
                    All TMPL brands, trademarks, videos, articles, event names, graphics, and logos are the property of Techplus Media. Unauthorized
                    reproduction or misuse is strictly prohibited.
                </p>

                <h3 className="font-noto font-bold mt-4">12. Disclaimers</h3>
                <p>
                    TMPL platforms are provided “as-is”. We do not guarantee uninterrupted access, error-free operation, or permanent availability of
                    specific content. TMPL is not liable for business losses, revenue losses, or damages resulting from use of our platforms.
                </p>

                <h3 className="font-noto font-bold mt-4">13. Limitation of Liability</h3>
                <p>
                    To the maximum extent permitted by law, TMPL shall not be liable for direct or indirect damages, loss of data, loss of business
                    opportunity, loss of profits, or harm caused by external plugins, advertisers, or third-party tools.
                </p>

                <h3 className="font-noto font-bold mt-4">14. Indemnification</h3>
                <p>
                    By using our platforms, you agree to indemnify and hold harmless TMPL, its employees, editors, partners, and affiliates from any claims
                    arising from violation of these Terms, misuse of platform content, illegal or harmful activities, or intellectual property infringement.
                </p>

                <h3 className="font-noto font-bold mt-4">15. Termination of Access</h3>
                <p>
                    TMPL may suspend or terminate user access if Terms are violated, fraudulent activity is detected, automated scraping or misuse occurs,
                    or content or conduct harms platform integrity.
                </p>

                <h3 className="font-noto font-bold mt-4">16. Governing Law</h3>
                <p>
                    These Terms are governed by the laws of Singapore for global operations and India for TMPL India activities. Any legal disputes shall be
                    brought before Singapore or New Delhi jurisdiction depending on operational context.
                </p>

                <h3 className="font-noto font-bold mt-4">17. Contact Information</h3>
                <p>
                    For legal or compliance inquiries:
                </p>
                <ul className="list-disc pl-6">
                    <li><a href="mailto:legal@techplusmedia.com" className="text-[#1a73e8]">legal@techplusmedia.com</a></li>
                    <li><a href="mailto:privacy@techplusmedia.com" className="text-[#1a73e8]">privacy@techplusmedia.com</a></li>
                </ul>

                <p className="mt-2">
                    <span className="font-noto font-bold">Techplus Media Pte Ltd (Singapore)</span><br />
                    <span className="font-noto font-bold">Techplus Media Pvt. Ltd. (India)</span>
                </p>
            </div>
        </div>
    );
};

export default TermsOfService;
