import type {
	PermissionResolvable,
	ApplicationCommandOption,
	Client,
	ClientEvents,
	Collection,
} from "discord.js";
import type { Options } from "boxen";

type Command = {
	name: string;
	description: string;
	permissions?: PermissionResolvable;
	options?: ApplicationCommandOption[] | undefined[];
	dm?: boolean;
	ownerOnly?: boolean;
	execute(args: {
		interaction: CommandInteraction;
		args: object[];
		client: Client<true>;
	}): void;
};

interface Event<E extends keyof ClientEvents> {
	name: E;
	once?: boolean;
	execute(...args: ClientEvents[E]): void;
}

type Log = {
	update(message: string, currentVersion?: string, newVersion?: string): void;
	warning(message: string): void;
	error(message: string): void;
	info(message: string): void;
	log(message: string, options?: Options): void;
};

type CommandsCollection = Collection<string, Command>;
