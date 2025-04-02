import { createSlice } from '@reduxjs/toolkit';
const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    data: [],
  },
  reducers: {
    setOrders: (state, action) => {
      state.data = action.payload;
      console.log('data', state.data);
    },
    addOrder: (state, action) => {
      state.data.push(action.payload);
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;

      // Tìm vị trí của order trong mảng
      const index = state.data.findIndex((order) => order.id === id);
      // Nếu tìm thấy thì thay đổi trực tiếp
      if (index !== -1) {
        state.data[index].order_status = status;
      }
    },
  },
});
export const { updateStatus, setOrders, addOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
