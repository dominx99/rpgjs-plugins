# RPG JS Plugin
    
## Description
It's a plugin of [RPG JS](https://rpgjs.dev/) engine that gives possibility to manage inventory.
    
...
    
## Features
✅Move, stack, replace item in inventory
✅Filling existing stacks while adding to inventory
⬜Configurable max stack size, currently max stack size is hardcoded to 200

...
    
## Installation
    
You can easily install the RPG JS Plugin using npm. Open your terminal and run the following command:

```bash
npx rpgjs add rpgjs-inventory
```

## Usage

First you have to add ivnentory to the initialization of player process:

`main/player.ts`
```
const player: RpgPlayerHooks {}

const originalInitializeMethod = RpgPlayer.prototype.initialize;
RpgPlayer.prototype.initialize = function() {
    originalInitializeMethod.apply(this);

    this.inventory = new Inventory([new Backpack('main', 30) ], new Equipment());
}

export default player
```

Then you can use methods to manage inventory:

### Add item

- Example

```ts
player.addItem('potion', 300)
player.inventory.addItem({
    itemId: 'potion',
    type: 'weapon',
    nb: 300,
})
```

- Usage

It adds item to the inventory.\

> [!IMPORTANT]
> Note that you have to also use native `player.addItem` method because this plugin does not overwrite the main items system but it's only next layer on top of it.\

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

```
const from: Slot = { backpack: 'main', slot: 5 };
const from: Slot = { backpack: 'main', slot: 25 };

player.inventory.replaceItems(from: Slot, to: Slot);
```

- Usage

it stacks two items with the same id in the inventory.

### Move item

```ts
const from: Slot = { backpack: 'main', slot: 5 };
const from: Slot = { backpack: 'main', slot: 25 };
const quantityToMove = 50;
player.inventory.moveItem(from, to, quantityToMove);
```

- Usage:

It moves item from one slot to another.

## License

...
