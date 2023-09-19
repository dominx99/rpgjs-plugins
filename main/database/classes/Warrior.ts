import { Class } from "../../../character-select/server/src/decorators/Class";

/** @ts-ignore */
@Class({
    name: 'Warrior',
    description: '',
    equippable: [],
    skillsToLearn: [],
    statesEfficiency: [],
    elementsEfficiency: [],
    graphics: {
        pernament: ['body-light', 'head-light'],
        baseEquipment: {},
        animations: [],
    }
})
export default class Warrior {
}
