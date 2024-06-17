import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
    loading: false,
    product: undefined,
    productList: [],
    error: undefined
}

export const getAllProducts = createAsyncThunk(
    'products/getallproducts',
    async(id, {rejectWithValue}) => {
        try {
            const response = await api.get("getAllProducts")
            return response.data.product_details
        } catch (err) {
            console.log(err.response)
            return rejectWithValue(err.response)
        }
    }
)

export const getAllMechanicProducts = createAsyncThunk(
    'products/getallmechanicproducts',
    async(id, {rejectWithValue}) => {
        try {
            const response = await api.get(`getAllMechanicProducts/${id}`)
            return response.data.product_details
        } catch (err) {
            console.log(err.response)
            return rejectWithValue(err.response)
        }
    }
)

export const getProduct = createAsyncThunk(
    'products/getproduct',
    async(id, {rejectWithValue}) => {
        try {
            const response = await api.get(`getProductsById/${id}`)
            console.log(response.data.product_details.product_image)
            return response.data.product_details
        } catch (err) {
            console.log(err.response)
            return rejectWithValue(err.response)
        }
    }
)

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearProduct: (state) => {
            state.product = undefined
        }
    },
    extraReducers: builder => {
        builder.addCase(getAllProducts.pending, state => {
            state.loading = true
        })
        builder.addCase(getAllProducts.fulfilled, (state, {payload}) => {
            state.loading = false
            state.productList = payload
        })
        builder.addCase(getAllProducts.rejected, (state, {payload}) => {
            state.loading = false
            state.error = payload
        })
        builder.addCase(getAllMechanicProducts.pending, state => {
            state.loading = true
        })
        builder.addCase(getAllMechanicProducts.fulfilled, (state, {payload}) => {
            state.loading = false
            state.productList = payload
        })
        builder.addCase(getAllMechanicProducts.rejected, (state, {payload}) => {
            state.loading = false
            state.error = payload
        })
        builder.addCase(getProduct.pending, state => {
            state.loading = true
        })
        builder.addCase(getProduct.fulfilled, (state, {payload}) => {
            state.loading = false
            state.product = payload
        })
        builder.addCase(getProduct.rejected, (state, {payload}) => {
            state.loading = false
            state.error = payload
        })
    }
})

export const {clearProduct} = productsSlice.actions

export default productsSlice