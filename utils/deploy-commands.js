import client from "../client.js";
import formatCommands from "./format-commands.js";
import { ApplicationCommand } from "discord.js";
import { getBorderCharacters, createStream } from "table";
import _ from "lodash";

export default async () => {
	log("Deploying commands...");
	const config = {
		border: getBorderCharacters("norc"),
		columnDefault: {
			width: 10,
		},
		columns: [{ alignment: "center" }, { alignment: "center" }],
		columnCount: 2,
	};
	const stream = createStream(config);

	const currentCommands = await client.application.commands.fetch({
		withLocalizations: true,
	});
	/**
	 * @type {import("../typings").CommandsCollection}
	 */
	const commands = client.commands;

	const newCommands = commands.filter(
		(command) => !currentCommands.some((c) => c.name === command.name)
	);
	for (const [key, newCommand] of newCommands) {
		await client.application.commands.create(formatCommands(newCommand));
	}
	stream.write(["Created", newCommands.size]);

	const deletedCommands = currentCommands.filter(
		(command) => !commands.some((c) => c.name === command.name)
	);
	for (const deletedCommand of deletedCommands.toJSON()) {
		await deletedCommand.delete();
	}
	stream.write(["Deleted", deletedCommands.size]);

	const updatedCommands = commands.filter((command) => {
		const previousCommand = currentCommands.find(
			(c) => c.name === command.name
		);
		return (
			currentCommands.some((c) => c.name === command.name) &&
			(!ApplicationCommand.optionsEqual(
				previousCommand.options ?? [],
				command.options ?? []
			) ||
				!_.isEqual(
					_.pickBy(
						formatCommands(command),
						(value, key) => key !== "options"
					),
					_.pickBy(
						formatCommands(previousCommand),
						(value, key) => key !== "options"
					)
				))
		);
	});

	for (const newCommand of updatedCommands.toJSON()) {
		await currentCommands
			.find((cmd) => cmd.name == newCommand.name)
			.edit(formatCommands(newCommand));
	}
	stream.write(["Updated", updatedCommands.size]);

	if (!newCommands.size && !deletedCommands.size && !updatedCommands.size)
		log("All commands already deployed!");
};
