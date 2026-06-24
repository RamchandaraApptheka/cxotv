export const revalidate = 86400; // — ISR

import Head from 'next/head';

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full font-normal font-fira text-[#666666] text-[16px]">
      <Head>
        <title>Terms and Conditions</title>
        <meta name="Terms and Conditions" content="Learn about CXOTV.news - India's premier news web channel for corporate decision-makers" />
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
          Terms and Conditions
        </p>
      </div>

      <div className="fira flex flex-col py-6 mx-auto w-[95%] gap-5">
        <p>
          <span className="font-noto text-black font-bold">CXOTV.news</span> brings the IT industry news to leadership
          level decision makers- every day and everywhere!
        </p>

        <p>
          Every company has stories to tell. CXOtv takes a creative approach to
          ensuring the RIGHT people hear them.
        </p>
        <p>
          We ensure your story reaches quality audiences in the professional
          context using the best possible video format. CXOtv,the largest
          network for CXO community has rolled out video content that supports
          Marketers and Brands to leverage video for sponsored content and
          company pages to reach and engage the right audiences in the right
          manner.
        </p>
        <p>
          As an active player in the field of video advertising, we{" "}
          <span className="font-noto text-black font-bold">showcase</span>
          your ideas and knowledge, not tell you <span className="font-noto text-black font-bold">what</span> they should
          be. Our editors and writers are there to help, not impose.
        </p>
        <p>
          We provide end to end video support – from script writing, videography
          and editing, voiceover recording and presenting your videos in a
          highly professional, great finish format. Our collaborative approach
          includes working closely with your team for{" "}
          <span className="font-noto text-black font-bold">Ideating,Producing and Promoting</span> your Video.
        </p>
        <p>
          So share your story, and we will take it to your market in the most
          engaging way possible.
        </p>
        <span className="font-noto text-black font-bold">The state of video marketing in India</span>
        <p>
          As per ‘B2B Video Report’ Video marketing is a critical area of
          investment for B2B marketers in India this year. The survey found
          that:
        </p>
        <ul className="list-disc pl-4">
          <li>
            The average budget that Indian marketers have allocated to B2B video
            advertising in 2018 is INR 1.5 crore (approx 15 million), which is
            21% higher than the average budget spent on video in 2017.
          </li>
          <li>For Indian B2B marketers,</li>
        </ul>
        <ul className="list-disc pl-8">
          <li>Product Videos</li>
          <li>TV Commercials</li>
          <li>Live Stream</li>
          <li>Explainer Videos</li>
          <li>Webinar (Live & On Demand)</li>
          <li>Case study /Customer Testimonials</li>
        </ul>
        <p>are the most popular types of B2B video formats they plan to use this year.</p>
        <ul className="list-disc pl-4"><li>About 56% of digital marketers in India strongly feel that using video gives B2B brands more room for creative storytelling.</li>
          <li>Almost 79% of Indian B2B marketers currently use video advertising for raising brand awareness</li>
          <li>56% of them use video for product/service promotion;</li>
          <li>48% use it for lead generation.</li>
          <li>54% strongly believe that video helps in identifying higher quality leads</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;