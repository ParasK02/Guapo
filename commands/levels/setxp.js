const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Level = require('../../models/Level');
const calculateLevelXp = require('../../utils/calculateLevelXp');
calculateLevelXp;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setxp')
		.setDescription('Set a user\'s XP')
		.addUserOption((option) =>
			option.setName('user').setDescription('Select a user').setRequired(true),
		)
		.addIntegerOption((option) => option.setName('xp').setDescription('Set the amount of XP for a user').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	category: 'levels',
	async execute(interaction) {
		const { options } = interaction;

		const targetUser = options.getMember('user');
		const XP = options.getInteger('xp');


		const userLevel = await Level.findOne({
			userId: targetUser.id,
			guildId: interaction.guildId,
		});

		if (!userLevel) {
			interaction.reply(
				targetUser
					? `**${targetUser.user.username}** doesn't have any levels yet. Try again when they chat a little more.`
					: 'You don\'t have any levels yet. Keep chatting and try again.',
			);
			return;
		}
		if (userLevel) {
			if (XP < calculateLevelXp(userLevel.level)) {
				userLevel.xp = XP;
				userLevel.save();
				return interaction.reply(`XP has been set for <@${targetUser.id}>`);
			}
			else {
				return interaction.reply(`Invalid XP amount, make sure it is between 0 and ${calculateLevelXp(userLevel.level)}`);
			}
		}
	},
};
