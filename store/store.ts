import { configureStore, createSlice, PayloadAction, Action } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { userInfoReducer} from './userSlice'
import { balanceReducer } from "./balanceSlice";


// Combine the reducers
const rootReducer = combineReducers({
  userInfo: userInfoReducer,
  balance: balanceReducer
});

// Create the store
const store = configureStore({
  reducer: rootReducer,
});

// Export the store and its types
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
