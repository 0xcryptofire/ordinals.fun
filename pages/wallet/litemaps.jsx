import Layout from "@/components/sections/Layout";
import InscriptionCard from "@/components/UI/InscriptionCard";
import { WalletContext } from "@/context/wallet";
import { useContext, useState } from "react";
import { useEffect } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import InscriptionCardSkelenton from "@/components/UI/InscriptionCardSkelenton";
import { get, onValue, push, query, ref, update } from "firebase/database";
import { db } from "@/services/firebase";
import { useWallet } from "@/store/hooks";
import { MdCancel } from "react-icons/md";
import { FaList } from "react-icons/fa";
import BulkListModal from "@/components/trade/BulkListModal";
import { toast } from "react-hot-toast";
import Tabs from "@/components/UI/Tabs";
import Head from "next/head";
import { useLastBlock } from "../../store/hooks";

export default function WalletLiteMap() {
  const wallet = useContext(WalletContext);
  const address = wallet.getAddress();
  const { inscriptions } = useWallet();
  const { lastBlock } = useLastBlock();
  const [fetchingData, setFetchingData] = useState(true);
  const [offset, setOffset] = useState(0);
  const [inscriptionsFromDB, setInscriptionFromDB] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [bulkSelect, setBulkSelect] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let pushing = false;

  const cancelBlocks = () => {
    setSelectedBlocks([]);
    setBulkSelect(false);
  };

  const saveInscriptionToDB = async (data) => {
    if (pushing) {
      return;
    }
    pushing = true;
    const dbRef = ref(db, `wallet/${address}`);

    //  console.log("running");
    try {
      const snapshot = await get(dbRef);
      const exist = snapshot.exists();

      if (exist) {
        const key = Object.keys(snapshot.val())[0];
        const dbRefToUpdate = ref(db, `/wallet/${address}/${key}`);
        if (data && key !== "activities") {
          const existedInscriptions = snapshot.val()[key].inscriptions;

          const listedInscriptions = existedInscriptions.filter(
            (inscription) => inscription?.listed === true
          );

          let updatedinscriptions = [];
          data.map((inscription) => {
            const filter = listedInscriptions?.filter(
              (list) => list?.inscriptionId == inscription?.inscriptionId
            );
            if (filter.length > 0) {
              updatedinscriptions.push({
                ...inscription,
                listed: true,
                tag: filter[0]?.tag,
              });
            } else {
              updatedinscriptions.push(inscription);
            }
          });
          await update(dbRefToUpdate, { inscriptions: updatedinscriptions });
        } else {
          if (data) {
            const dbRef = ref(db, `wallet/${address}`);
            await push(dbRef, { inscriptions: data });
          }
        }
        await fetchInscriptions();
        pushing = false;
      } else {
        if (data) {
          const dbRef = ref(db, `wallet/${address}`);
          await push(dbRef, { inscriptions: data });
        }
        setFetchingData(false);
      }
    } catch (error) {
      setFetchingData(false);
      pushing = false;
      console.error("Error saving transaction:", error);
    }
  };

  async function fetchInscriptions() {
    const dbQuery = query(ref(db, `wallet/${address}`));
    onValue(dbQuery, async (snapshot) => {
      const exist = snapshot.val();
      if (exist) {
        setInscriptionFromDB(exist[Object.keys(exist)[0]]["inscriptions"]);
      }
      setFetchingData(false);
    });
  }

  const BulkList = () => {
    if (selectedBlocks.length <= 0) {
      toast.error("Please select inscriptions");
      return;
    }
    setBulkSelect(false);
    setIsOpen(true);
  };

  const handlePageClick = (e) => {
    setOffset(e.selected);
  };

  useEffect(() => {
    if (address) {
      saveInscriptionToDB(inscriptions.list);
    } else {
      setFetchingData(false);
    }
  }, [inscriptions, address]);

  return (
    <Layout>
      <Head>
        <title>Litemap - Wallet</title>
        <meta
          name="description"
          content="Litemap - wallet history and inscriptions"
        />
      </Head>

      <h1 className="text-3xl font-semibold my-16 text-center">My Wallet</h1>

      {!bulkSelect ? (
        <button
          className="main_btn px-2 py-1 rounded-md sm:hidden inline-block mb-1"
          onClick={() => setBulkSelect(true)}
        >
          Bulk Select
        </button>
      ) : (
        <button
          className=" bg-red-500 main_btn px-2 py-1 rounded-md gap-2 items-center sm:hidden flex  mb-1"
          onClick={() => cancelBlocks()}
        >
          <MdCancel /> Cancel
        </button>
      )}

      <div className="flex justify-center sm:justify-between w-full">
        <Tabs type={"litemap"} loading={fetchingData} />

        {!bulkSelect ? (
          <button
            className="main_btn px-2 py-1 rounded-md hidden sm:inline-block"
            onClick={() => setBulkSelect(true)}
          >
            Bulk Select
          </button>
        ) : (
          <button
            className=" bg-red-500 main_btn px-2 py-1 rounded-md gap-2  items-center hidden sm:flex"
            onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
        )}
      </div>

      <>
        {" "}
        {fetchingData ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 w-full">
              {Array.from({ length: 10 }, (_, key) => {
                return <InscriptionCardSkelenton key={key} />;
              })}
            </div>
          </>
        ) : (
          <>
            {!inscriptionsFromDB ? (
              <>
                <div className="my-auto flex flex-col justify-center items-center">
                  <h1 className="text-xl font-bold mb-8 animate-pulse text-center">
                    You don not have any inscriptions.
                  </h1>

                  <Link
                    href={"/inscribe"}
                    className="mx-auto main_btn px-3 py-2 rounded-md"
                  >
                    Inscribe Now
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8 w-full">
                  {inscriptionsFromDB &&
                    inscriptionsFromDB
                      .slice(offset * 10, offset * 10 + 10)
                      .map((inscription, key) => {
                        return (
                          <InscriptionCard
                            inscription={inscription}
                            key={inscription.inscriptionId + "litemaps"}
                            inscriptionIndex={key + offset * 10}
                            bulkSelect={bulkSelect}
                            tag={"litemap"}
                            setSelectedBlocks={setSelectedBlocks}
                            selectedBlocks={selectedBlocks}
                            lastBlock={lastBlock}
                            isNFT={false}
                          />
                        );
                      })}
                </div>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  marginPagesDisplayed={1}
                  pageCount={Math.ceil(
                    Object.keys(inscriptionsFromDB).length / 10
                  )}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                  className="pagination"
                />
              </>
            )}
          </>
        )}
      </>

      <div
        className={`fixed z-50  left-1/2 border border-transparent ${
          !bulkSelect ? "-bottom-64 border-[#ffffff1a]" : "bottom-6 sm:bottom-6"
        }   -translate-x-1/2 px-6 py-3 rounded-lg bg-white/10 backdrop-blur-2xl duration-200 flex items-center gap-3 flex-wrap shadow-black shadow-lg`}
      >
        <p>{selectedBlocks.length} inscriptions selected.</p>
        <div className="flex gap-3 sm:justify-end justify-center">
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-transparent"
            onClick={() => cancelBlocks()}
          >
            <MdCancel /> Cancel
          </button>
          <button
            className="main_btn py-2 px-4 rounded-lg flex items-center gap-2 bg-sky-600"
            onClick={BulkList}
          >
            List <FaList />
          </button>
        </div>
      </div>

      <BulkListModal
        modalIsOpen={isOpen}
        setIsOpen={setIsOpen}
        tag={"litemap"}
        blocks={selectedBlocks}
        setSelectedBlocks={setSelectedBlocks}
        cancelBlocks={cancelBlocks}
      />
    </Layout>
  );
}
