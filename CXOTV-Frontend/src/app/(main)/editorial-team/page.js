export const revalidate = 86400; // — ISR

import Head from "next/head";
import Image from "next/image";

const leadEditor = {
    name: "Kalpana Singhal",
    role: "Editor-in-Chief",
    img: "/editorial/team/kalpana-singhal.png",
    description:
        "Kalpana Singhal is a powerhouse editorial leader with 25 years of authority across IT, enterprise technology, and lifestyle media. Recognized for her sharp editorial vision and deep industry influence, she has led high-impact newsroom strategies, interviewed global CXOs, and shaped narratives defining digital transformation.",
};

const team = [
    {
        name: "Anand Sharma",
        role: "Editor – CXO TV",
        img: "/editorial/team/anand-sharma.jpg",
        description:
            "Anand Sharma is Editor at CXO TV, specializing in content for CMOs of technology brands. He curates marketing intelligence, brand transformation insights, and executive conversations through series like Marketing Monday, focusing on digital growth, demand generation, customer engagement, and data-driven marketing strategies.",
    },
    {
        name: "Amit Singh",
        role: "Content Head – itVARnews",
        img: "/editorial/team/amit-singh.png",
        description:
            "Amit Singh oversees content for itVARnews and ITPV Channel Magazine, covering channel partnerships, cloud marketplaces, security services, MSP growth, and ecosystem innovation. He champions actionable insights for distributors, OEMs, and solution providers to drive revenue and strengthen customer relationships.",
    },
    {
        name: "Prof. Supten Sarbadhikari",
        role: "Consulting Editor – Health",
        img: "/editorial/team/supten-sarbadhikari.jpg",
        description:
            "Prof. Supten Sarbadhikari is Consulting Editor for Health Technology at CXO TV. He hosts CXO Talk conversations with healthcare leaders, advises on virtual roundtables, and contributes on digital health, patient data governance, telehealth, and healthcare IT transformation.",
    },
    {
        name: "Prasanna Lohar",
        role: "Consulting Editor – BFSI",
        img: "/editorial/team/prasanna-lohar.jpg",
        description:
            "Prasanna Lohar is Consulting Editor for BFSI at CXO TV, contributing insights on digital banking, fintech innovation, cybersecurity, and financial inclusion. He supports CXO dialogues, virtual roundtables, and agenda development for banking and finance technology events.",
    },
    {
        name: "Archana Gupta",
        role: "Assistant Editor – CXO TV",
        img: "/editorial/team/archana-gupta.jpg",
        description:
            "Archana Gupta is Assistant Editor at CXO TV, managing CXO participation for podcast series like 'Talks with Kalpana – CXO Spotlight'. She coordinates editorial workflows with social, SEO, and design teams to support content on digital transformation, cloud innovation, and enterprise technology trends.",
    },
    {
        name: "Anushikha Singh",
        role: "Field Reporter – itVARnews",
        img: "/editorial/team/anushikha-singh.jpg",
        description:
            "Anushikha Singh is a Field Reporter at itVARnews covering channel press conferences, MSP and distributor updates, partner ecosystem news, and technology market trends. She conducts interviews at industry events and promotes stories focused on cybersecurity, cloud marketplaces, and digital transformation.",
    },
    {
        name: "Shaithra S",
        role: "Research Analyst",
        img: "/editorial/team/shaithra-s.jpg",
        description:
            "Shaithra S is a Research Analyst at Techplus Media specializing in technology insights and industry analysis. She helps develop topics for series such as Tech Thursday and CEO Talk, aligning expert interviews and research content on cybersecurity, cloud, AI, and enterprise innovation.",
    },
    {
        name: "Aarav Singhal",
        role: "AI & Cloud Reporter",
        img: "/editorial/team/aarav-singhal.jpg",
        description:
            "Aarav Singhal is an AI & Cloud Reporter based in the UK, covering enterprise AI adoption, cloud modernization, and emerging technology trends. He reports on CXO conversations and innovation stories across global tech markets with a focus on practical AI and data strategy.",
    },
    {
        name: "Hitanshi Gupta",
        role: "Sr. Correspondent – Data & Analytics",
        img: "/editorial/team/hitanshi-gupta.jpg",
        description:
            "Hitanshi Gupta is Senior Correspondent for Data & Analytics at Techplus Media, covering data strategy, BI, cloud databases, AI governance, and real-time analytics. She reports on CXO perspectives and enterprise case studies that highlight data innovation and performance optimization.",
    },
];

const EditorialTeam = () => {
    return (
        <div className="flex flex-col w-full font-fira text-[#444] text-[16px]">
            <Head>
                <title>Editorial Team - CXO TV</title>
                <meta name="description" content="Meet the CXO TV Editorial Team from Techplus Media." />
            </Head>

            {/* Hero Banner */}
            <div
                className="flex items-center justify-center my-10"
                style={{
                    backgroundImage: "url(/assets/page2logo.jpg)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "80px",
                }}
            >
                <p className="text-[40px] lg:text-[68px] text-white font-fira capitalize">Editorial Team</p>
            </div>

            {/* Introduction */}
            <div className="w-[95%] mx-auto flex flex-col gap-5 mb-10">
                <p>
                    CXO TV from Techplus Media editorial desk covers enterprise technology, cybersecurity, AI, cloud, data, digital transformation,
                    and leadership trends impacting CIOs, CISOs, CTOs, CDOs, CMOs, and board-level executives.
                </p>

                <ul className="list-disc pl-5">
                    <li>Senior Technology Correspondent – Enterprise tech and CIO/CISO strategies</li>
                    <li>Cloud & AI Reporter – Cloud modernization, AI adoption, analytics</li>
                    <li>Cybersecurity Analyst – Threats, frameworks, resilience insights</li>
                </ul>
            </div>

            {/* ⭐ SEPARATE SECTION FOR KALPANA */}
            <div className="w-[95%] mx-auto mb-14">
                <h2 className="font-noto font-bold text-black text-xl mb-5">Editor-in-Chief</h2>
                <div className="flex flex-col items-center bg-[#fafafa] p-8 rounded-lg shadow-md max-w-3xl mx-auto">
                    <Image
                        src={leadEditor.img}
                        alt={leadEditor.name}
                        width={200}
                        height={200}
                        className="rounded-full object-cover border"
                    />
                    <h3 className="font-bold text-black mt-4">{leadEditor.name}</h3>
                    <p className="text-[#666] text-sm mb-3">{leadEditor.role}</p>
                    <p className="text-center text-[14px]">{leadEditor.description}</p>
                </div>
            </div>

            {/* ⭐ TEAM GRID BELOW */}
            <div className="w-[95%] mx-auto">
                <h2 className="font-noto font-bold text-black text-xl mb-5">Editorial Team Members</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map((member, index) => (
                        <div key={index} className="flex flex-col items-center bg-[#fafafa] p-5 rounded-lg shadow-md">
                            <Image
                                src={member.img}
                                alt={member.name}
                                width={180}
                                height={180}
                                className="rounded-full object-cover border"
                            />
                            <h3 className="font-bold text-black mt-4">{member.name}</h3>
                            <p className="text-[#666] text-sm mb-3">{member.role}</p>
                            <p className="text-center text-[14px]">{member.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video & Broadcast Team */}
            <div className="w-[95%] mx-auto mt-12">
                <h2 className="font-noto font-bold text-black text-xl mb-3">Video & Broadcast Team</h2>
                <p>CXO TV’s broadcast content is produced by an in-house multimedia team responsible for:</p>
                <ul className="list-disc pl-5 mt-2">
                    <li>CXO interviews</li>
                    <li>Fireside chats</li>
                    <li>Roundtable coverage</li>
                    <li>Tech industry documentaries</li>
                    <li>Editorial video storytelling</li>
                </ul>
            </div>

            {/* Research Desk */}
            <div className="w-[95%] mx-auto mt-12">
                <h2 className="font-noto font-bold text-black text-xl mb-3">Research & Insights Desk</h2>
                <p>Supporting all editorial outputs with:</p>
                <ul className="list-disc pl-5 mt-2">
                    <li>Fact-checking</li>
                    <li>Data validation</li>
                    <li>Industry research</li>
                    <li>Thought leadership content</li>
                    <li>Executive summaries</li>
                </ul>
            </div>

            {/* Values */}
            <div className="w-[95%] mx-auto mt-12">
                <h2 className="font-noto font-bold text-black text-xl mb-3">Editorial Values & Standards</h2>
                <ul className="list-disc pl-5">
                    <li>Accuracy – Verified facts, credible sourcing</li>
                    <li>Independence – No advertiser influence</li>
                    <li>Transparency – Sponsored content clearly labeled</li>
                    <li>Fairness – Balanced representation</li>
                    <li>Integrity – Zero tolerance for plagiarism</li>
                </ul>
            </div>

            {/* Corrections */}
            <div className="w-[95%] mx-auto mt-12 mb-10">
                <h2 className="font-noto font-bold text-black text-xl mb-3">Corrections & Accountability</h2>
                <p>
                    We correct factual mistakes promptly. If you spot an error, please email:
                </p>
                <ul className="list-disc pl-5 mt-2">
                    <li>editorial@cxotv.news</li>
                    <li>editorial@techplusmedia.com</li>
                </ul>
            </div>
        </div>
    );
};

export default EditorialTeam;
