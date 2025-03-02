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
        updateOrderStatus: (state, action) => {
            const { id, status } = action.payload;
            const order = state.data.find(order => order.id === id);
            if (order) {
                order.status = status;
            }
        },
    }
});
// Xuất các action để dùng trong component
export const { updateOrderStatus, setOrders } = ordersSlice.actions;

export default ordersSlice.reducer;