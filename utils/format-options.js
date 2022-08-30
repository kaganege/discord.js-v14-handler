import {
	ApplicationCommandOptionType as OptiyonType,
	ChannelType,
} from "discord-api-types/v10";
import formatPermissions from "./format-permissions.js";

export default function formatOptions(options) {
	if (!Array.isArray(options)) return options;
	const { type, channel_types, permissions } = options;

	return options.map((option) => ({
		...option,
		permissions: formatPermissions(permissions),
		channel_types: channel_types?.map(
			(channel_type) =>
				ChannelType[
					typeof channel_type === "number"
						? channel_type - 1
						: channel_type
				]
		),
	}));
}
