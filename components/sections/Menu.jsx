/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import Link from "next/link";
import Navigation from "./Navigation";
import WalletConnect from "./WalletConnect";
import { useEffect } from "react";

export default function MenuBar() {
  const [scrollHeader, setScrollHeader] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 5) {
        setScrollHeader(true);
      } else {
        setScrollHeader(false);
      }
    });
  }, []);

  return (
    <div
      className={`flex justify-between items-center fixed top-0 left-1/2 -translate-x-1/2 w-full border-b border-transparent sm:px-6 px-3 z-50  duration-200 ${
        scrollHeader
          ? "bg-primary-dark/5 backdrop-blur-2xl py-1 shadow shadow-black border-[#ffffff1a]"
          : "bg-transparent py-2"
      }`}
    >
      <Link href="/" className="hidden md:inline-block">
        <img src="/logo2.png" alt="" className="md:w-[180px] lg:w-[220px]  my-auto" />
      </Link>

      <Navigation />

      <div className="flex gap-3 items-center">
        <WalletConnect />
      </div>
    </div>
  );
}
