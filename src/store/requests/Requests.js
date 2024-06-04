import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
    loading: false,
    error: undefined,
}

export const addMedicineRequest = createAsyncThunk(
    'requests/addmedicinerequest',
    async(inputs, {rejectWithValue}) => {
        try {
            const response = await api.post('medicinerequest/addusermedicinerequest', inputs)
            console.log(response.data)
            return response.data
        } catch (err) {
            console.log(err.response)
            return rejectWithValue(err.response)
        }
    }
)

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(addMedicineRequest.pending, state => {
            state.loading = true
        })
        builder.addCase(addMedicineRequest.fulfilled, state => {
            state.loading = false
        })
        builder.addCase(addMedicineRequest.rejected, state => {
            state.loading = false
        })
    }
})

export default requestsSlice;