import React from "react";
import style from './css/calendarDay.module.css';
import Day from "./Model/Day";
import {selectToggledDays, toggleDay} from "./Store/calendarSlice";
import {useAppDispatch, useAppSelector} from "./Utilities/hooks";

export default function CalendarDay(props: {day: Day, lastRow: boolean}) {
	const selectedDays = useAppSelector(selectToggledDays);
	const dispatch = useAppDispatch();
	const isSelected = selectedDays.indexOf(props.day.id) > -1;
	return (
		<div className={[
			'col', style.day,
			isSelected ? style.daySelected : '',
			props.day.isToday ? style.dayToday : '',
			props.day.isDisabled ? style.dayDisabled : '',
			props.day.isSelectable ? style.daySelectable : '',
			props.lastRow ? style.dayLastRow : ''
		].join(' ')}
			onClick={() => props.day.isSelectable ? dispatch(toggleDay(props.day.id)) : null}
		>
			<span>{props.day.day}</span>
		</div>
	)
}