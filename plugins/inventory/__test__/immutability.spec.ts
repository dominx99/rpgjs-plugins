import { beforeEach, describe, it, expect } from "vitest";
import { Backpack } from "../server/src/domain/Backpack";
import { backpackItem, potion } from "./fixtures/item";
import { Inventory } from "../server/src/domain/Inventory";
import Equipment from "../server/src/domain/Equipment";

beforeEach(() => {
});

describe('backpack immutability', () => {
    it('items should be immutable', () => {
        const backpack = new Backpack('main', 32);

        const items = backpack.items;

        backpack.addItem(backpackItem(potion({ nb: 5 }), 0));

        expect(items.length).toBe(0);
    });

    it('update quantity should be immutable', () => {
        const inventory = new Inventory([new Backpack('main', 32)], new Equipment());

        inventory.addItem(potion({ nb: 5 }));

        let item = inventory.getBackpack('main').items[0];

        inventory.updateQuantityOfSlot({ backpack: 'main', slot: 0 }, 10);

        expect(item.nb).toBe(5);

        item = inventory.getBackpack('main').items[0];

        expect(item.nb).toBe(10);
    });

    it('inventory add item should be immutable', () => {
        const inventory = new Inventory([new Backpack('main', 32)], new Equipment());

        inventory.addItem(potion({ nb: 150 }));

        let item = inventory.getBackpack('main').items[0];

        inventory.addItem(potion({ nb: 150 }));

        expect(item.nb).toBe(150);

        const items = inventory.getBackpack('main').items;

        expect(items[0].nb).toBe(200);
        expect(items[1].nb).toBe(100);
    });
});
