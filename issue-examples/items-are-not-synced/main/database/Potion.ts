import { Item } from '@rpgjs/database';

/** @ts-ignore */
@Item({
    id: 'hp-potion-1',
    name: 'Healing Potion',
    description: 'Gives 100 HP',
    price: 200,
    hpValue: 100,
    hitRate: 1,
    consumable: true,
    addStates: [],
    removeStates: [],
    elements: [],
    paramsModifier: {}
})
export default class Potion {
}
