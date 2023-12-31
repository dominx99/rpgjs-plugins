import { RpgServer, RpgModule } from '@rpgjs/server'
import player from './player';

/** @ts-ignore */
@RpgModule<RpgServer>({
    hooks: {
        player: ['onEquip', 'canEquip', 'onEquipFailed', 'onUnequip'],
    },
    player
})
export default class RpgServerModule { }
