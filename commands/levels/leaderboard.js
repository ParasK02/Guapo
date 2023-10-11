const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require('discord.js');
const Level = require('../../models/Level');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Display the current XP leaderboard'),
	category: 'levels',
	/**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const allLevels = await Level.find({ guildId: interaction.guildId }).select(
			'-_id userId level xp',
		);
		allLevels.sort((a, b) => {
			if (a.level === b.level) {
				return b.xp - a.xp;
			}
			else {
				return b.level - a.level;
			}
		});

		const embed = new EmbedBuilder();

		const result = await Promise.all(allLevels.map(async (rank, index) => {
			const user = await interaction.guild.members.fetch(rank.userId);
			return `${index + 1}.       **${user.user.username}**`;
		}));

		embed.setTitle(`Leaderboard for ${interaction.guild}`).setDescription(result.join('\n\n')).setTimestamp().setColor('DarkPurple');

		return interaction.reply({ embeds: [embed] });
	},
};
