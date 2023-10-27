import client from 'client!./client'
import server from 'server!./server'

import { Item } from './server/src/decorators/Item'
import { Weapon } from './server/src/decorators/Weapon';
import { Armor } from './server/src/decorators/Armor';
import { Backpack } from './server/src/domain/Backpack';
import { Inventory } from './server/src/domain/Inventory';
import { BackpackItem } from './server/src/domain/BackpackItem';
import { ItemType } from './server/src/enum/ItemType';
import Equipment from './server/src/domain/Equipment';
import { UseItem } from './server/src/service/UseItem';
import { ConsumeItem } from './server/src/service/ConsumeItem';
import { EquipItem } from './server/src/service/EquipItem';
import { UnequipItem } from './server/src/service/UnequipItem';

export default {
    client,
    server
}

export {
    Item,
    Weapon,
    Armor,
    Inventory,
    Backpack,
    BackpackItem,
    Equipment,
    ItemType,
    UseItem,
    ConsumeItem,
    EquipItem,
    UnequipItem,
}
