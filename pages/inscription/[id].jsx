import React, { useEffect } from "react";
import Layout from "@/components/sections/Layout";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useState } from "react";
import InscriptionPreview from "@/components/UI/InscriptionPreview";
import openAPI from "@/services/openAPI";
import InscriptionDetails from "@/components/UI/InscriptionDetails";
import Head from "next/head";

export default function Inscription(props) {
  const router = useRouter();
  const accountInfo = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [content, setContent] = useState();

  const getContent = async (id) => {
    if (id) {
      try {
        const url = "https://ordinalslite.com/content/" + id;
        const data = await fetch(url);
        const textData = await data.text();
        setContent(textData);
        setLoading(false);
      } catch (error) {
        //  console.log("content fetch", error);
        setLoading(false);
      }
    }
  };

  const getData = async (id) => {
    setLoading(true);
    const data = await openAPI.getInscriptionUtxoDetail(id);

    if (data) {
      setData(data?.inscriptions[0]);
    }
    getContent(id);
    setLoading(false);
  };

  useEffect(() => {
    if (router.asPath !== router.route) {
      if (router?.query?.id && accountInfo) {
        setId(router?.query?.id);
        getData(router?.query?.id);
      }
    }
  }, [router.isReady]);

  return (
    <Layout>
      <Head>
        <title>Litemap - Inscription Detail</title>
        <meta name="description" content="Litemap - Inscription Detail" />
      </Head>

      <p className="my-8 text-center text-3xl font-semibold">
        Inscription Detail
      </p>

      <div className="my-8 grid lg:grid-cols-2 grid-cols-1 gap-3 w-full">
        <InscriptionPreview content={content} inscription={data} />
        <InscriptionDetails data={data} content={content} />
      </div>
    </Layout>
  );
}
