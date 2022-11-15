import {AnyAction, createSlice, PayloadAction, ThunkAction} from '@reduxjs/toolkit'
import {RootState} from "./store";
import api from "../Api/api";
import {DatumEvent} from "../../shared/type/Event";

export type EventState = {
	events: DatumEvent[];
}

const initialState: EventState = {
	events: []
}

export const eventSlice = createSlice({
	name: 'events',
	initialState,
	reducers: {
		addEvent: (state, action: PayloadAction<DatumEvent>) => {
			state.events = [...state.events, action.payload];
		}
	},
})

export const { addEvent } = eventSlice.actions;

export const selectEvents = (state: RootState) => state.events.events;

export const thunkCreateEvent = (event: DatumEvent): ThunkAction<void, RootState, unknown, AnyAction> => {

	/**
	 * export type ThunkAction<
	 *   R, // Return type of the thunk function
	 *   S, // state type used by getState
	 *   E, // any "extra argument" injected into the thunk
	 *   A extends Action // known types of actions that can be dispatched
	 * > = (dispatch: ThunkDispatch<S, E, A>, getState: () => S, extraArgument: E) => R
	 *
	 * export const thunkSendMessage =
	 *   (message: string): ThunkAction<void, RootState, unknown, AnyAction> =>
	 *   async dispatch => {
	 *     const asyncResp = await exampleAPI()
	 *     dispatch(
	 *       sendMessage({
	 *         message,
	 *         user: asyncResp,
	 *         timestamp: new Date().getTime()
	 *       })
	 *     )
	 *   }
	 */
	return async (dispatch, getState: () => RootState) => {
		const response = await api.events.createEvent(event);
		dispatch(addEvent(response))
	}
}


export default eventSlice.reducer;
