import { beforeEach, describe, it, expect } from "vitest";
import { Backpack } from "../server/src/domain/Backpack";
import { backpackItem, potion } from "./fixtures/item";

beforeEach(() => {

});

describe('backpack immutability', () => {
    it('items should be immutable', () => {
        const backpack = new Backpack('main', 32);

        const items = backpack.items;

        backpack.addItem(backpackItem(potion({ nb: 5 }), 0));

        expect(items.length).toBe(0);
    })
});
