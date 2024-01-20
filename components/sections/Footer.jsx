import React from "react";
import {
  FaDiscord,
  FaMedium,
  FaTelegram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <div className="mt-8 container flex justify-center items-center gap-3 absolute bottom-3 left-0 w-full">
      <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
        <FaDiscord />
      </button>
      <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
        <FaTwitter />
      </button>
      <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
        <FaTelegram />
      </button>
      <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
        <FaYoutube />
      </button>
      <button className="rounded-full h-[40px] w-[40px] text-xl bg-[#216da5] shadow shadow-black flex justify-center items-center">
        <FaMedium />
      </button>
    </div>
  );
}
