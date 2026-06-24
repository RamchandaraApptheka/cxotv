export const revalidate = 86400; // — ISR

import Head from "next/head";

const EditorialGuidelines = () => {
    const lastUpdated = "29 Nov 2025";

    return (
        <div className="flex flex-col w-full font-normal font-fira text-[#666666] text-[16px]">
            <Head>
                <title>CXO TV — Editorial Guidelines</title>
                <meta
                    name="description"
                    content="CXO TV — Editorial Guidelines, Corrections Policy & Ethics Standards (Techplus Media)"
                />
            </Head>

            <div
                className="flex items-center justify-center my-10"
                style={{
                    backgroundImage: "url(/assets/page2logo.jpg)",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "80px",
                }}
            >
                <p className="lg:text-[68px] text-[20px] text-white font-fira capitalize">
                    Editorial Guidelines
                </p>
            </div>

            <div className="fira flex flex-col p-10 gap-5">
                <p className="font-noto text-black font-bold">CXO TV – Editorial Guidelines, Corrections Policy &amp; Ethics Standards</p>

                <p className="text-sm text-[#888]">Last Updated: <span className="font-noto font-bold">{lastUpdated}</span></p>

                <p>
                    <span className="font-noto font-bold">Operated by:</span> Techplus Media Pte Ltd / Techplus Media Pvt. Ltd.
                </p>

                <p>
                    CXO TV is committed to delivering accurate, independent, and high-quality journalism to global IT and business leaders.
                    These Editorial Guidelines outline our commitment to truth, fairness, accountability, and transparency in all content we
                    publish—across CXO TV, itVARnews, Health Technologies, BFSI &amp; Fintech, Education Technology, CXOVerse, and all Techplus Media properties.
                </p>

                <p>
                    This page fulfills the editorial transparency requirements mandated by Google News, Google Publisher Center, and international media standards.
                </p>

                <h3 className="font-noto font-bold mt-6">1. Editorial Mission</h3>
                <p>
                    Our mission is to deliver trustworthy news, interviews, analysis, and insights on enterprise technology, cloud, cybersecurity,
                    digital transformation, business leadership, and innovation for CXOs across APAC, India, EMEA, and North America.
                </p>
                <p>We strive to uphold:</p>
                <ul className="list-disc pl-6">
                    <li>Accuracy</li>
                    <li>Independence</li>
                    <li>Fairness</li>
                    <li>Transparency</li>
                    <li>Public accountability</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">2. Editorial Independence</h3>
                <p>CXO TV maintains a strict separation between editorial and commercial operations.</p>
                <ul className="list-disc pl-6">
                    <li>Editorial decisions are made independently by editors and journalists.</li>
                    <li>Advertisers, sponsors, partners, or clients cannot influence our reporting, headlines, conclusions, or editorial direction.</li>
                    <li>Sponsored content is always clearly labeled as:
                        <ul className="list-disc pl-6">
                            <li>“Partner Content”</li>
                            <li>“Sponsored Interview”</li>
                            <li>“Brand Feature”</li>
                            <li>“In Partnership With [Sponsor]”</li>
                        </ul>
                    </li>
                    <li>Our newsroom does NOT publish paid news disguised as editorial content.</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">3. Standards of Accuracy &amp; Verification</h3>
                <p>We commit to ensuring all published content is accurate and well-sourced. We follow these principles:</p>
                <ul className="list-disc pl-6">
                    <li>Verify facts through multiple sources</li>
                    <li>Use primary data, statements, or authoritative references (Gartner, IDC, Statista, official corporate reports)</li>
                    <li>Attribute information clearly</li>
                    <li>Avoid sensationalism or unverified claims</li>
                    <li>Validate quotes with interviewees when necessary</li>
                </ul>
                <p><strong>For interviews and CXO insights:</strong></p>
                <ul className="list-disc pl-6">
                    <li>Statements by leaders/executives reflect their own professional views</li>
                    <li>CXO TV does not alter the meaning or context of the speaker’s statements</li>
                    <li>Videos may be edited for clarity, but narratives are not changed</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">4. Use of Artificial Intelligence (AI) in Content Production</h3>
                <p>AI tools may assist with:</p>
                <ul className="list-disc pl-6">
                    <li>Research synthesis</li>
                    <li>Draft structuring</li>
                    <li>Transcription</li>
                    <li>Headline suggestions</li>
                </ul>
                <p><strong>BUT:</strong></p>
                <ul className="list-disc pl-6">
                    <li>All content is reviewed and approved by a human editor</li>
                    <li>We do not publish auto-generated or unverified AI content</li>
                    <li>AI is NEVER used to fabricate quotes, events, or people</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">5. Sourcing &amp; Attribution</h3>
                <ul className="list-disc pl-6">
                    <li>Information must be backed by credible sources (industry research, official releases, interviews)</li>
                    <li>Anonymous sources are used only when necessary and only with editor approval</li>
                    <li>We avoid publishing rumors, speculative news, or unverified leaks</li>
                    <li>When we use third-party sources, we provide attribution and link to the original publisher</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">6. Corrections &amp; Updates Policy</h3>
                <p>CXO TV is committed to accuracy and transparency.</p>

                <h4 className="font-noto font-bold mt-2">6.1 Corrections</h4>
                <p>If a factual error is identified—by readers, sources, or internal review—we:</p>
                <ul className="list-disc pl-6">
                    <li>Correct the content promptly</li>
                    <li>Add a clear correction note at the bottom of the article</li>
                    <li>Specify what was corrected and why</li>
                </ul>
                <p><em>Example:</em> Correction (12/01/2025): An earlier version misstated the number of deployments. The article has been updated.</p>

                <h4 className="font-noto font-bold mt-2">6.2 Updates</h4>
                <p>When additional information becomes available:</p>
                <ul className="list-disc pl-6">
                    <li>We update the article</li>
                    <li>Add an “Updated on” timestamp</li>
                    <li>Clarify nature of update (new statements, new data, clarifications)</li>
                </ul>

                <h4 className="font-noto font-bold mt-2">6.3 Reporting Errors</h4>
                <p>Readers may report accuracy issues at:</p>
                <ul className="list-disc pl-6">
                    <li><a href="mailto:editorial@cxotv.news" className="text-[#1a73e8]">editorial@cxotv.news</a></li>
                    <li><a href="mailto:editorial@techplusmedia.com" className="text-[#1a73e8]">editorial@techplusmedia.com</a></li>
                </ul>

                <h3 className="font-noto font-bold mt-6">7. Ethics &amp; Professional Conduct Policy</h3>
                <p>CXO TV follows ethical journalism principles based on global media standards.</p>

                <h4 className="font-noto font-bold mt-2">7.1 No Plagiarism</h4>
                <p>Plagiarism is strictly prohibited. Every article must reflect original reporting, writing, or properly attributed sources.</p>

                <h4 className="font-noto font-bold mt-2">7.2 Respect &amp; Sensitivity</h4>
                <p>Content must avoid:</p>
                <ul className="list-disc pl-6">
                    <li>Defamation</li>
                    <li>Discrimination</li>
                    <li>Harassment</li>
                    <li>Hate speech</li>
                    <li>Harmful stereotypes</li>
                </ul>
                <p>We respect diversity, inclusivity, and fairness.</p>

                <h4 className="font-noto font-bold mt-2">7.3 Conflicts of Interest</h4>
                <ul className="list-disc pl-6">
                    <li>Editors, reporters, hosts, and contributors must disclose personal/professional conflicts</li>
                    <li>Cannot cover companies where they have financial interest</li>
                    <li>Cannot accept gifts or incentives in exchange for coverage</li>
                </ul>

                <h4 className="font-noto font-bold mt-2">7.4 Transparency with Sponsored Content</h4>
                <p>Paid content is always clearly marked. We do not allow:</p>
                <ul className="list-disc pl-6">
                    <li>Hidden advertising</li>
                    <li>Covert marketing</li>
                    <li>Misleading endorsements</li>
                </ul>

                <h4 className="font-noto font-bold mt-2">7.5 Editorial Conduct in Interviews</h4>
                <ul className="list-disc pl-6">
                    <li>Interviewees may review factual quotes for accuracy</li>
                    <li>We do not allow pre-approval of editorial questions</li>
                    <li>Sponsors cannot edit or remove journalistic content</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">8. Content Removal &amp; Moderation</h3>
                <p>We may remove or refuse content that:</p>
                <ul className="list-disc pl-6">
                    <li>Violates laws</li>
                    <li>Contains hate, violence, or harassment</li>
                    <li>Infringes copyright</li>
                    <li>Spreads misinformation</li>
                    <li>Violates editorial standards or community norms</li>
                </ul>

                <h3 className="font-noto font-bold mt-6">9. Transparency &amp; Accountability</h3>
                <p>
                    We stand by our work and our newsroom. If you believe we have failed to uphold our standards, you may escalate concerns to:
                </p>
                <ul className="list-disc pl-6">
                    <li><a href="mailto:editorial@cxotv.news" className="text-[#1a73e8]">editorial@cxotv.news</a></li>
                    <li><a href="mailto:editorial@techplusmedia.com" className="text-[#1a73e8]">editorial@techplusmedia.com</a></li>
                </ul>

                <h3 className="font-noto font-bold mt-6">10. Contact Information</h3>
                <p className="font-noto font-bold">Editorial Team – CXO TV</p>
                <p>Email: <a href="mailto:editorial@techplusmedia.com" className="text-[#1a73e8]">editorial@techplusmedia.com</a></p>

                <p className="mt-4">
                    <span className="font-noto font-bold">Techplus Media Pte Ltd (Singapore)</span><br />
                    <span className="font-noto font-bold">Techplus Media Pvt. Ltd. (India)</span>
                </p>
            </div>
        </div>
    );
};

export default EditorialGuidelines;
