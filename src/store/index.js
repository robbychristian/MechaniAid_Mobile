import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/User";
import requestsSlice from "./requests/Requests";

export const combinedReducers = combineReducers({
  auth: authSlice.reducer,
  requests: requestsSlice.reducer,
});

const rootReducer = (state, action) => {
  return combinedReducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
