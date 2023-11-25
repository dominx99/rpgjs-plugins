import { RpgPlayer } from '@rpgjs/server';
import { Skill } from '@rpgjs/database';

/** @ts-ignore */
@Skill({
    id: 'energy-of-the-comet',
    name: 'Energy of the comet',
    description: 'Energy of the comet',
    spCost: 1,
    power: 10,
    variance: 10,
    hitRate: 1,
})
export default class EnergyOfTheCometSkill {
    onUse(attacker: RpgPlayer) {
    }
}
