import { configureStore } from "@reduxjs/toolkit";
import foodReducer from "./foodSlice";
import restaurantReducer from "./restaurantSlice";
const store = configureStore({
    reducer: {
        food: foodReducer,
        restaurant: restaurantReducer,
    }
})
export default store;