import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserDetails } from "../types/User";


// Define the type for the userInfo state
interface UserInfoState {
    user: {    
        name?: {
          first: string,
          last: string
        };
        email?: string;
        address?: string;
        picture?: string;
        age?: number;
        phone?: string;}
}

const initialState: UserInfoState = {
    user: {}
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<UserDetails | {}>) => {
        state.user = action.payload
    },
    updateUserDetails: (state, action: PayloadAction<any>) => {
        state.user = {
          ...state.user,
          ...action.payload
        }
    } 
  }
});


export const { setUserDetails, updateUserDetails } = userInfoSlice.actions;

export const { reducer: userInfoReducer } = userInfoSlice;
