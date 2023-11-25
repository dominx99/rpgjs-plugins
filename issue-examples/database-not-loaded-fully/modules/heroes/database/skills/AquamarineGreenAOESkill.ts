import { RpgPlayer } from '@rpgjs/server';
import { Skill } from '@rpgjs/database';

/** @ts-ignore */
@Skill({
    id: 'aquamarine-green-aoe-skill',
    name: 'Ritual of the wrath of the forest',
    description: 'Ritual of the wrath of the forest',
    spCost: 1,
    power: 10,
    variance: 10,
    hitRate: 1,
})
export default class AquamarineGreenAOESkill {
    onUse(attacker: RpgPlayer) {
    }
}
