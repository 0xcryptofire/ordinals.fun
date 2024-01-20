import React from "react";
import { RiGlobalFill } from "react-icons/ri";
import { FaTwitter } from "react-icons/fa";
import { BsDiscord } from "react-icons/bs";
import { useRouter } from "next/router";

export default function CollectionTr({ index, collection }) {
  const router = useRouter();

  const goToNFTPage = () => {
    router.push(`/collection/${collection.slug}`);
  };

  return (
    <tr
      onClick={goToNFTPage}
      className="transition-all ease-in-out hover:bg-primary-dark/30 cursor-pointer px-[6px!important] my-[4px!important]"
    >
      <td className="py-2 pl-3 pr-2">{index + 1}</td>
      <td className="py-2">
        {collection?.inscription_icon ===
        "9278bd914fdc07f866fc4b4e402c87a0aa04666cfc9f0c9dde6ead58b17abcf7i0" ? (
          <img
            src={`/litecoin.png`}
            className="rounded-md h-[60px] w-[60px]"
            alt="logo"
          />
        ) : (
          <img
            src={`https://ordinalslite.com/content/${collection?.inscription_icon}`}
            className="rounded-md h-[60px] w-[60px]"
            alt="logo"
          />
        )}
      </td>
      <td className="py-2 text-sm sm:text-lg pl-1">{collection?.name}</td>
      <td className="py-2 hidden lg:flex items-center h-[68px]">
        <p> {collection?.description.slice(0, 30)}...</p>
      </td>
      <td className="py-2">
        {
          <div className="flex gap-2">
            <a
              className={`p-1.5 rounded-full main_btn ${
                !collection?.website_link && "bg-gray-600/80 cursor-not-allowed"
              }`}
              target="_blank"
              href={collection?.website_link}
              onClick={(e) => {
                e.stopPropagation();
                // Additional button event logic
              }}
            >
              <RiGlobalFill />
            </a>
            <a
              className={`p-1.5 rounded-full main_btn ${
                !collection?.twitter_link && "bg-gray-600/80 cursor-not-allowed"
              }`}
              target="_blank"
              href={collection?.twitter_link}
              onClick={(e) => {
                e.stopPropagation();
                // Additional button event logic
              }}
            >
              <FaTwitter />
            </a>
            <a
              className={`p-1.5 rounded-full main_btn ${
                !collection?.discord_link && "bg-gray-600/80 cursor-not-allowed"
              }`}
              target="_blank"
              href={collection?.discord_link}
              onClick={(e) => {
                e.stopPropagation();
                // Additional button event logic
              }}
            >
              <BsDiscord />
            </a>
          </div>
        }
      </td>
      <td className="py-2 hidden lg:flex items-center h-[68px]">
        <p>{collection?.supply} </p>
      </td>
    </tr>
  );
}
