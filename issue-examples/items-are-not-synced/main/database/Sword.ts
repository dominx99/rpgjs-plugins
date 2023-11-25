import { Weapon } from '@rpgjs/database';

/** @ts-ignore */
@Weapon({
    id: 'sword' + (Math.round(Math.random() * 10000)),
    name: 'Big Sword',
    price: 2000,
    atk: 5,
})
export default class Sword {
}

