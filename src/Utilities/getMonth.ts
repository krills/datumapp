import {Month} from "../type/Month";

export function getNext(month: Month): Month {
	return month.month === 11
		? getMonth(month.year + 1, 0)
		: getMonth(month.year, month.month + 1)
}

export function getPrevious(month: Month): Month {
	return month.month === 0
		? getMonth(month.year - 1, 11)
		: getMonth(month.year, month.month - 1)
}

export default function getMonth(year?: number, month?: number): Month {
	const currentDate = new Date();
	const givenYear = year ?? currentDate.getFullYear();
	const givenMonth = month ?? currentDate.getMonth();

	const rootDate = new Date(givenYear, givenMonth);
	rootDate.setDate(1);
	let firstWeekdayOfMonth = rootDate.getDay();
	if (firstWeekdayOfMonth === 0) {
		//Our calendar is monday-indexed, while date works with sunday-index
		firstWeekdayOfMonth = 7;
	}
	const januaryFirst = new Date(givenYear, 0, 1);
	let firstWeekNumberOfMonth = Math.ceil(Math.floor((rootDate.getTime() - januaryFirst.getTime()) / (24 * 60 * 60 * 1000)) / 7);
	if (firstWeekNumberOfMonth === 0) {
		//If 1st of january occurs in week 52
		firstWeekNumberOfMonth = 52;
	}

	if (givenMonth === 11) {
		rootDate.setFullYear(givenYear + 1, 0, 0);
	} else {
		rootDate.setFullYear(givenYear, givenMonth + 1, 0);
	}

	return {
		name: rootDate.toLocaleString('en-us',{month: 'long'}),
		year: givenYear,
		month: givenMonth,
		daysInMonth: rootDate.getDate(),
		firstWeekdayOfMonth: firstWeekdayOfMonth,
		firstWeekNumberOfMonth: firstWeekNumberOfMonth,
		currentDay: currentDate.getDate()
	};
}