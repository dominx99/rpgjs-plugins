import { Class } from "rpgjs-character-select";

/** @ts-ignore */
@Class({
    name: 'Archer',
    description: '',
    equippable: [],
    skillsToLearn: [],
    statesEfficiency: [],
    elementsEfficiency: [],
    graphics: {
        pernament: ['body-light', 'head-light', 'long-light-ears', 'male-bangslong-platinum'],
        baseEquipment: {
            torso: 'vest-black',
            legs: 'pants-black',
        },
        animations: [],
    }
})
export default class Archer {
}
