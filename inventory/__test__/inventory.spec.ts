import { RpgPlayer, RpgModule, RpgServer } from '@rpgjs/server';
import { clear } from '@rpgjs/testing';
import { beforeEach, afterEach, test, expect, describe, it } from 'vitest';
import player from './../server/player';
import { RpgClientEngine } from '@rpgjs/client';
import { Inventory } from '../server/src/domain/Inventory';
import { Backpack } from '../server/src/domain/Backpack';
import { item, potion, backpackItem } from './fixtures/item';
import { _beforeEach } from '../../tests/unit-tests/specs/beforeEach';

/** @ts-ignore */
@RpgModule<RpgServer>({
    player
})
class RpgServerModule { }

let currentPlayer: RpgPlayer;
let client: RpgClientEngine

beforeEach(async () => {
    const res = await _beforeEach([{
        server: RpgServerModule
    }]);
    currentPlayer = res.player;
    client = res.client;
});

describe('player.inventory', () => {
    test('that inventory is initialized on the player', () => {
        expect(currentPlayer.inventory).toBeDefined();
        expect(currentPlayer.inventory.getBackpack('main')).toBeDefined();
        expect(currentPlayer.inventory.getBackpack('main').size).toBe(32);
    });

    test('that player.inventory.addItem places item in inventory', () => {
        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 5
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(1);
        expect(currentPlayer.inventory.getBackpack('main').items[0].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[0].nb).toBe(5);
    })

    test('that player.inventory.addItem stacks items', () => {
        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 5
        });

        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 5
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(1);
        expect(currentPlayer.inventory.getBackpack('main').items[0].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[0].nb).toBe(10);
    });

    test('that player.inventory.addItem stacks items by size', () => {
        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 150
        });

        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 100
        });

        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 50
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpack('main').items[0].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[0].nb).toBe(200);
        expect(currentPlayer.inventory.getBackpack('main').items[1].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[1].nb).toBe(100);
    });

    test('cannot add item with negative count', () => {
        [-1, -5000, -99999999999999].forEach(nb => {
            expect(() => currentPlayer.inventory.addItem({
                itemId: 'potion',
                type: 'item',
                nb: nb
            })).toThrowError('Item quantity cannot be negative');
        })
    });

    test('that items exceding the limit of inventory are not added as native items', () => {
        currentPlayer.inventory = new Inventory([new Backpack('main', 2)]);

        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 250
        });

        const addItemResult = currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 250
        });

        expect(addItemResult.amountOverSpace).toBe(100);

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpack('main').items[0].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[0].nb).toBe(200);
        expect(currentPlayer.inventory.getBackpack('main').items[1].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[1].nb).toBe(200);
    });
});

describe('inventory save and load', () => {
    test('that inventory data is saved and restored correctly', () => {
        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 250
        });

        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 250
        });

        const json = currentPlayer.save();

        currentPlayer.inventory = Inventory.load(JSON.parse(json).inventory);

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(3);
        expect(currentPlayer.inventory.getBackpack('main').items[0].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[0].nb).toBe(200);
        expect(currentPlayer.inventory.getBackpack('main').items[1].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[1].nb).toBe(200);
        expect(currentPlayer.inventory.getBackpack('main').items[2].itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpack('main').items[2].nb).toBe(100);
    });
});

describe('inventory replace slots', () => {
    test('that inventory replaces slots', () => {
        currentPlayer.inventory.addItem({
            itemId: 'health',
            type: 'item',
            nb: 250
        });

        currentPlayer.inventory.addItem({
            itemId: 'mana',
            type: 'item',
            nb: 250
        });

        currentPlayer.inventory.replaceItems({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 3,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(4);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('mana');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(50);
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.itemId).toBe('health');
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(50);
        expect(currentPlayer.inventory.getBackpackItem('main', 2)?.itemId).toBe('mana');
        expect(currentPlayer.inventory.getBackpackItem('main', 2)?.nb).toBe(200);
        expect(currentPlayer.inventory.getBackpackItem('main', 3)?.itemId).toBe('health');
        expect(currentPlayer.inventory.getBackpackItem('main', 3)?.nb).toBe(200);
    });

    test('that inventory replaces slots with different size', () => {
        currentPlayer.inventory.addItem({
            itemId: 'health',
            type: 'item',
            nb: 300
        });

        currentPlayer.inventory.replaceItems({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 1,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('health');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(100);
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.itemId).toBe('health');
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(200);
    });

    test('cannot replace slots if the new slot is not empty', () => {
        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 1
        });

        expect(() => {
            currentPlayer.inventory.replaceItems({
                backpack: 'main',
                slot: 0,
            }, {
                backpack: 'main',
                slot: 1,
            });
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(1);
    });
});

describe('inventory stack items', () => {
    test('inventory stack items, same and different items', () => {
        const k = 5;

        for (let i = 0; i < 5; i++) {
            currentPlayer.inventory.addBackpackItemToSlot(
                backpackItem(potion({ nb: (k * i) + k }), i),
                { backpack: 'main', slot: i }
            );
        }
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }));

        currentPlayer.inventory.stackItems({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 1,
        });

        currentPlayer.inventory.dump();

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(5);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)).toBeNull();
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(15);

        currentPlayer.inventory.stackItems({
            backpack: 'main',
            slot: 3,
        }, {
            backpack: 'main',
            slot: 1,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(4);
        expect(currentPlayer.inventory.getBackpackItem('main', 3)).toBeNull();
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(35);

        expect(() =>
            currentPlayer.inventory.stackItems({
                backpack: 'main',
                slot: 4,
            }, {
                backpack: 'main',
                slot: 5,
            })
        ).toThrowError('Cannot stack different items');
    });

    test('stack items over the stack size', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 150 }), 8), { backpack: 'main', slot: 8 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 51 }), 16), { backpack: 'main', slot: 16 });

        currentPlayer.inventory.stackItems({
            backpack: 'main',
            slot: 16,
        }, {
            backpack: 'main',
            slot: 8,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 8)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 8)?.nb).toBe(200);
        expect(currentPlayer.inventory.getBackpackItem('main', 16)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 16)?.nb).toBe(1);
    })

    test('stack items and match stack size', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 99 }), 9), { backpack: 'main', slot: 9 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 101 }), 27), { backpack: 'main', slot: 27 });

        currentPlayer.inventory.stackItems({
            backpack: 'main',
            slot: 9,
        }, {
            backpack: 'main',
            slot: 27,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 27)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 27)?.nb).toBe(200);
    });

    test('stack items moving only part of quantity', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 150 }), 0), { backpack: 'main', slot: 0 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 150 }), 1), { backpack: 'main', slot: 1 });

        currentPlayer.inventory.stackItems({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 1,
        }, 25);

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(125);
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(175);
    });

    test('stack items moving only part of quantity but over the target stack size', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 30 }), 0), { backpack: 'main', slot: 0 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 180 }), 1), { backpack: 'main', slot: 1 });

        currentPlayer.inventory.stackItems({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 1,
        }, 25);

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(10);
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(200);
    });
});

describe('inventory move item to empty slot', () => {
    test('move item to empty slot', () => {
        currentPlayer.inventory.addItem(potion({ nb: 5 }))
        currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 0 },
            { backpack: 'main', slot: 3 }
        );
        expect(currentPlayer.inventory.getBackpackItem('main', 0)).toBeNull();
        expect(currentPlayer.inventory.getBackpackItem('main', 3)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 3)?.nb).toBe(5);
        currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 3 },
            { backpack: 'main', slot: 27 }
        );
        expect(currentPlayer.inventory.getBackpackItem('main', 3)).toBeNull();
        expect(currentPlayer.inventory.getBackpackItem('main', 27)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 27)?.nb).toBe(5);

        expect(() => currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 27 },
            { backpack: 'main', slot: 32 }
        )).toThrowError('Target slot is not in range');

        currentPlayer.inventory.addItem(item({ itemId: 'custom-item' }))

        expect(() => currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 27 },
            { backpack: 'main', slot: 0 }
        )).toThrowError('Target slot is not empty');
    });

    test('move item to empty slot with quantity given', () => {
        currentPlayer.inventory.addItem(potion({ nb: 30 }))
        currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 0 },
            { backpack: 'main', slot: 3 },
            5
        );
        currentPlayer.inventory.dump();
        currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 0 },
            { backpack: 'main', slot: 5 },
            10
        );
        currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 3 },
            { backpack: 'main', slot: 8 },
            3
        );

        expect(() => currentPlayer.inventory.moveItemToEmptySlot(
            { backpack: 'main', slot: 3 },
            { backpack: 'main', slot: 15 },
            3
        )).toThrowError('Not enough quantity of item');

        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(15)
        expect(currentPlayer.inventory.getBackpackItem('main', 3)?.nb).toBe(2)
        expect(currentPlayer.inventory.getBackpackItem('main', 5)?.nb).toBe(10)
        expect(currentPlayer.inventory.getBackpackItem('main', 8)?.nb).toBe(3)
        expect(currentPlayer.inventory.getBackpackItem('main', 15)).toBeNull()
    });
})

describe('inventory move item facade', () => {
    test('inventor moveItem as to empty slot', () => {
        currentPlayer.inventory.addItem({
            itemId: 'potion',
            type: 'item',
            nb: 5,
        });

        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 31,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 31)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 31)?.nb).toBe(5);
    });

    it('does not decrease amount when moving to the same slot', () => {
        currentPlayer.inventory.addItem(potion({ nb: 160 }));

        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 0,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(160);
    });

    test('inventory moveItem as replace items', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(item({ itemId: 'sword' }), 0), { backpack: 'main', slot: 0 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(item({ itemId: 'shield' }), 12), { backpack: 'main', slot: 12 });

        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 12,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('shield');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 12)?.itemId).toBe('sword');
        expect(currentPlayer.inventory.getBackpackItem('main', 12)?.nb).toBe(1);
    });

    test('inventory moveItem as stack items', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 199 }), 8), { backpack: 'main', slot: 8 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 199 }), 16), { backpack: 'main', slot: 16 });

        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 16,
        }, {
            backpack: 'main',
            slot: 8,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 8)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 8)?.nb).toBe(200);
        expect(currentPlayer.inventory.getBackpackItem('main', 16)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 16)?.nb).toBe(198);
    });

    test('stacking max stack size to lower quantity', () => {
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 200 }), 0), { backpack: 'main', slot: 0 });
        currentPlayer.inventory.addBackpackItemToSlot(backpackItem(potion({ nb: 100 }), 1), { backpack: 'main', slot: 1 });

        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 1,
        });
        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 1,
        }, {
            backpack: 'main',
            slot: 13,
        });
        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 0,
        }, {
            backpack: 'main',
            slot: 10,
        });
        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 13,
        }, {
            backpack: 'main',
            slot: 10,
        });

        expect(currentPlayer.inventory.getBackpack('main').items.length).toBe(2);
        expect(currentPlayer.inventory.getBackpackItem('main', 10)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 10)?.nb).toBe(200);
        expect(currentPlayer.inventory.getBackpackItem('main', 13)?.itemId).toBe('potion');
        expect(currentPlayer.inventory.getBackpackItem('main', 13)?.nb).toBe(100);
    });

    test('move to empty and stack items', () => {
        currentPlayer.inventory.addItem(potion({ nb: 300 }));

        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 1,
        }, {
            backpack: 'main',
            slot: 13
        }, 50);
        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 1,
        }, {
            backpack: 'main',
            slot: 5
        }, 5);
        currentPlayer.inventory.moveItem({
            backpack: 'main',
            slot: 5,
        }, {
            backpack: 'main',
            slot: 13
        });

        expect(currentPlayer.inventory.getBackpack('main').items).toHaveLength(3);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(200);
        expect(currentPlayer.inventory.getBackpackItem('main', 1)?.nb).toBe(45);
        expect(currentPlayer.inventory.getBackpackItem('main', 13)?.nb).toBe(55);
    });
});

describe('inventory decrease quantity of slot', () => {
    test('decrease without removing', () => {
        currentPlayer.inventory.addItem(potion({ nb: 200 }));

        currentPlayer.inventory.decreaseQuantityOfSlot({
            backpack: 'main',
            slot: 0,
        }, 50);

        expect(currentPlayer.inventory.getBackpack('main').items).toHaveLength(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(150);
    });

    test('decrease with remove item', () => {
        currentPlayer.inventory.addItem(potion({ nb: 200 }));

        currentPlayer.inventory.decreaseQuantityOfSlot({
            backpack: 'main',
            slot: 0,
        }, 200);

        expect(currentPlayer.inventory.getBackpack('main').items).toHaveLength(0);
    });

    test('decrease more than in slot', () => {
        currentPlayer.inventory.addItem(potion({ nb: 50 }));

        currentPlayer.inventory.decreaseQuantityOfSlot({
            backpack: 'main',
            slot: 0,
        }, 60);

        expect(currentPlayer.inventory.getBackpack('main').items).toHaveLength(0);
    });

    test('decrease negative value in slot', () => {
        currentPlayer.inventory.addItem(potion({ nb: 50 }));

        expect(() => currentPlayer.inventory.decreaseQuantityOfSlot({
            backpack: 'main',
            slot: 0,
        }, -15)).toThrowError('Cannot decrease quantity by negative value');

        expect(currentPlayer.inventory.getBackpack('main').items).toHaveLength(1);
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(50);
    });
});

afterEach(() => {
    clear();
});
