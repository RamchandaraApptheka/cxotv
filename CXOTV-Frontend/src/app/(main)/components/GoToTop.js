"use client"
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const GoToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const goToBtn = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const listenToScroll = () => {
    let heightToHidden = 20;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHidden) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  return (
    <div className="flex justify-center items-center relative">
      {isVisible && (
        <div
          className="top-btn text-white text-2.4xl w-12 h-12 bg-blue-900 shadow rounded-full fixed bottom-20 right-20 flex justify-center items-center cursor-pointer"
          onClick={goToBtn}
        >
          <FaArrowUp size={15} />
        </div>
      )}
    </div>
  );
};

export default GoToTop;
