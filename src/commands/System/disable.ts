import { SteveCommand } from '@lib/structures/commands/SteveCommand';
import { PermissionsLevels } from '@lib/types/Enums';
import { ApplyOptions } from '@skyra/decorators';
import { CommandOptions, KlasaMessage, Piece } from 'klasa';

@ApplyOptions<CommandOptions>({
	description: lang => lang.tget('commandDisableDescription'),
	guarded: true,
	permissionLevel: PermissionsLevels.OWNER,
	usage: '<Piece:piece>'
})
export default class extends SteveCommand {

	public async run(msg: KlasaMessage, [piece]: [Piece]) {
		if ((piece.type === 'event' && piece.name === 'coreMessage') || (piece.type === 'monitor' && piece.name === 'commandHandler')) {
			return msg.sendLocale('commandDisableWarn');
		}
		piece.disable();
		if (this.client.shard) {
			await this.client.shard.broadcastEval(`
				if (String(this.options.shards) !== '${this.client.options.shards}') this.${piece.store}.get('${piece.name}').disable();
			`);
		}
		return msg.sendLocale('commandDisable', [piece.type, piece.name], { code: 'diff' });
	}

}
