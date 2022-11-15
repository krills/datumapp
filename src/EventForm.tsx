import React, {useState, MouseEvent} from "react";
import style from './css/eventform.module.css';
import Calendar from "./Calendar";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "./Utilities/hooks";
import {resetSelection, selectToggledDays} from "./Store/calendarSlice";
import {thunkCreateEvent} from "./Store/eventSlice";

export default function EventForm() {
	const [titleValue, setTitleValue] = useState('title test');
	const [descriptionValue, setDescriptionValue] = useState('desc test');
	const selectedDays = useAppSelector(selectToggledDays);
	const dispatch = useAppDispatch();
	const [creatingEvent, setCreatingEvent] = useState(false);

	const verifyForm = async (e?: MouseEvent) => {
		e && e.preventDefault();

		let formWasValid = true;

		if (!descriptionValue.length) {
			alert('Please enter a description');
			formWasValid = false;
		}

		if (!selectedDays.length) {
			alert('Please select one or more date options');
			formWasValid = false;
		}

		if (formWasValid) {
			setCreatingEvent(true);
			try {
				const response = await dispatch(thunkCreateEvent({
					title: titleValue,
					description: descriptionValue,
					dateOptions: selectedDays
				}));
				console.log('create response',response)
				resetForm();
			} catch (e: any) {
				alert('Could not create event; ' + e.message);
				setCreatingEvent(false);
			}
		}
	}

	const resetForm = function() {
		setTitleValue('title 2');
		setDescriptionValue('test 2');
		setCreatingEvent(false);
		dispatch(resetSelection());
	}

	return (
		<div className={style.eventForm}>
			<h2>Create event</h2>
			<div className="mb-3">
				<label htmlFor="eventTitle" className="form-label">Event title</label>
				<input type="email" className="form-control" id="eventTitle"
				   	value={titleValue}
				   	onChange={e => setTitleValue(e.target.value)}
				   	placeholder="Optional event title"
					disabled={creatingEvent} />
			</div>

			<div className="mb-3">
				<label htmlFor="eventDescription" className="form-label">Description *</label>
				<textarea className="form-control" id="eventDescription" rows={3}
					value={descriptionValue}
					onChange={e => setDescriptionValue(e.target.value)}
					placeholder="Mandatory event description"
					disabled={creatingEvent} />
			</div>

			<Calendar header={'Date options'}/>

			<Button size={'lg'} variant={'success'} className={'mt-3'} onClick={e => verifyForm(e)} disabled={creatingEvent}>
				<FontAwesomeIcon icon={faPlusCircle} /> Create event
			</Button>
		</div>
	);
}