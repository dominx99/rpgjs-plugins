import { RpgPlayer, RpgModule, RpgServer } from '@rpgjs/server';
import { clear } from '@rpgjs/testing';
import { beforeEach, afterEach, expect, describe, it, vi } from 'vitest';
import player from './../server/player';
import { RpgClientEngine } from '@rpgjs/client';
import { _beforeEach } from './beforeEach';
import { EquipItem } from '../server/src/service/EquipItem';
import { Sword, item } from './fixtures/item';
import { UseItem } from '../server/src/service/UseItem';
import { BackpackItem } from '../server/src/domain/BackpackItem';
import { NativeItems } from '../server/src/utils/NativeItems';
import { NativeInventoryItem } from "../server/src/interfaces/NativeInventoryItem";
import { UnequipItem } from '../server/src/service/UnequipItem';
import { ItemType } from '../server/src/enum/ItemType';
import Equipment from '../server/src/domain/Equipment';

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

describe('equipment', () => {
    it('is initialized', () => {
        expect(currentPlayer.inventory.equipment).toBeDefined();
    });

    it('equip item', () => {
        currentPlayer.inventory.equipment.equip({ id: 'sword', type: 'weapon' });
        expect(() => currentPlayer.inventory.equipment.equip({ id: 'sword', type: 'weapon' }))
            .toThrowError('Item already equipped');

        expect(currentPlayer.inventory.equipment.items.length).toBe(1);
    });

    it('unequip item', () => {
        currentPlayer.inventory.equipment.equip({ id: 'sword', type: 'weapon' });
        currentPlayer.inventory.equipment.unequip('weapon');

        expect(currentPlayer.inventory.equipment.items.length).toBe(0);
    });
});

describe('inventory & equipment proxy', () => {
    it('equip item', async () => {
        currentPlayer.addItem(Sword, 1);
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }));

        await EquipItem.byPlayer(currentPlayer, { backpack: 'main', slot: 0 });

        expect(currentPlayer.inventory.getBackpackItem('main', 0)).toBeNull();
        expect(currentPlayer.inventory.equipment.items.length).toBe(1);
    });

    it('removes item from inventory after equip', async () => {
        currentPlayer.addItem(Sword, 1);
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }));

        await UseItem.fromInventory(currentPlayer, { backpack: 'main', slot: 0 }, 'sword');

        const backpackItem = currentPlayer.inventory.getBackpackItem('main', 0) as BackpackItem;

        expect(backpackItem).toBeNull();
    });

    it('updates equipped items', async () => {
        currentPlayer.addItem(Sword, 1);
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }));

        await UseItem.fromInventory(currentPlayer, { backpack: 'main', slot: 0 }, 'sword');

        const backpackItem = currentPlayer.inventory.getBackpackItem('main', 0) as BackpackItem;

        expect(backpackItem).toBeNull();

        expect(currentPlayer.inventory.equipment.equipped(ItemType.Weapon)).toMatchObject({
            id: 'sword',
            type: ItemType.Weapon,
        });

        const nativeItem = NativeItems.findItemById(currentPlayer, 'sword') as NativeInventoryItem;

        expect(nativeItem.item.equipped).toBe(true);
    });

    it('unequip item', async () => {
        currentPlayer.addItem(Sword, 1);
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }));

        await UseItem.fromInventory(currentPlayer, { backpack: 'main', slot: 0 }, 'sword');

        expect(currentPlayer.inventory.getBackpackItem('main', 0)).toBeNull();

        expect(currentPlayer.inventory.equipment.equipped(ItemType.Weapon)).toMatchObject({
            id: 'sword',
            type: ItemType.Weapon,
        });

        let nativeItem = NativeItems.findItemById(currentPlayer, 'sword') as NativeInventoryItem;

        expect(nativeItem.item.equipped).toBe(true);

        UnequipItem.byPlayer(currentPlayer, ItemType.Weapon);

        nativeItem = NativeItems.findItemById(currentPlayer, 'sword') as NativeInventoryItem;

        expect(nativeItem.item.equipped).toBe(false);

        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.itemId).toBe('sword');
        expect(currentPlayer.inventory.getBackpackItem('main', 0)?.nb).toBe(1);
    })
});

describe('inventory hooks', () => {
    it('call onEquip and onUnequip hooks', async () => {
        currentPlayer.addItem(Sword, 1);
        currentPlayer.inventory.addItem(item({ itemId: 'sword' }));

        const spy = vi.spyOn(currentPlayer.server.module, 'emit');

        await EquipItem.byPlayer(currentPlayer, { backpack: 'main', slot: 0 });

        expect(spy).toHaveBeenCalledWith('server.player.canEquip', [currentPlayer, currentPlayer.items[0]], true);
        expect(spy).toHaveBeenCalledWith('server.player.onEquip', [currentPlayer, 'sword'], true);

        UnequipItem.byPlayer(currentPlayer, ItemType.Weapon);

        expect(spy).toHaveBeenCalledWith('server.player.onUnequip', [currentPlayer, 'sword'], true);
    });
});

describe('equipment load', () => {
    it('loads equipped items', () => {
        currentPlayer.inventory.equipment.equip({ id: 'sword', type: 'weapon' });

        const rawEquipment = JSON.parse(JSON.stringify(currentPlayer.inventory.equipment));

        const equipment = Equipment.load(rawEquipment);

        expect(equipment.items.length).toBe(1);
        expect(equipment.equipped(ItemType.Weapon)).toMatchObject({
            id: 'sword',
            type: ItemType.Weapon,
        });
    });

    it('creates a new equipment', () => {
        const equipment = Equipment.load(undefined);

        expect(equipment).toBeDefined();
        expect(equipment.items.length).toBe(0);
    });
});

afterEach(() => {
    clear();
});
