import React, { useContext } from "react";
import WAValidator from "multicoin-address-validator";
import { useState } from "react";
import { useEffect } from "react";
import AddressCheck from "@/components/AddressCheck";
import { useAddress } from "../../store/hooks";

export default function ReceiveAddress({ onChange }) {
  const { address } = useAddress();
  const [receiveAddress, setReceiveAddress] = useState("");
  const [isValidAddress, setIsvalidAddress] = useState(false);
  const [loading, setLoading] = useState({
    address: false,
  });

  const checkAddress = () => {
    setIsvalidAddress(WAValidator.validate(receiveAddress, "litecoin"));
    setLoading({
      ...loading,
      address: false,
    });
  };

  useEffect(() => {
    if (receiveAddress) {
      setLoading({
        ...loading,
        address: true,
      });
      setIsvalidAddress(false);
      const delayDebounceFn = setTimeout(() => {
        checkAddress();
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiveAddress]);

  useEffect(() => {
    if (isValidAddress && receiveAddress) {
      onChange({
        address: receiveAddress,
        domain: receiveAddress,
      });
    }
  }, [isValidAddress]);

  useEffect(() => {
    if (address) {
      setReceiveAddress(address);
    }
  }, [address]);

  return (
    <>
      <p className="mt-2">Input Receive Address:</p>
      <div className="input-address">
        <input
          type="text"
          name="address"
          id="address"
          className="px-3 py-2 bg-transparent rounded-lg w-full focus:outline-none"
          placeholder="Provide the address to receive this inscription."
          value={receiveAddress}
          onChange={(e) => setReceiveAddress(e.target.value)}
        />
        <AddressCheck
          loading={loading}
          receiveAddress={receiveAddress}
          isValidAddress={isValidAddress}
        />
      </div>
    </>
  );
}
