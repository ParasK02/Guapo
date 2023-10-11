const { SlashCommandBuilder } = require('discord.js');
const {commands} = require ('../../deploy-commands');

const data = new SlashCommandBuilder().setName('help').setDescription('Shows all commands!');
const execute = async (interaction) =>{
	await interaction.reply(commands[0].description);
}
module.exports = {
	data,
	category: 'utility',
	execute,
};
