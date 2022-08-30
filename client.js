import { Client, Collector, GatewayIntentBits, ActivityType } from "discord.js";

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	presence: {
		status: "online",
		activities: [{ name: "Sunucuyu", type: ActivityType.Watching }],
	},
});

export default client;
