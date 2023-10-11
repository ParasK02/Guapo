const { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction } = require('discord.js');
const Level = require('../../models/Level');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Get a user\'s rank information')
		.addUserOption((option) =>
			option.setName('user').setDescription('Select a user'),
		)
		.setDMPermission(false),
	category: 'levels',
	/**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
	async execute(interaction) {
		const { options } = interaction;

		const member = options.get('user')?.value;
		const targetUserId = member || interaction.member.id;
		const targetUser = await interaction.guild.members.fetch(targetUserId);

		const userLevel = await Level.findOne({
			userId: targetUser.id,
			guildId: interaction.guildId,
		});
		if (!userLevel) {
			interaction.reply(
				member
					? `**${member.user.username}** doesn't have any levels yet. Try again when they chat a little more.`
					: 'You don\'t have any levels yet. Keep chatting and try again.',
			);
			return;
		}

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
		const currentRank =
			allLevels.findIndex((lvl) => lvl.userId === targetUser.id) + 1;
		const rankCard = new canvacord.Rank()
			.setAvatar(targetUser.user.displayAvatarURL({ size: 256 }))
			.setRank(currentRank)
			.setLevel(userLevel.level)
			.setCurrentXP(userLevel.xp)
			.setRequiredXP(calculateLevelXp(userLevel.level))
			.setStatus(targetUser.presence.status)
			.setProgressBar('#FFC300', 'COLOR')
			.setUsername(targetUser.user.username);
		const data = await rankCard.build();
		const attachment = new AttachmentBuilder(data);

		return interaction.reply({ files: [attachment] });
	},
};
