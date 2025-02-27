import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './orderSlice'; // Import reducer đơn hàng

const store = configureStore({
    reducer: {
        orders: ordersReducer, // Đăng ký reducer vào store
    },
});

export default store;