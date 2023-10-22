import { ItemType, Weapon } from 'rpgjs-inventory';

export default function Sword() {
    /** @ts-ignore */
    @Weapon({
        id: 'sword' + (Math.round(Math.random() * 10000)),
        name: 'Big Sword',
        displayName: 'Big Sword',
        type: ItemType.Weapon,
        icon: 'sword',
        price: 2000,
        atk: Math.round(Math.random() * 5) + 3,
        equippable: true,
    })
    class Sword {
    }

    return Sword;
}
