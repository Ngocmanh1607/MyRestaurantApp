import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
    name: 'orders',
    initialState: { // ✅ Định nghĩa state là object
        data: [
            { id: 1, name: "Đơn hàng 1", status: "new" },
            { id: 2, name: "Đơn hàng 2", status: "inProgress" },
            { id: 3, name: "Đơn hàng 3", status: "completed" }
        ]
    },
    reducers: {
        setOrders: (state, action) => {
            state.data = action.payload;
        },
        updateOrderStatus: (state, action) => {
            const { id, newStatus } = action.payload;
            const order = state.data.find(order => order.id === id);
            if (order) {
                order.status = newStatus;
            }
        },
        addOrder: (state, action) => {
            state.data.push(action.payload);
        },
        removeOrder: (state, action) => {
            state.data = state.data.filter(order => order.id !== action.payload);
        }
    }
});
// Xuất các action để dùng trong component
export const { updateOrderStatus, addOrder, removeOrder } = ordersSlice.actions;

export default ordersSlice.reducer;