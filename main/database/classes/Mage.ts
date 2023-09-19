import { Class } from "rpgjs-character-select";

/** @ts-ignore */
@Class({
    name: 'Mage',
    description: '',
    equippable: [],
    skillsToLearn: [],
    statesEfficiency: [],
    elementsEfficiency: [],
    graphics: {
        pernament: ['body-light', 'head-vampire-light'],
        baseEquipment: {
            torso: 'frock-charcoal',
            legs: 'pants-black',
        },
        animations: [],
    }
})
export default class Mage {
}
