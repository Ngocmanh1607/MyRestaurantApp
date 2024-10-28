// foodSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFoodFromApi, createFoodInApi, updateFoodInApi } from '../api/foodApi';

// Thunk để tạo mới món ăn
export const createFood = createAsyncThunk('food/createFood', async (newFood) => {
    const data = await createFoodInApi(newFood);
    return data;
});

// Thunk để cập nhật món ăn
export const updateFood = createAsyncThunk('food/updateFood', async ({ id, updatedFood }) => {
    const data = await updateFoodInApi(id, updatedFood);
    return data;
});

// Giữ nguyên phần fetchFoods
export const fetchFoods = createAsyncThunk('food/fetchFoods', async () => {
    const data = await fetchFoodFromApi();
    return data;
});


const foodSlice = createSlice({
    name: 'food',
    initialState: {
        foods: [],
        status: 'idle', // trạng thái: 'idle', 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state) => {
                state.status = 'loading'; // Khi đang gửi request
            })
            .addCase(fetchFoods.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Khi đã nhận được dữ liệu thành công
                state.foods = action.payload; // Lưu dữ liệu vào state
            })
            .addCase(fetchFoods.rejected, (state, action) => {
                state.status = 'failed'; // Khi xảy ra lỗi
                state.error = action.error.message; // Lưu thông báo lỗi
            })
            // Create food
            .addCase(createFood.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createFood.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.foods.push(action.payload); // Thêm món ăn mới vào danh sách
            })
            .addCase(createFood.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // Update food
            .addCase(updateFood.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateFood.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.foods.findIndex(food => food.id === action.payload.id);
                if (index !== -1) {
                    state.foods[index] = action.payload; // Cập nhật món ăn trong danh sách
                }
            })
            .addCase(updateFood.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default foodSlice.reducer;
