import React, { useState } from "react";
import Layout from "@/components/sections/Layout";
import { collectionsData } from "../configs/constants";
import CollectionTr from "../components/UI/CollectionTr";
import Head from "next/head";

export default function collections() {
  return (
    <Layout>
      <Head>
        <title>Litemap - NFT Collections</title>
        <meta
          name="description"
          content="Litemap - NFT Collections for market"
        />
      </Head>

      <div>
        <h2 className="text-4xl font-bold mt-16 mb-2 text-center sm:text-left">
          NFT Collections
        </h2>
        <p className="text-sm text-center w-full max-w-[900px] mb-12 mx-auto lg:px-[150px]">
          NFT PSBT market place on Litecoin.
        </p>
      </div>
      
      <div className="my-3 w-full">
        <table className="table-auto w-full">
          <thead>
            <tr className="px-[6px!important] my-[4px!important]">
              <th className="px-1 lg:px-3 py-1">#</th>
              <th className="py-1">Logo</th>
              <th className="py-1 pl-1">Name</th>
              <th className="py-1 hidden lg:inline-block">Description</th>
              <th className="py-1">Link</th>
              <th className="py-1 hidden lg:inline-block">Supply</th>
            </tr>
          </thead>
          <tbody>
            {collectionsData.map((collection, key) => {
              return (
                <CollectionTr key={key} collection={collection} index={key} />
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
