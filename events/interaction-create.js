import client from "../client.js";
import { codeBlock } from "@discordjs/builders";
import _ from "lodash";

const { LOG_CHANNEL, AUTHOR_ID } = process.env;

/** @type {import("../typings").Event<"interactionCreate">} */
export default {
	name: "interactionCreate",
	execute: async (interaction) => {
		if (interaction.isChatInputCommand()) {
			const { commandName, user, options } = interaction;

			const command = client.commands.get(commandName);
			const args = options.data;

			if (command.ownerOnly && AUTHOR_ID && user.id !== AUTHOR_ID)
				return interaction.reply({
					ephemeral: true,
					content: "Bu komuta erişimin izniniz yok!",
				});

			const logChannel = LOG_CHANNEL
				? client.channels.cache.get(LOG_CHANNEL)
				: null;
			try {
				await command.execute({ interaction, args, client });
			} catch (err) {
				console.error(err);
				logChannel &&
					logChannel.send(
						codeBlock("xl", (err.stack || err.message).substring(0, 3900))
					);
			}
		}
	},
};
