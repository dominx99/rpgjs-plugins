import { Class } from "rpgjs-character-select";

/** @ts-ignore */
@Class({
    name: 'Warrior',
    description: '',
    equippable: [],
    skillsToLearn: [],
    statesEfficiency: [],
    elementsEfficiency: [],
    graphics: {
        pernament: ['body-light', 'head-light', 'male-spiked2-sandy'],
        baseEquipment: {
            torso: 'shortsleeve-charcoal',
            legs: 'pants-black',
        },
        animations: [],
    }
})
export default class Warrior {
}
