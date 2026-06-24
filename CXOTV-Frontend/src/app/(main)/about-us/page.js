export const revalidate = 86400; // — ISR

import Head from 'next/head';

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full font-normal font-fira text-[#666666] text-[16px]">
      <Head>
        <title>About Us</title>
        <meta
          name="description"
          content="Learn about CXOTV.news - India's premier news web channel for corporate decision-makers"
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
          About us
        </p>
      </div>

      <div className="fira flex flex-col p-10 gap-5">
        {/* ----------- EXISTING ABOUT CONTENT ----------- */}
        <p className="fira">
          <span className="fira font-noto text-black font-bold">CXOTV.news:</span>{" "}
          Empowering Corporate Decision Makers with Timely Insights
        </p>

        <p className="fira">
          <span className="fira font-noto text-black font-bold">CXOTV.news</span>,
          a part of{" "}
          <span className="font-noto text-black font-bold">Techplus Media</span>,
          stands tall as India’s first and unparalleled news web channel,
          dedicated to corporate decision-makers. Our platform curates daily
          exclusive news capsules, offering profound insights into the pivotal
          role of technology across diverse business domains, all presented in
          quick and informative video bytes. With over 1,500,000 unique monthly
          visitors and a subscriber base of 1.23 lakh,{" "}
          <span className="font-noto text-black font-bold">CXOTV.news</span> is
          redefining how crucial information is delivered.
        </p>

        <p className="fira">
          <span className="font-noto text-black font-bold">CXOTV.news</span> is
          your go-to destination for staying informed with the latest trends and
          advancements shaping the corporate landscape. Our content caters to
          top-level executives and entrepreneurs, fostering peer-to-peer learning
          to enrich business strategies. We deliver timely news on international
          and national events, exhibitions, and conventions while hosting
          insightful interviews featuring Directors, C-level Executives, and
          Industry Experts.
        </p>

        <p className="fira">
          Our mission is to facilitate the seamless transfer of relevant
          knowledge across essential domains, including general management, ICT,
          HR management, finance, supply chain, manufacturing, and sales &
          marketing.
        </p>

        <p className="fira">
          <span className="font-noto text-black font-bold">CXOTV.news</span>
          prides itself as a weekly intelligence report, providing crisp bytes
          specially tailored for corporate leaders on the move. Our platform
          empowers decision-makers with critical insights and up-to-date
          information that drives business success.
        </p>

        <p className="fira">
          Join{" "}
          <span className="font-noto text-black font-bold">CXOTV.news</span> and
          experience a transformative journey of informed decision-making, backed
          by Techplus Media’s extensive experience and expertise. We boast 1.5
          million unique monthly visitors, over 1.23 lakh subscribers, and
          60,000-65,000 daily website visits. Our influential presence extends to
          a thriving LinkedIn community of 42,000+ followers and over 2000
          dedicated YouTube subscribers.
        </p>

        <span className="font-noto text-black font-bold">Key Highlights:</span>
        <ul className="list-disc pl-4">
          <li>1.5 million unique visitors monthly</li>
          <li>1.23 lakh subscribers</li>
          <li>60,000-65,000 daily website visits</li>
          <li>42,000+ LinkedIn followers</li>
          <li>2000+ YouTube subscribers</li>
        </ul>

        <p className="fira">
          To explore <span className="font-noto text-black font-bold">CXO TV</span>{" "}
          further, visit{" "}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://cxotv.techplusmedia.com/
          </a>
        </p>

        <p className="fira">
          Be a part of{" "}
          <span className="font-noto text-black font-bold">CXOTV.news</span>{" "}
          today and unlock the power of knowledge for unprecedented growth and
          success in your corporate endeavors.
        </p>

        {/* ---------------- NEW UPGRADED SECTION ---------------- */}
        <div className="mt-10">
          <h2 className="text-black font-noto font-bold text-xl mb-3">
            CXO TV — Global Leadership Knowledge Platform
          </h2>

          <p className="fira">
            <span className="font-noto text-black font-bold">CXO TV</span> is a
            global media platform covering the digital transformation journeys of
            CIOs, CISOs, CTOs, CDOs, CMOs, CHROs, and business leaders across
            APAC, ANZ, Middle East, and India.
          </p>

          <p className="fira">
            We deliver high-quality interviews, news updates, panel discussions,
            roundtables, webinars, and thought leadership across cloud,
            cybersecurity, infrastructure modernization, AI, and enterprise
            technology.
          </p>

          <p className="fira">
            <span className="font-noto text-black font-bold">Our Vision:</span>{" "}
            To become the world’s leading knowledge platform for CXOs.
          </p>


        </div>
      </div>
    </div>
  );
};

export default AboutUs;
