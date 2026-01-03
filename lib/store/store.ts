import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import rideReducer from './slices/rideSlice';
import orderReducer from './slices/orderSlice';
import walletReducer from './slices/walletSlice';
import riderReducer from './slices/riderSlice';
import adminReducer from './slices/adminSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    rides: rideReducer,
    orders: orderReducer,
    wallets: walletReducer,
    riders: riderReducer,
    admins: adminReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;