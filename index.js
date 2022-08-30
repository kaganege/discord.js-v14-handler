import { Collection, version } from "discord.js";
import client from "./client.js";
import logs from "./utils/log.js";
import "dotenv/config";

Object.assign(global, logs);

client.commands = new Collection();

/* Command handler */
await import("./handlers/commands.js").then(
	async (module) => await module.default()
);

/* Event handler */
await import("./handlers/events.js").then(
	async (module) => await module.default()
);

client.login(process.env.TOKEN);
