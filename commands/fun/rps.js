const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} = require('discord.js');
const choices = [
	{ name: 'Rock', emoji: '🪨', beats: 'Scissors' },
	{ name: 'Paper', emoji: '📄', beats: 'Rock' },
	{ name: 'Scissors', emoji: '✂️', beats: 'Paper' },
];
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play Rock Paper Scissors with another user')
		.setDMPermission(false)
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('CHOOSE YOUR APPONENT!')
				.setRequired(true),
		),
	category: 'fun',
	/**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
	async execute(interaction) {
		const { options } = interaction;
		const opponent = options.getUser('user');
		try {
			if (interaction.user.id === opponent.id) {
				interaction.reply({
					content: 'Pick someone other than yourself :)',
					ephemeral: true,
				});
				return;
			}
			if (opponent.bot) {
				interaction.reply({
					content: 'You cannot play against a bot!',
					ephemeral: true,
				});
				return;
			}
			const embed = new EmbedBuilder()
				.setTitle('Rock Paper Scissors')
				.setDescription(`It's currently ${opponent}'s turn`)
				.setColor('Yellow')
				.setTimestamp(new Date());
			const buttons = choices.map((choice) => {
				return new ButtonBuilder()
					.setCustomId(choice.name)
					.setLabel(choice.name)
					.setStyle(ButtonStyle.Primary)
					.setEmoji(choice.emoji);
			});
			const row = new ActionRowBuilder().addComponents(buttons);
			const reply = await interaction.reply({
				content: `${opponent}, you have been challenged to a game of Rock Paper Scissors, by ${interaction.user}. To start playing, click one of the buttons below.
                `,
				embeds: [embed],
				components: [row],
			});
			const opponentInteraction = await reply
				.awaitMessageComponent({
					filter: (i) => i.user.id === opponent.id,
					time: 30_000,
				})
				.catch(async (error) => {
					embed.setDescription(
						`Game over. ${opponent} did not respond in time.`,
					);
					await reply.edit({ embeds: [embed], components: [] });
				});
			if (!opponentInteraction) return;

			const opponentChoice = choices.find(
				(choice) => choice.name === opponentInteraction.customId,
			);

			await opponentInteraction.reply({
				content: `You picked ${opponentChoice.name + opponentChoice.emoji}`,
				ephemeral: true,
			});

			// change embed to interaction user turn
			embed.setDescription(`It's currently ${interaction.user}'s turn.`);
			await reply.edit({
				content: `${interaction.user} it's your turn now.`,
				embeds: [embed],
			});
			const initialUserInteraction = await reply
				.awaitMessageComponent({
					filter: (i) => i.user.id === interaction.user.id,
					time: 30_000,
				})
				.catch(async (error) => {
					embed.setDescription(
						`Game over. ${interaction.user} did not respond in time.`,
					);
					await reply.edit({ embeds: [embed], components: [] });
				});
			if (!initialUserInteraction) return;

			const initialUserChoice = choices.find(
				(choice) => choice.name === initialUserInteraction.customId);

			let result;

			if (opponentChoice.beats === initialUserChoice.name) {
				result = `${opponent} won!`;
			}
			if (initialUserChoice.beats === opponentChoice.name) {
				result = `${interaction.user} won!`;
			}
			if (opponentChoice.name === initialUserChoice.name) {
				result = 'It was a tie.';
			}
			embed.setDescription(
				`${opponent} picked ${opponentChoice.name + opponentChoice.emoji}\n
                ${interaction.user} picked ${initialUserChoice.name + initialUserChoice.emoji}
                \n\n${result}`,
			);
			reply.edit({ embeds: [embed], components:[] });
		}
		catch (error) {
			console.log('Error with RPS:');
			console.log(error);
		}
	},
};
