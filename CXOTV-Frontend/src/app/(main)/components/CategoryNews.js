'use client';

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Ad from "./Ad";
import VideoAd from "./VideoAd";
import Link from "next/link";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import timeAgo from "../../../utils/dateConverter";
import { fetchCustomAds } from "../../../redux/slices/customAdsSlice";
import { BACKEND_URL } from '@/utils/env';
import { resolveImageUrl } from '../../../utils/resolveImageUrl';

const CategoryNews = ({ nameBeforeId }) => {
  const dispatch = useDispatch();
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchCustomAds());
  }, [dispatch]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const apiUrl = `${BACKEND_URL}/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories].data[name][$eq]=Trending%20News&filters[$or][1][subcategories][name][$eq]=Trending%20News&pagination[limit]=20`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        setNewsData(data.data || []);
      } catch (err) {
        console.error("Error fetching news data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const itemsToDisplay = newsData.slice(0, 20);

  return (
    <div className="lg:flex flex-col w-full gap-5 cursor-pointer">
      <VideoAd />

      <div className="lg:flex flex-col gap-1">
        {loading ? (
          <div className="text-center py-4">Loading trending news...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">Error loading news: {error}</div>
        ) : itemsToDisplay.length === 0 ? (
          <div className="text-center py-4">No trending news available</div>
        ) : (
          itemsToDisplay.map((item) => (
            <div key={item.id} className="max-sm:mt-12 lg:mt-0">
              <div
                data-tooltip-id="my-tooltip3"
                data-tooltip-content={item.attributes.title}
              >
                <Link
                  href={`/${nameBeforeId}/${item.attributes.slug}`}
                  className="lg:flex gap-3 lg:h-28 h-full cursor-pointer"
                >
                  {item.attributes.image?.data?.attributes ? (
                    <Image
                      src={resolveImageUrl(
                        item.attributes.image.data.attributes.formats?.small?.url ||
                        item.attributes.image.data.attributes.url
                      )}
                      alt={item.attributes.title || "News image"}
                      className="object-cover lg:h-24 h-48 w-full lg:w-[45%]"
                      width={400}
                      height={300}
                      loading="lazy"
                    />
                  ) : (
                    <div className="bg-gray-200 lg:h-24 h-48 w-full lg:w-[45%]"></div>
                  )}

                  <div className="noto-text lg:flex flex-col gap-1 lg:w-[55%]">
                    <h2 className="text-[14px] lg:py-0 py-4 leading-5 lg:h-20 overflow-y-hidden font-noto font-normal hover:text-[#7B5FF4] transition-all duration-200 overflow-hidden">
                      {item.attributes.title}
                    </h2>
                    <p className="text-[13px]">
                      {item.attributes.Date
                        ? timeAgo(item.attributes.Date)
                        : timeAgo(item.attributes.publishedAt)}
                    </p>
                  </div>
                </Link>
              </div>
              <Tooltip id="my-tooltip3" />
            </div>
          ))
        )}
      </div>

      <div>
        <Ad name="Data-cloud" />
      </div>
      <div className="mt-5">
        <Ad name="video" />
      </div>
    </div>
  );
};

export default CategoryNews;