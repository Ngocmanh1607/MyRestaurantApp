import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";
//action call api lấy dữ liệu nhà hàng
export const fetchRestaurantData = createAsyncThunk('restaurant/fetchRestaurantData',
    async () => {
        const response = await apiClient.get('/restaurantData');
        return response.data;
    }
)
const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState: {
        restaurantInfo: null,
        menuItems: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurantData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRestaurantData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.restaurantInfo = action.payload.restaurantInfo;
                state.menuItems = action.payload.menuItems;
            })
            .addCase(fetchRestaurantData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
})

export default restaurantSlice.reducer;