import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/User";
import requestsSlice from "./requests/Requests";
import productsSlice from "./products/Products";
import chatSlice from "./chat/Chat";
import bookingSlice from "./booking/Booking";

export const combinedReducers = combineReducers({
  auth: authSlice.reducer,
  requests: requestsSlice.reducer,
  products: productsSlice.reducer,
  chat: chatSlice.reducer,
  bookings: bookingSlice.reducer,
});

const rootReducer = (state, action) => {
  return combinedReducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
