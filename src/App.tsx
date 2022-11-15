import React from 'react';
import './css/main.css';
import EventForm from "./EventForm";

function App() {
	return (
		<div className="container">
			<header className="row">
				<div className="col">
					<h1>Datum App</h1>
				</div>
			</header>
			<main className="row">
				<div className="col">
					<EventForm />
				</div>
			</main>
		</div>
	);
}

export default App;
