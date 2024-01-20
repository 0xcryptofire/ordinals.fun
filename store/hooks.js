import { onValue, query, ref, orderByChild } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "@/services/firebase";
import { setMintedBlocks } from "@/store/slices/blocks";
import {
  setBulkMintBlocks,
  updateLastBlock,
  updateMintedBlockNumber,
} from "@/store/slices/inscribe";

export const useBlocks = () => {
  return useSelector((state) => state?.persistedReducer?.blocksReducer?.value);
};

export const useInscribe = () => {
  return useSelector(
    (state) => state?.persistedReducer?.inscribeReducer?.value
  );
};

export const useOpenApi = () => {
  return useSelector((state) => state?.persistedReducer?.openAPIReducer?.value);
};

export const useWallet = () => {
  return useSelector((state) => state?.persistedReducer?.walletReducer?.value);
};

export const useThemeStore = () => {
  return useSelector((state) => state?.persistedReducer?.themeReducer?.value);
};

export const useAddress = () => {
  const wallet = useSelector(
    (state) => state?.persistedReducer?.walletReducer?.value
  );
  try {
    return { address: wallet?.account?.accounts[0]?.address };
  } catch (error) {
    return { address: "" };
  }
};

export const useMintedBlocks = () => {
  const dispatch = useDispatch();
  const { mintedBlocks } = useBlocks();
  const { selectedBlock } = useInscribe();

  const binarySearch = (target) => {
    let left = 0;
    let right = mintedBlocks.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (mintedBlocks[mid].blockNumber === target) {
        return false; // Block number found
      }

      if (mintedBlocks[mid].blockNumber < target) {
        left = mid + 1; // Continue searching in the right half
      } else {
        right = mid - 1; // Continue searching in the left half
      }
    }

    return true; // Block number not found
  };

  useEffect(() => {
    const dbQuery = query(ref(db, "mintedBlocks"), orderByChild("blockNumber"));

    onValue(dbQuery, async (snapshot) => {
      const exist = snapshot.val();
      if (exist) {
        const newMintedBlocks = Object.values(exist);
        const sortedBlocks = newMintedBlocks.sort(
          (a, b) => a.blockNumber - b.blockNumber
        );

        const differ = sortedBlocks.length - mintedBlocks.length;
        if (differ > 0) {
          dispatch(setMintedBlocks(sortedBlocks));
        }
      }
    });
  }, [dispatch]);

  useEffect(() => {
    if (mintedBlocks.length > 0) {
      const refreshBlocks = selectedBlock.filter((block) =>
        binarySearch(block.blockNumber)
      );
      dispatch(setBulkMintBlocks(refreshBlocks));
    }
  }, [mintedBlocks]);
};

export const useLastBlock = () => {
  const dispatch = useDispatch();
  const { lastBlock } = useInscribe();

  const fetchLastBlock = async () => {
    try {
      const data = await fetch(
        "/chainz/explorer/index.data.dws?coin=ltc&v=1&n=1"
      );
      const jsonData = await data.json();
      dispatch(updateLastBlock(jsonData?.blocks[0].height));
      setLastBlock(jsonData?.blocks[0].height);
    } catch (error) {}
  };

  useEffect(() => {
    fetchLastBlock();
  }, [dispatch]);

  return { lastBlock: lastBlock };
};

export const useMintedBlocksFromAPI = () => {
  const dispatch = useDispatch();
  const { mintedBlockNumber } = useInscribe();

  useEffect(() => {
    async function searchBlocks() {
      try {
        const res = await fetch("/searchInscription/text?text=.litemap");
        const resJson = await res.json();
        if (resJson?.totalItems > 0) {
          dispatch(updateMintedBlockNumber(resJson?.totalItems));
        }
      } catch (error) {
        //  console.log(error);
      }
    }

    searchBlocks();
  }, []);

  return { mintedBlockNumber: mintedBlockNumber };
};
