import Layout from "@/components/sections/Layout";
import BulkListModal from "@/components/trade/BulkListModal";
import Tabs from "@/components/UI/Tabs";
import History from "@/components/sections/History";
import Head from "next/head";

export default function WalletHistory() {
  return (
    <Layout>
      <Head>
        <title>Litemap - Wallet</title>
        <meta
          name="description"
          content="Litemap - wallet history and inscriptions"
        />
      </Head>

      <h1 className="text-3xl font-semibold my-16 text-center">
        My Wallet
      </h1>

      <div className="flex justify-center sm:justify-between w-full">
        <Tabs type={"history"} loading={false} />
      </div>

      <History />
    </Layout>
  );
}
