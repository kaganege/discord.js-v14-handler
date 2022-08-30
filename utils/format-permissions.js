import _ from "lodash";
import { PermissionsBitField } from "discord.js";

/**
 *
 * @param {import("discord.js").PermissionResolvable[]|import("discord.js").PermissionResolvable} permissions
 * @returns {bigint}
 */
export default function formatPermissions(...permissions) {
	if (!permissions || !permissions?.length) return permissions;

	permissions = Array.isArray(permissions)
		? permissions.filter((p) => typeof p === "string").map(snakeToPascal)
		: snakeToPascal(permissions);

	return Number(new PermissionsBitField(permissions).bitfield);
}

function snakeToPascal(string) {
	let camelCase = _.camelCase(string);
	let PascalCase = _.upperFirst(camelCase);

	return PascalCase;
}
