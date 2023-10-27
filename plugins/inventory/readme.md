# RPG JS Plugin
    
## Description
It's a plugin of [RPG JS](https://rpgjs.dev/) engine that gives possibility to manage inventory.\
Example implementation: [inventory](https://github.com/dominx99/rpgjs-plugins/blob/master/examples/inventory)
       
## Features
✅Move, stack, replace item in inventory\
✅Filling existing stacks while adding to inventory\
⬜Configurable max stack size, currently max stack size is hardcoded to 200

[![Watch the video](https://drive.usercontent.google.com/download?id=108blFvSzi4EdfBtx_U8YhiLrY-rCVWr_&export=download)](https://drive.google.com/file/d/1OuJViaDxX8zaeA42fDzVMdVV9ZT9ReWf/view?usp=sharing)

## Installation
    
You can easily install the RPG JS Plugin using npm. Open your terminal and run the following command:

```bash
npx rpgjs add rpgjs-inventory
```

## Usage

First you have to add ivnentory to the initialization of player process:

`main/player.ts`
```ts
import { Inventory, Backpack, Equipment } from 'rpgjs-inventory';

const player: RpgPlayerHooks {}

const originalInitializeMethod = RpgPlayer.prototype.initialize;
RpgPlayer.prototype.initialize = function() {
    originalInitializeMethod.apply(this);

    this.inventory = new Inventory([new Backpack('main', 30) ], new Equipment());
}

export default player
```

Backpack arguments are:
- id: string - it is id of the backpack to interact with
- size: string - quantity of slots in the backpack

> [!IMPORTANT]
> You can add multiple backpacks to the inventory, but it's not well tested yet

Next you should use extended decorators which allows to set `icon` for an Item:
```ts
import { Item } from 'rpgjs-inventory';

/** @ts-ignore */
@Item({
    id: 'hp-potion-1',
    name: 'Healing Potion',
    description: 'Gives 100 HP',
    icon: 'hp-potion-1'
    /* other params */
})
export default class Potion {
}
```

### Add item

- Example

```ts
player.addItem('potion', 300)
player.inventory.addItem({
    itemId: 'potion',
    type: 'item',
    nb: 300,
})
```

- Usage

It adds item to the inventory.

> [!IMPORTANT]
> Note that you have to also use native `player.addItem` method because this plugin does not overwrite the main items system but it's only next layer on top of it.

Next you can use `player.inventory.addItem` which will take into account stack size.\
If there are already potions in inventory it will fill already existing stacks and then add the rest to the empty one.

### Replace item

- Example

```ts
const from: Slot = { backpack: 'main', slot: 5 };
const from: Slot = { backpack: 'main', slot: 25 };

player.inventory.replaceItems(from: Slot, to: Slot);
```

- Usage

It replaces items in inventory.\
In case when there is no item in `from` or `to` slot then it does nothing.

### Stack items

- Example

```ts
const from: Slot = { backpack: 'main', slot: 5 };
const from: Slot = { backpack: 'main', slot: 25 };

player.inventory.replaceItems(from: Slot, to: Slot);
```

- Usage

it stacks two items with the same id in the inventory.

### Move item to empty slot

- Example

```ts
const from: Slot = { backpack: 'main', slot: 5 };
const from: Slot = { backpack: 'main', slot: 25 };
const quantityToMove = 50;

moveItemToEmptySlot(from, to, quantityToMove);
```

- Usage

It moves an item to the other empty slot in inventory.\
In case when target slot is not empty then it will trigger an error.

### Move item

- Example

```ts
const from: Slot = { backpack: 'main', slot: 5 };
const from: Slot = { backpack: 'main', slot: 25 };
const quantityToMove = 50;
player.inventory.moveItem(from, to, quantityToMove);
```

- Usage:

It is facade of the 3 methods: `replaceItems`, `stackItems` and `moveItemToEmptySlot`.\
If target slot is empty then it will just move an item.\
If the first and target slot items are the same (id) then it will stack these items.\
If the first and target slot items are different then it will replace these items.

### Move item

- Example

```ts
const from: Slot = { backpack: 'main', slot: 5 };
const quantity = 50;

player.inventory.decreaseQuantityOfSlot(slot, quantity): void {
```

- Usage:

- It decreases item quantity by slot
- Remember to also decrease item quantity of native inventory system, eg.

```ts
player.useItem('potion');
player.inventory.decreaseQuantityOfSlot({ backpack: 'main', slot: 0 }, 1);
```
