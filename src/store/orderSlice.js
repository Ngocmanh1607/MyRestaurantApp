// src/store/orderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
    },
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
            console.log(state.orders);
        },
        updateOrderStatus: (state, action) => {
            const { id, newStatus } = action.payload;
            const order = state.orders.find(order => order.id === id);
            if (order) {
                order.order_status = newStatus;
            }
        },
    },
});

export const { setOrders, updateOrderStatus } = orderSlice.actions;

export default orderSlice.reducer;