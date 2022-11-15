// We need to merge params to make userId available in our Items router
import express from 'express';
import EventController from "./../../controller/EventController.js";
//const express = require('express').Router({ mergeParams: true });
const router = express.Router();

router.route('/')
	.post((req, res) => {
		res.json(new EventController(req).createEvent(req.body));
	});

export default router;
