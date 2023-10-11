const { Events } = require('discord.js');
const { mongodb } = require('../config.json');
const mongoose = require('mongoose');


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute() {
		await mongoose.connect(mongodb || '', {
			keepAlive: true,
		});
		if (mongoose.connect) {
			console.log('Connected to MongoDB');
		}

		console.log('Guapo is ready to RUMBLE');
	},
};
