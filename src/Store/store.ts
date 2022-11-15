import { configureStore } from '@reduxjs/toolkit';
import calendarReducer from './calendarSlice';
import eventReducer from './eventSlice';

export const store = configureStore({
	reducer: {
		calendar: calendarReducer,
		events: eventReducer
	},
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch