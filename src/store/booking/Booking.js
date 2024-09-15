import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
  loading: false,
  bookingList: [],
  booking: undefined,
  error: undefined,
  favoriteMechanic: [],
  favoriteBookings: [],
  rebookingList: [],
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

export const rebooking = createAsyncThunk(
  "booking/rebook",
  async (inputs, { rejectWithValue, dispatch }) => {
    const { booking_id } = inputs;
    try {
      await api.post("rebook", inputs);
      return response.data;
    } catch (err) {
      console.log(err.response);
      return rejectWithValue(err.response);
    }
  }
);

export const getAllUsersRebook = createAsyncThunk(
  "booking/getAllUsersRebook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`getAllUsersRebook?user_id=${id}`);
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

export const getAllMechanicsRebook = createAsyncThunk(
  "booking/getAllMechanicsRebook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `getAllMechanicsRebook?mechanics_id=${id}`
      );
      const sortedData = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      return sortedData;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        return rejectWithValue(err.response.data.errors);
    }
    return rejectWithValue({ general: "There was an error in getallmechanicsrebook" });
    }
  }
);

export const declineRebook = createAsyncThunk(
  "booking/declineRebook",
  async (inputs, { rejectWithValue, dispatch }) => {
    const { mechanics_id } = inputs;
    console.log("declined by", mechanics_id);

    try {
      await api.post("declineRebook", inputs);
      await dispatch(getAllMechanicsRebook(mechanics_id));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        return rejectWithValue(err.response.data.errors);
    }
    return rejectWithValue({ general: "There was an error in declinerebook" });
    }
  }
);

export const acceptRebook = createAsyncThunk(
  "booking/acceptRebook",
  async (inputs, { rejectWithValue, dispatch }) => {
    const { mechanics_id } = inputs;

    try {
      await api.post("acceptRebook", inputs);
      await dispatch(getAllMechanicsRebook(mechanics_id));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        return rejectWithValue(err.response.data.errors);
    }
    return rejectWithValue({ general: "There was an error in acceptrebook" });
    }
  }
);

export const completedRebook = createAsyncThunk(
  "booking/completedRebook",
  async (inputs, { rejectWithValue, dispatch }) => {
    const { mechanics_id } = inputs;

    try {
      await api.post("completedRebook", inputs);
      await dispatch(getAllMechanicsRebook(mechanics_id));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        return rejectWithValue(err.response.data.errors);
    }
    return rejectWithValue({ general: "There was an error in completedrebook" });
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
    builder.addCase(rebooking.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(rebooking.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(rebooking.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getAllUsersRebook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUsersRebook.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.rebookingList = payload;
    });
    builder.addCase(getAllUsersRebook.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(getAllMechanicsRebook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllMechanicsRebook.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.rebookingList = payload;
    });
    builder.addCase(getAllMechanicsRebook.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(declineRebook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(declineRebook.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(declineRebook.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(acceptRebook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(acceptRebook.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(acceptRebook.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
    builder.addCase(completedRebook.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(completedRebook.fulfilled, (state, { payload }) => {
      state.loading = false;
    });
    builder.addCase(completedRebook.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { clearBooking } = bookingSlice.actions;

export default bookingSlice;
