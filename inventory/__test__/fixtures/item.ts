import { BackpackItem } from "../../server/src/domain/BackpackItem"
import { ItemType } from "../../server/src/enum/ItemType";
import { Item } from './../../server/src/decorators/Item';
import { Weapon } from './../../server/src/decorators/Weapon';

interface ItemInInventoryWithoutSlot {
    itemId?: string,
    type?: string,
    nb?: number
}

interface ItemInInventoryWithoutSlotRequiredFields {
    itemId: string,
    type: string,
    nb: number
}

export const potion = (stack?: ItemInInventoryWithoutSlot): ItemInInventoryWithoutSlotRequiredFields => {
    return item({
        ...stack,
        itemId: 'potion',
    })
}

export const item = (stack?: ItemInInventoryWithoutSlot): ItemInInventoryWithoutSlotRequiredFields => {
    return {
        itemId: stack?.itemId || 'item',
        type: stack?.type || 'item',
        nb: stack?.nb || 1,
    }
}

export const backpackItem = (stack: ItemInInventoryWithoutSlotRequiredFields, slot: number) => {
    return new BackpackItem({
        ...stack,
        slot: slot
    });
}

/** @ts-ignore */
@Item({
    name: 'Potion',
    price: 100,
    hpValue: 100,
    consumable: true,
})
export class Potion { }

/** @ts-ignore */
@Weapon({
    name: 'Sword',
    price: 500,
    type: ItemType.Weapon,
    equippable: true,
})
export class Sword {}
