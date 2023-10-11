module.exports = async (client) => {
	const guild = client.guilds.cache.get('1154935671220359180');

	setInterval(() => {
		const memberCount = guild.memberCount;
		const channel = guild.channels.cache.get('1155303011128725646');
		channel.setName(`Total Members: ${memberCount.toLocaleString()}`);
		console.log('Updating Member Count');
	}, 900000);
};
