import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slice/authSlice';
import eventSlice from './slice/eventSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        event:eventSlice
    },
   
})
setupListeners(store.dispatch)



