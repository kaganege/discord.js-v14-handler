import discord, {
	PermissionsBitField,
	ApplicationCommandType,
	Collection,
} from "discord.js";
import formatPermissions from "./format-permissions.js";
import formatOptions from "./format-options.js";
/**
 * @param {Array<object>|Collection<string, object>} commands
 * @returns {Array<discord.APIApplicationCommand>|discord.APIApplicationCommand}
 */
export default function (commands) {
	if (Array.isArray(commands))
		return (commands.size || commands.length) > 0 ? commands.map(format) : [];
	else if (typeof commands === "object") return format(commands);
	else return {};
}

/**
 * @param {{ name: string|string[], nameLocalizations?: discord.LocalizationMap, description: string|string[], descriptionLocalizations?: discord.LocalizationMap, options?: [], permissions?: [], defaultMemberPermissions?: PermissionsBitField, dm?: boolean, dmPermission?: boolean, type?: ApplicationCommandType }}
 * @returns {discord.APIApplicationCommand}
 */
function format({
	name,
	nameLocalizations,
	description,
	descriptionLocalizations,
	options = [],
	permissions,
	defaultMemberPermissions,
	dm,
	dmPermission,
	type,
}) {
	const name_localizations = [];
	const description_localizations = [];

	if (Array.isArray(name) && name.length > 1)
		process.env.SECOND_LANGUAGE
			? name_localizations.push({ [process.env.SECOND_LANGUAGE]: name[1] })
			: error("Please specify a second language in .env file!", true);
	if (Array.isArray(description) && description.length > 1)
		process.env.SECOND_LANGUAGE
			? description_localizations.push({
					[process.env.SECOND_LANGUAGE]: description[1],
			  })
			: error("Please specify a second language in .env file!", true);

	return {
		name: Array.isArray(name) ? name[0] : name,
		name_localizations: name_localizations.length
			? name_localizations
			: nameLocalizations || null,
		description: Array.isArray(description) ? description[0] : description,
		description_localizations: description_localizations.length
			? description_localizations
			: descriptionLocalizations || null,
		type:
			ApplicationCommandType[typeof type === "number" ? type - 1 : type] ||
			1,
		options: formatOptions(options),
		default_member_permissions:
			formatPermissions(permissions) ||
			formatPermissions(defaultMemberPermissions) ||
			0,
		dm_permission: !(dm || dmPermission) ? false : true,
	};
}
