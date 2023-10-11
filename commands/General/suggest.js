const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Create a suggestion')
		.addStringOption((option) =>
			option
				.setName('sugesstion')
				.setDescription('What is your suggestion?')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('description')
				.setDescription('Describe your suggestion')
				.setRequired(true),
		),
	category: 'General',
	async execute(interaction) {
		const { guild, options, member } = interaction;
		const name = options.getString('sugesstion');
		const description = options.getString('description');


		const embed = new EmbedBuilder()
			.setColor('Green')
			.setDescription(`A suggestion made by ${member}`)
			.addFields(
				{ name: 'Suggestion', value: `${name}` },
				{ name: 'Description', value: `${description}` })
			.setFooter({ text: member.user.tag, iconURL: member.displayAvatarURL({ dynamic: true }) });
		await guild.channels.cache
			.get(interaction.channelId)
			.send({ embeds: [embed] })
			.then((s) => {
				s.react('✅');
				s.react('❌');
			})
			.catch((error) => {
				throw error;
			});

		interaction.reply({ content: ':white_check_mark: | Your sugesstion has been posted.', ephemeral: true });
	},
};