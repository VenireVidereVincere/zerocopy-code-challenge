import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type balanceState = {
    balance:string
}

const initialState: balanceState = {
    balance: ""
};

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setBalance: (state, action: PayloadAction<balanceState>) => {
        state.balance = action.payload.balance
    }
    }
  }
);


export const { setBalance } = balanceSlice.actions;

export const { reducer: balanceReducer } = balanceSlice;
