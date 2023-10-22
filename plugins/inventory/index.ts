import client from 'client!./client'
import server from 'server!./server'
import { Item } from './server/src/decorators/Item'
import { Armor } from './server/src/decorators/Armor'
import { Weapon } from './server/src/decorators/Weapon'
import { Inventory } from './server/src/domain/Inventory'
import { Backpack } from './server/src/domain/Backpack'
import { BackpackItem } from './server/src/domain/BackpackItem'
import Equipment from './server/src/domain/Equipment'
import { ItemType } from './server/src/enum/ItemType'
import { UnequipItem } from './server/src/service/UnequipItem'
import { UseItem } from './server/src/service/UseItem'
import { EquipItem } from './server/src/service/EquipItem'
import { ConsumeItem } from './server/src/service/ConsumeItem'

export default {
    client,
    server
}

export {
    Inventory,
    Backpack,
    BackpackItem,
    Equipment,
    ConsumeItem,
    UseItem,
    EquipItem,
    UnequipItem,
    Item,
    Weapon,
    Armor,
    ItemType
}
