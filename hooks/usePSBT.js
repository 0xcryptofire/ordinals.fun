import { Psbt } from "bitcoinjs-lib";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import * as bitcoin from "bitcoinjs-lib";

export default function usePSBT({ network, sellerSignedPsbtBase64 }) {
  const [psbt, setPsbt] = useState();

  const networks = {
    litecoin: {
      messagePrefix: "\x19Litecoin Signed Message:\n",
      bech32: "ltc",
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0,
    },
  };

  useEffect(() => {
    setPsbt(
      new Psbt({
        network: networks[network],
      })
    );
  }, [network]);

  const sellerSignedPsbt = useCallback(() => {
    const psbt = bitcoin.Psbt.fromBase64(sellerSignedPsbtBase64, {
      network: networks[network],
    });
    return psbt;
  }, [network, sellerSignedPsbtBase64]);

  return { psbt: psbt, signedPsbt: sellerSignedPsbt, networks };
}
