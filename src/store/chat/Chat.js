import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../config/api";

const initialState = {
    loading: false,
    chatList: [],
    chatMessages: undefined,
    error: undefined
}

export const getChatList = createAsyncThunk(
    'chat/getchatlist',
    async(id, {rejectWithValue}) => {
        try {
            const response = await api.get(`getchatlist/${id}`)
            console.log(response.data)
            return response.data
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                return rejectWithValue(err.response.data.errors);
            }
            return rejectWithValue({ general: "There was an error in getchatlist" });
        }
    }
)

export const getChat = createAsyncThunk(
    'chat/getchat',
    async(input, {rejectWithValue}) => {
        const {user_id, mechanics_id,} = input
        try {
            const response = await api.get(`getchat/${user_id}/${mechanics_id}`)
            return response.data
        } catch (err) {
            if (err.response && err.response.data && err.response.data.errors) {
                return rejectWithValue(err.response.data.errors);
            }
            return rejectWithValue({ general: "There was an error in getchat" });
        }
    }
)

export const sendMessage = createAsyncThunk(
    'chat/sendmessage',
    async(inputs, {rejectWithValue}) => {
        try {
            const response = await api.post('sendmessage', inputs)
            return response.data
        } catch(err) {
            if (err.response && err.response.data && err.response.data.errors) {
                return rejectWithValue(err.response.data.errors);
            }
            return rejectWithValue({ general: "There was an error in chat" });
        }
    }
)

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChatList: (state) => {
            state.chatList = []
        },
        clearChatMessages: (state) => {
            state.chatMessages = []
        }
    },
    extraReducers: builder => {
        builder.addCase(getChatList.pending, state => {
            state.loading = true
        })
        builder.addCase(getChatList.fulfilled, (state, {payload}) => {
            state.loading = false
            state.chatList = payload
        })
        builder.addCase(getChatList.rejected, (state, {payload}) => {
            state.loading = false
            state.chatList = payload
        })
        builder.addCase(getChat.pending, state => {
        })
        builder.addCase(getChat.fulfilled, (state, {payload}) => {
            state.loading = false
            state.chatMessages = payload
        })
        builder.addCase(getChat.rejected, (state, {payload}) => {
            state.loading = false
            state.chatMessages = payload
        })
        builder.addCase(sendMessage.pending, state => {
            state.loading = true
        })
        builder.addCase(sendMessage.fulfilled, (state, {payload}) => {
            state.loading = false
            state.chatMessages = payload
        })
        builder.addCase(sendMessage.rejected, (state, {payload}) => {
            state.loading = false
            state.chatMessages = payload
        })
    }
})

export const {clearChatList, clearChatMessages} = chatSlice.actions

export default chatSlice;