const { EmbedBuilder } = require('discord.js');
const { Events } = require('discord.js');
const Level = require('../models/Level');
const calculateLevelXp = require('../utils/calculateLevelXp');
const cooldowns = new Set();

/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (!message.guild || message.author.bot || cooldowns.has(message.author.id)) return;

		if (message.content.length < 3) return;

		const randomAmountOfXP = Math.floor(Math.random() * 29) + 1; // max: 30 min: 1
		const query = {
			userId: message.author.id,
			guildId: message.guild.id,
		};
		try {
			const level = await Level.findOne(query);
			if (level) {
				level.xp += randomAmountOfXP;

				if (level.xp > calculateLevelXp(level.level)) {
					level.xp = 0;
					level.level += 1;
					const levelEmbed = new EmbedBuilder()
						.setTitle('New Level!')
						.setDescription(
							`**WOO HOO** ${message.author}, you just leveled up to level **${level.level}**`)
						.setTimestamp()
						.setColor('Random')
						.setThumbnail(
							'https://media.gq.com/photos/6515bae3ce56f476f6886228/16:9/pass/81156287',
						);
					const sendEmbed = await message.channel.send({
						embeds: [levelEmbed],
					});

					sendEmbed.react('😜');
				}
				await level.save().catch((e) => {
					console.log(`Error Saving updated level ${e}`);
					return;
				});
				cooldowns.add(message.author.id);
				setTimeout(() => {
					cooldowns.delete(message.author.id);
				}, 10000);
			// if the level does not exist
			}
			else {
			// create new level
				const newLevel = new Level({
					userId: message.author.id,
					guildId: message.guild.id,
					xp: randomAmountOfXP,

				});
				await newLevel.save();
				cooldowns.add(message.author.id);
				setTimeout(() => {
					cooldowns.delete(message.author.id);
				}, 10000);
			}
		}
		catch (error) {
			console.log(error);
		}

	},
};