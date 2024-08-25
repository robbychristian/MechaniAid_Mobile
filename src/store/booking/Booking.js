import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  loading: false,
  bookingList: [],
  booking: undefined,
  error: undefined,
  favoriteMechanic: [],
  favoriteBookings: [],
};

export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`getuserbookings?user_id=${id}`);
      const sortedData = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      await dispatch(getAllFavoriteMechanic(id));
      return sortedData;
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const getMechanicBookings = createAsyncThunk(
  "booking/getMechanicBookings",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`getmechanicbookings?mechanics_id=${id}`);
      const sortedData = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      return sortedData;
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const toggleFavoriteMechanic = createAsyncThunk(
  "booking/toggleFavoriteMechanic",
  async (inputs, { rejectWithValue, dispatch }) => {
    const { user_id } = inputs;
    console.log("userid favorite", user_id);
    try {
      await api.post("/favorite-mechanic", inputs);
      await dispatch(getUserBookings(user_id));
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const unfavoriteMechanic = createAsyncThunk(
  "booking/unfavoriteMechanic",
  async (inputs, { rejectWithValue, dispatch }) => {
    const { user_id } = inputs;
    console.log("userid unfavorite", user_id);

    try {
      await api.post("remove-favorite-mechanic", inputs);
      // return response.data
      await dispatch(getUserBookings(user_id));
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const getAllFavoriteMechanic = createAsyncThunk(
  "booking/getAllFavoriteMechanic",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`getAllFavoriteMechanic?user_id=${id}`);
      return response.data;
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const getBookingsByFavoriteMechanic = createAsyncThunk(
  "booking/getBookingsByFavoriteMechanic",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `getBookingsByFavoriteMechanic?user_id=${id}`
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      return sortedData;
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const getBookingsById = createAsyncThunk(
  "booking/getBookingsById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`getBookingsById/${id}`);

      return response.data.booking_details;
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.booking = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserBookings.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.bookingList = payload;
    });
    builder.addCase(getUserBookings.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getMechanicBookings.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMechanicBookings.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.bookingList = payload;
    });
    builder.addCase(getMechanicBookings.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(toggleFavoriteMechanic.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(toggleFavoriteMechanic.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(toggleFavoriteMechanic.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(unfavoriteMechanic.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(unfavoriteMechanic.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(unfavoriteMechanic.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getAllFavoriteMechanic.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllFavoriteMechanic.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.favoriteMechanic = payload;
    });
    builder.addCase(getAllFavoriteMechanic.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getBookingsByFavoriteMechanic.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getBookingsByFavoriteMechanic.fulfilled,
      (state, { payload }) => {
        state.loading = false;
        state.favoriteBookings = payload;
      }
    );
    builder.addCase(
      getBookingsByFavoriteMechanic.rejected,
      (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      }
    );
    builder.addCase(getBookingsById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBookingsById.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.booking = payload;
    });
    builder.addCase(getBookingsById.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { clearBooking } = bookingSlice.actions;

export default bookingSlice;
