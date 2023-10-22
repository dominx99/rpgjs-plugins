import { RpgPlayer, RpgModule, RpgServer, RpgServerEngine } from '@rpgjs/server';
import { beforeEach, describe, expect, it, afterEach, vi } from 'vitest';
import player from './../server/player';
import { RpgClientEngine } from '@rpgjs/client';
import { Potion, Sword, item, potion } from './fixtures/item';
import { NativeItems } from '../server/src/utils/NativeItems';
import { BackpackItem } from '../server/src/domain/BackpackItem';
import { clear } from '@rpgjs/testing';
import { ConsumeItem } from '../server/src/service/ConsumeItem';
import { NativeInventoryItem } from "../server/src/interfaces/NativeInventoryItem";
import { _beforeEach } from '../../tests/unit-tests/specs/beforeEach';

/** @ts-ignore */
@RpgModule<RpgServer>({
    player,
    database: [
        Potion,
    ]
})
class RpgServerModule { }

let currentPlayer: RpgPlayer;
let client: RpgClientEngine
let server: RpgServerEngine

beforeEach(async () => {
    const res = await _beforeEach([{
        server: RpgServerModule
    }]);
    currentPlayer = res.player;
    currentPlayer.graphics = {
        base: [],
    };
    client = res.client;
    server = res.server;
});

describe('consume item', () => {
    it('decrease quantity of item', () => {
        currentPlayer.addItem(Potion, 5);
        currentPlayer.inventory.addItem(potion({ nb: 5 }))

        const nativePotion = NativeItems.findItemById(currentPlayer, 'potion') as NativeInventoryItem;

        ConsumeItem.byPlayer(currentPlayer, nativePotion, { backpack: 'main', slot: 0 });
        const backpackItem = currentPlayer.inventory.getBackpackItem('main', 0) as BackpackItem;

        expect(backpackItem.itemId).toBeDefined();
        expect(backpackItem.nb).toBe(4);

        expect(NativeItems.findItemById(currentPlayer, backpackItem.itemId)?.nb).toBe(4);
    });

    it('does not decrease quantity of item if not consumable', () => {
        currentPlayer.addItem(Sword, 1);
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }))

        const sword = NativeItems.findItemById(currentPlayer, 'sword') as NativeInventoryItem;

        expect(() => ConsumeItem.byPlayer(currentPlayer, sword, { backpack: 'main', slot: 0 }))
            .toThrowError('Item is not consumable');

        const backpackItem = currentPlayer.inventory.getBackpackItem('main', 0) as BackpackItem;

        expect(backpackItem.itemId).toBeDefined();
        expect(backpackItem.nb).toBe(1);

        expect(NativeItems.findItemById(currentPlayer, backpackItem.itemId)?.nb).toBe(1);
    });

    it('does nothing if item is not defined', () => {
        currentPlayer.inventory.addItem(potion({ nb: 10 }));

        const sword = {
            item: {},
            nb: 1,
        } as NativeInventoryItem;

        ConsumeItem.byPlayer(currentPlayer, sword, { backpack: 'main', slot: 1 });

        const backpackItem = currentPlayer.inventory.getBackpackItem('main', 0) as BackpackItem;

        expect(backpackItem.nb).toBe(10);
    });
});

afterEach(() => {
    clear()
})
