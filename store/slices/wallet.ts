import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    booted: undefined,
    isUnlocked: false,
    keyrings: {},
    vault: {},
    preVault: {},
    account: {},
    balance: {
      amount: 0.0,
      btc_amount: 0.0,
      confirm_amount: 0.0,
      confirm_btc_amount: "0.000",
      confirm_inscription_amount: 0,
      inscription_amount: 0,
      pending_amount: 0,
      pending_btc_amount: "0.00",
      pending_inscription_amount: 0,
      usd_value: 0,
    },
    bitcoinTx: {
      txId: "",
      toAddress: "",
      toSatoshis: "",
      autoAdjust: "",
      feeRate: "",
    },
    inscriptions: {
      total: 0,
      list: [],
    },
    price: 71
  },
};

export const wallet = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    booted: (state, action) => {
      state.value.booted = action.payload;
    },
    isUnlocked: (state, action) => {
      state.value.isUnlocked = action.payload;
    },
    vault: (state, action) => {
      state.value.vault = action.payload;
    },
    preVault: (state, action) => {
      state.value.preVault = action.payload;
    },
    account: (state, action) => {
      state.value.account = action.payload;
    },
    balance: (state, action) => {
      state.value.balance = action.payload;
    },
    bitcoinTx: (state, action) => {
      state.value.bitcoinTx = action.payload;
    },
    setCurrentKeyRing: (state, action) => {
      state.value.keyrings = action.payload;
    },
    updateBitcoinTx: (state, action) => {
      state.value.bitcoinTx.txId = action.payload;
    },
    updateInscriptions: (state, action) => {
      state.value.inscriptions = action.payload;
    },
    updatePrice: (state, action) => {
      state.value.price = action.payload;
    },
  },
});

export const {
  booted,
  isUnlocked,
  vault,
  preVault,
  account,
  balance,
  bitcoinTx,
  setCurrentKeyRing,
  updateBitcoinTx,
  updateInscriptions,
  updatePrice
} = wallet.actions;
export default wallet.reducer;
