import React from "react";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleLeft, faChevronCircleRight} from "@fortawesome/free-solid-svg-icons";
import CalendarDay from "./CalendarDay";
import style from './css/calendar.module.css';
import {useAppDispatch, useAppSelector} from "./Utilities/hooks";
import {selectCurrentMonth, setMonth} from "./Store/calendarSlice";
import {getNext, getPrevious} from "./Utilities/getMonth";
import Day, {DayParams} from "./Model/Day";

export default function Calendar(params: {header?: string}) {
	const currentMonth = useAppSelector(selectCurrentMonth);
	const dispatch = useAppDispatch();
	const previousMonth = getPrevious(currentMonth);
	const nextMonth = getNext(currentMonth);
	let weekNumber = currentMonth.firstWeekNumberOfMonth;
	let days: Day[] = [];
	const today = new Date();
	const browsingFutureMonth = previousMonth.month >= today.getMonth() || previousMonth.year > today.getFullYear();

	for (let i = previousMonth.daysInMonth - currentMonth.firstWeekdayOfMonth + 2;
		 i <= previousMonth.daysInMonth; i++) {
		const dayParams: DayParams = {...previousMonth, ...{day: i, isDisabled: true}};
		if (!browsingFutureMonth) {
			dayParams.isToday = false;
		}
		days.push(Day.fromArray(dayParams, today));
	}
	for (let i = 1; i <= currentMonth.daysInMonth; i++) {
		const dayParams: DayParams = {...currentMonth, ...{
			day: i,
			isSelectable: (browsingFutureMonth || i >= currentMonth.currentDay),
			isDisabled: (!browsingFutureMonth && i < currentMonth.currentDay)
		}};
		if (browsingFutureMonth) {
			dayParams.isToday = false;
		}
		days.push(Day.fromArray(dayParams, today));
	}

	const rowsRequired = Math.ceil(days.length / 7);

	for (let i = 1, l = rowsRequired * 7 - days.length; i <= l; i++) {
		days.push(Day.fromArray({...previousMonth, ...{day: i, isDisabled: true, isToday: false}}));
	}

	return (
		<div className={style.calendar}>
			{params.header && <h3>{params.header}</h3>}
			<div className="row align-items-center">
				<div className="col">
					{browsingFutureMonth
						?
						<Button onClick={() => dispatch(setMonth(previousMonth))}>
							<FontAwesomeIcon icon={faChevronCircleLeft}/> {previousMonth.name}
						</Button>
						:
						<Button disabled={true}>
							<FontAwesomeIcon icon={faChevronCircleLeft}/> {previousMonth.name}
						</Button>
					}
				</div>
				<div className="col text-center">
					<h2>{currentMonth.name} {currentMonth.year}</h2>
				</div>
				<div className="col text-end">
					<Button onClick={() => dispatch(setMonth(nextMonth))}>
						{nextMonth.name} <FontAwesomeIcon icon={faChevronCircleRight} />
					</Button>
				</div>
			</div>
			<div className="row mt-3">
				{['', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
					.map((nameOfDay: string) => {
						return (
							<div className="col" key={'date-box-header-' + nameOfDay}>
								<span className="fs-5 text-muted">{nameOfDay}</span>
							</div>
						);
					})}
			</div>
			{[...Array(rowsRequired)].map((e, i) => {
				const lastRow = i === rowsRequired - 1;
				if (weekNumber === 53) {
					//reset weekNumber when we move to a new year
					weekNumber = 1;
				}
				return (
					<div className="row" key={i}>
						<div className="col text-end">
							<span className="text-muted fs-5">{weekNumber++}</span>
						</div>
						{[...Array(7)].map((ex, l) => {
							const day = days[i * 7 + l];
							return <CalendarDay
								key={day.id}
								day={day}
								lastRow={lastRow}
							/>
						})}
					</div>
				);
			})}
		</div>
	);
}