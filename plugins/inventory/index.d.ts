import { Inventory, Slot } from "./server/src/domain/Inventory";
import { Item } from './server/src/decorators/Item'
import { Armor } from './server/src/decorators/Armor'
import { Weapon } from './server/src/decorators/Weapon'
import { Backpack } from './server/src/domain/Backpack'
import { BackpackItem } from './server/src/domain/BackpackItem'
import Equipment from './server/src/domain/Equipment'
import { ItemType } from './server/src/enum/ItemType'
import { UnequipItem } from './server/src/service/UnequipItem'
import { UseItem } from './server/src/service/UseItem'
import { EquipItem } from './server/src/service/EquipItem'
import { ConsumeItem } from './server/src/service/ConsumeItem'
import { NativeInventoryItem } from "./server/src/interfaces/NativeInventoryItem";
import { ItemEntity } from "./server/src/interfaces/ItemEntity";

declare module '@rpgjs/server' {
    export interface RpgPlayer {
        inventory: Inventory
    }

    export interface RpgPlayerHooks {
        onEquip?: (player: RpgPlayer, itemId: string) => void;
        canEquip?: (player: RpgPlayer, item: NativeInventoryItem) => void;
        onEquipFailed?: (player: RpgPlayer, error: Error) => void;
        onUnequip?: (player: RpgPlayer, itemId: string) => void;
    }
}

export {
    Inventory,
    Backpack,
    BackpackItem,
    Equipment,
    Slot,
    ConsumeItem,
    UseItem,
    EquipItem,
    UnequipItem,
    Item,
    Weapon,
    Armor,
    ItemType,
    ItemEntity,
    NativeInventoryItem
}
