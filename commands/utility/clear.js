const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears a specific amount of messages')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.addIntegerOption((option) =>
			option
				.setName('number')
				.setDescription('Number of messages to delete')
				.setRequired(true),
		)
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('Target to clear their messages')
				.setRequired(false),
		),
	category: 'utility',
	async execute(interaction) {
		const { channel, options } = interaction;
		const amount = options.getInteger('number');
		const target = options.getUser('target');

		const messages = await channel.messages.fetch({
			limit: amount + 1,
		});
		const res = new EmbedBuilder().setColor(0x5fb041);
		if (target) {
			let i = 0;
			const filter = [];
			(await messages).filter((msg) => {
				if (msg.author.id === target && amount > i) {
					filter.push(msg);
					i++;
				}
			});
			await channel.bulkDelete(filter).then((message) => {
				res.setDescription(
					`Succesfully deleted ${message.size} messages from ${target}`,
				);
				interaction.reply({ embeds: [res], ephemeral: true });
			});
		}
		else {
			await channel.bulkDelete(amount, true).then((message) => {
				res.setDescription(
					`Succesfully deleted ${message.size} messages from the channel`,
				);
				interaction.reply({ embeds: [res], ephemeral: true });
			});
		}
	},
};