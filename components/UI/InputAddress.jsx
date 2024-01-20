import React, { useContext } from "react";
import WAValidator from "multicoin-address-validator";
import { useState } from "react";
import { useEffect } from "react";
import AddressCheck from "@/components/AddressCheck";
import { updateReceiveAddress } from "@/store/slices/inscribe";
import { useDispatch } from "react-redux";
import { WalletContext } from "../../context/wallet";

export default function InputAddress() {
  const dispatch = useDispatch();
  const wallet = useContext(WalletContext);
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
      dispatch(updateReceiveAddress(receiveAddress));
    } else {
      dispatch(updateReceiveAddress(""));
    }
  }, [isValidAddress]);

  useEffect(() => {
    const address = wallet.getAddress();
    setReceiveAddress(address);
  }, []);

  return (
    <>
      <p className="mt-3">Input the receive address:</p>
      <div className="mt-2 w-full cs-border rounded-md flex gap-2">
        <input
          type="text"
          name="address"
          id="address"
          className="px-3 py-2 bg-transparent rounded-lg w-full focus:outline-none"
          placeholder="Provide the address to receive the inscription(s). (Optional)"
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
