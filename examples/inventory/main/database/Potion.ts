import { Item } from 'rpgjs-inventory';

/** @ts-ignore */
@Item({
    id: 'hp-potion-1',
    name: 'Healing Potion',
    displayName: 'Healing Potion',
    description: 'Gives 100 HP',
    icon: 'hp-potion-1',
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
