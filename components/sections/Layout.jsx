import React from "react";
import Head from "next/head";
import MenuBar from "@/components/sections/Menu";
import Footer from "./Footer";

export default function Layout(props) {
  return (
    <main>
      <Head>
        <title>ordinals.fun</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Litemap: The Best ordinals market place on Litecoin"
        />
        <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo.png" />
        <meta
          content="Litemap, ordinals, litecoin, PSBT, market place, NFTs, NFT, Banksy superstar set 1, Lil Ordies, Lite Punks, Litecoin Glitch Ordinals, Moonbirds, Punks, ordirobots, Ballers, Drip Cats, Armored, Lizards  "
          name="keywords"
        />
        <meta property="og:title" content="ordinals.fun " />
        <meta property="og:type" content="ordinals.fun" />
        <meta
          property="og:description"
          content="Litemap: The Best ordinals market place on Litecoin"
        />
        <meta property="og:url" content="https://marketplace.ordinals.fun" />
        <meta property="og:site_name" content="ordinals.fun"></meta>
        <meta
          property="og:image"
          content="https://marketplace.ordinals.fun/logo.png"
        ></meta>
        <meta property="og:image:type" content="image/png"></meta>
        <meta property="og:image:width" content="2000"></meta>
        <meta property="og:image:height" content="2000"></meta>
        <meta property="og:image:alt" content="Logo"></meta>
      </Head>

      <div className="flex items-center flex-col container min-h-screen py-[90px] relative">
        <MenuBar />
        {props.children}
        <Footer />
      </div>
    </main>
  );
}
