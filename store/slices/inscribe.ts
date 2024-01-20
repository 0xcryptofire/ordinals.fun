import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    selectedBlock: [],
    inscription: [],
    fee: {},
    feeRate: 1,
    receiveAddress: "",
    confirmed1: false,
    confirmed2: false,
    confirmed3: false,
    confirmed4: false,
    lastBlock: 2609098,
    mintedBlockNumber: 1943390,
  },
};

export const wallet = createSlice({
  name: "wallet",
  initialState: initialState,
  reducers: {
    selectedBlock: (state, action) => {
      state.value.selectedBlock.push(action.payload);
    },
    cancelBlock: (state, action) => {
      state.value.selectedBlock = state.value.selectedBlock.filter(
        (block) => block.blockNumber !== action.payload
      );
    },
    initialize: (state, action) => {
      state.value.selectedBlock = [];
    },
    setBulkMintBlocks: (state, action) => {
      state.value.selectedBlock = action.payload;
    },
    updateFee: (state, action) => {
      state.value.fee = action.payload;
    },
    updateFeeRate: (state, action) => {
      state.value.feeRate = action.payload;
    },
    updateReceiveAddress: (state, action) => {
      state.value.receiveAddress = action.payload;
    },
    updateConfirmed1: (state, action) => {
      state.value.confirmed1 = action.payload;
    },
    updateConfirmed2: (state, action) => {
      state.value.confirmed2 = action.payload;
    },
    updateConfirmed3: (state, action) => {
      state.value.confirmed3 = action.payload;
    },
    updateConfirmed4: (state, action) => {
      state.value.confirmed4 = action.payload;
    },
    clearConfirms: (state, action) => {
      state.value.confirmed1 = false;
      state.value.confirmed2 = false;
      state.value.confirmed3 = false;
      state.value.confirmed4 = false;
      state.value.receiveAddress = "";
    },
    updateLastBlock: (state, action) => {
      state.value.lastBlock = action.payload;
    },
    updateMintedBlockNumber: (state, action) => {
      state.value.mintedBlockNumber = action.payload;
    },
  },
});

export const {
  selectedBlock,
  cancelBlock,
  initialize,
  setBulkMintBlocks,
  updateFee,
  updateFeeRate,
  updateReceiveAddress,
  updateConfirmed1,
  updateConfirmed2,
  updateConfirmed3,
  updateConfirmed4,
  clearConfirms,
  updateLastBlock,
  updateMintedBlockNumber,
} = wallet.actions;
export default wallet.reducer;
