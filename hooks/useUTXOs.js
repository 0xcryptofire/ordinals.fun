import { useState } from "react";
import { useEffect } from "react";
import { useAddress } from "../store/hooks";
import { toast } from "react-hot-toast";
import { calculateFee, satoshisToBTC } from "@/utils";
import openApi from "@/services/openAPI";

export default function useUTXOs() {
  const dummyUtxoValue = 3000;
  const { address } = useAddress();
  const [utxos, setUtxos] = useState([]);
  const [sortedUtxos, setSortedUtxos] = useState([]);
  const [dummyUTXOs, setDummyUTXOs] = useState([]);

  async function doesUtxoContainInscription(utxo) {
    return utxo?.inscriptions?.length > 0;
  }

  async function selectUtxos(utxos, amount, vins, vouts, recommendedFeeRate) {
    const selectedUtxos = [];
    let selectedAmount = 0;

    for (const utxo of utxos) {
      // Never spend a utxo that contains an inscription for cardinal purposes
      if (await doesUtxoContainInscription(utxo)) {
        continue;
      }
      selectedUtxos.push(utxo);
      selectedAmount += utxo.satoshis;

      if (
        selectedAmount >=
        amount +
          dummyUtxoValue +
          calculateFee(vins + selectedUtxos.length, vouts, recommendedFeeRate)
      ) {
        break;
      }
    }

    if (selectedAmount < amount) {
      toast.error(`Not enough cardinal spendable funds.
            Address has:  ${satoshisToBTC(selectedAmount)} 
            Needed:          ${satoshisToBTC(amount)} 
            
            UTXOs:
            ${utxos.map((x) => `${x.txId}:${x.satoshis}`).join("\n")}`);
    }

    return selectedUtxos;
  }

  const getUTXOs = async (address) => {
    try {
      const res = await fetch(
        `https://litecoinspace.org/api/address/${address}/utxo`
      ).then((response) => response.json());
      const data = await openApi.getAddressUtxo(address);
      if (res?.length > 0 && data) {
        setUtxos(data);
        setSortedUtxos(data.sort((a, b) => b.satoshis - a.satoshis));
        setDummyUTXOs(res.filter((x) => x.value == dummyUtxoValue));
      }
    } catch (error) {
      //  console.log(error);
    }
  };

  useEffect(() => {
    if (address) {
      getUTXOs(address);
    }
  }, [address]);

  return {
    utxos,
    sortedUtxos,
    dummyUTXOs,
    selectUtxos: selectUtxos,
    refreshUTXOs: getUTXOs,
    doesUtxoContainInscription: doesUtxoContainInscription,
  };
}
