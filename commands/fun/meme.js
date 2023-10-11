const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default:fetch }) => fetch(...args));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meme')
		.setDescription('Get a meme!')
		.addStringOption((option) =>
			option.setName('platform')
				.setDescription('Meme platform(optional)')
				.addChoices(
					{ name: 'Reddit', value: 'reddit' },
				),
		),
	category: 'fun',
	async execute(interaction) {
		const { options } = interaction;

		const platform = options.getString('platform');
		const replyMessage = new EmbedBuilder();
		async function redditMeme() {
			await fetch('https://www.reddit.com/r/memes/random/.json').then(async res => {
				const meme = await res.json();

				const title = meme[0].data.children[0].data.title;
				const url = meme[0].data.children[0].data.url;
				const author = meme[0].data.children[0].data.author;

				return interaction.reply({
					embeds: [
						replyMessage
							.setTitle(title)
							.setImage(url)
							.setURL(url)
							.setColor('Random')
							.setFooter({ text: author }),
					],
				});
			});
		}
		if (platform === 'reddit') {
			redditMeme();
		}
		if (!platform) {
			const memes = [redditMeme];
			memes[Math.floor(Math.random() * memes.length)]();
		}
	},
};
