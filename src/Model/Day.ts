export type DayParams = {
	id?: string;
	year: number;
	month: number;
	day: number;
	isDisabled?: boolean;
	isToday?: boolean;
	isSelectable?: boolean;
	isSelected?: boolean;
};

export default class Day {
	id!: string;
	year!: number;
	month!: number;
	day!: number;
	isToday!: boolean;
	isDisabled: boolean = false;
	isSelected: boolean = false;
	isSelectable: boolean = false;

	static fromArray(params: DayParams, today?: Date): Day
	{
		let day = new this();
		day.id = [params.year, params.month, params.day].join('-');
		for (const param in params) {
			// @ts-ignore
			day[param] = params[param];
		}

		if (params.isToday === undefined) {
			today = today ?? new Date();
			day.isToday = today.getFullYear() === day.year
				&& today.getMonth() === day.month
				&& today.getDate() === day.day;
		}

		return day;
	}
}