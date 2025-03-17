import { createSlice } from '@reduxjs/toolkit';
const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        data: []
    },
    reducers: {
        setOrders: (state, action) => {
            state.data = action.payload;
            console.log("data", state.data);
        },
        addOrder: (state, action) => {
            state.data.push(action.payload);
        },
        updateStatus: (state, action) => {
            const { id, status } = action.payload;
            const order = state.data.find(order => order.id === id);
            order.order_status = status;
            console.log("update ", state.data);
        },
    }
});
export const { updateStatus, setOrders, addOrder } = ordersSlice.actions;

export default ordersSlice.reducer;