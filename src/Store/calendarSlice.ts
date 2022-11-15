import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import getMonth from "../Utilities/getMonth";
import {RootState} from "./store";
import {Month} from "../type/Month";

export type CalendarState = {
	month: Month;
	selectedDayIds: string[];
}

const initialState: CalendarState = {
	month: getMonth(),
	selectedDayIds: []
}

export const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		setMonth: (state, action: PayloadAction<Month>) => {
			state.month = action.payload;
		},
		toggleDay: (state, action: PayloadAction<string>) => {
			let cloneWithoutDay = state.selectedDayIds.filter(dayId => dayId !== action.payload);
			if (state.selectedDayIds.length === cloneWithoutDay.length) {
				// Same length, day wasn't in array
				cloneWithoutDay.push(action.payload);
			}
			state.selectedDayIds = cloneWithoutDay;
		},
		resetSelection: state => {
			state.selectedDayIds = [];
		}
	},
})

export const { setMonth, toggleDay, resetSelection } = calendarSlice.actions;

export const selectCurrentMonth = (state: RootState) => state.calendar.month;
export const selectToggledDays = (state: RootState) => state.calendar.selectedDayIds;

export default calendarSlice.reducer;
