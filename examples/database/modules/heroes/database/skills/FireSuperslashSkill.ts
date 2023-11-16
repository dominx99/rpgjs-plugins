import { Presets, RpgPlayer } from '@rpgjs/server';
import { Skill } from '@rpgjs/database';

/** @ts-ignore */
@Skill({
    name: 'Fire superslash',
    description: 'Smash',
    spCost: 10,
    power: 5,
    coefficient: {
        [Presets.ATK]: 2
    },
    variance: 10,
    hitRate: 1,
})
export default class FireSuperslashSkill {
    onUse(attacker: RpgPlayer) {
    }
}
