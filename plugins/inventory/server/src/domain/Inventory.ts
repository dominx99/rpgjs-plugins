import { RpgPlayer } from "@rpgjs/server";
import { Backpack } from "./Backpack";
import { BackpackItem } from "./BackpackItem";
import { areSlotsSame } from "../utils/InventoryUtils";
import Equipment from "./Equipment";

export const STACK_LIMIT = 200;

export interface Slot {
    backpack: string;
    slot: number;
}

interface ItemToInventory {
    itemId: string;
    type: string;
    nb: number;
}

export interface AddItemResult {
    amountOverSpace: number;
}

export interface Inventory {
    backpacks: Backpack[];

    addItem(item: ItemToInventory): AddItemResult;
    hasItem(itemId: string): boolean;
    replaceItems(from: Slot, to: Slot): void;
    moveItemToEmptySlot(from: Slot, to: Slot, quantityToMove?: number): void;
    stackItems(from: Slot, to: Slot): void;
    decreaseQuantityOfSlot(slot: Slot, quantity: number): void;
    removeByItemId(itemId: string, nb?: number): void;
}

export class Inventory {
    backpacks: Backpack[];
    equipment: Equipment;

    constructor(backpacks: Backpack[], equipment: Equipment) {
        this.backpacks = backpacks;
        this.equipment = equipment;
    }

    addItem(item: ItemToInventory): AddItemResult {
        if (item.itemId === null || item.type === null) {
            throw new Error('Item is not valid');
        }

        if (item.nb < 0) {
            throw new Error('Item quantity cannot be negative');
        }

        let remainsToBeFilledCount = this.fillExistingStacks(item);

        if (remainsToBeFilledCount <= 0) {
            return {
                amountOverSpace: 0,
            };
        }

        const slotsNeeded = Math.ceil(remainsToBeFilledCount / STACK_LIMIT);

        this.getEmptySlots(slotsNeeded).forEach((slot) => {
            let fillBy = remainsToBeFilledCount <= STACK_LIMIT ? remainsToBeFilledCount : STACK_LIMIT;

            this.getBackpack(slot.backpack).addItem(new BackpackItem({
                slot: slot.slot,
                itemId: item.itemId,
                type: item.type,
                nb: fillBy,
            }));

            remainsToBeFilledCount -= fillBy;
        });

        return {
            amountOverSpace: remainsToBeFilledCount,
        }
    }

    replaceItems(from: Slot, to: Slot): void {
        const fromItem = this.getBackpackItemBySlot(from);
        const toItem = this.getBackpackItemBySlot(to);

        if (!fromItem || !toItem) {
            return;
        }

        this.updateBackpackItemBySlot(new BackpackItem({
            ...fromItem,
            slot: toItem.slot,
        }), to);

        this.updateBackpackItemBySlot(new BackpackItem({
            ...toItem,
            slot: fromItem.slot,
        }), from);
    }

    stackItems(from: Slot, to: Slot, quantityToMove?: number): void {
        const fromItem = this.getBackpackItemBySlot(from);
        const toItem = this.getBackpackItemBySlot(to);

        if (!fromItem || !toItem) {
            // TODO: Add throw error & error handling
            return;
        }

        quantityToMove = quantityToMove || fromItem.nb;

        if (fromItem.isNot(toItem)) {
            throw new Error('Cannot stack different items');
        }

        if (quantityToMove + toItem.nb > STACK_LIMIT) {
            const diff = quantityToMove + toItem.nb - STACK_LIMIT;

            this.updateQuantityOfSlot(to, STACK_LIMIT);
            this.updateQuantityOfSlot(from, (fromItem.nb - quantityToMove) + diff);

            return;
        }

        this.updateQuantityOfSlot(to, quantityToMove + toItem.nb);
        this.decreaseQuantityOfSlot(from, quantityToMove);
    }

    moveItemToEmptySlot(from: Slot, to: Slot, quantityToMove?: number): void {
        const fromItem = this.getBackpackItemBySlot(from);

        if (!fromItem) {
            throw new Error('Item not found');
        }

        quantityToMove = quantityToMove || fromItem.nb;

        if (!this.getBackpack(to.backpack).isInRange(to.slot)) {
            throw new Error('Target slot is not in range');
        }

        if (this.getBackpackItemBySlot(to)) {
            throw new Error('Target slot is not empty');
        }

        if (quantityToMove > fromItem.nb) {
            throw new Error('Not enough quantity of item');
        }

        this.decreaseQuantityOfSlot(from, quantityToMove);
        this.addBackpackItemToSlot(new BackpackItem({
            ...fromItem,
            nb: quantityToMove
        }), to);
    }

    moveItem(from: Slot, to: Slot, quantityToMove?: number): void {
        if (areSlotsSame(from, to)) {
            return;
        }

        const fromItem = this.getBackpackItemBySlot(from);
        const toItem = this.getBackpackItemBySlot(to);

        if (!fromItem) {
            return;
        }

        if (!toItem) {
            this.moveItemToEmptySlot(from, to, quantityToMove);

            return;
        }

        if (fromItem.is(toItem)) {
            this.stackItems(from, to, quantityToMove);

            return;
        }

        this.replaceItems(from, to);
    }

    addBackpackItemToSlot(item: BackpackItem, slot: Slot) {
        if (item.nb > STACK_LIMIT) {
            throw new Error('Item is too big to be added to slot');
        }

        this.getBackpack(slot.backpack).addItem(new BackpackItem({
            ...item,
            slot: slot.slot,
        }));
    }

    static load(inventory: any): Inventory {
        return new Inventory(
            inventory.backpacks.map((backpack: any) => Backpack.load(backpack)),
            Equipment.load(inventory?.equipment),
        );
    }

    private fillExistingStacks(item: ItemToInventory): number {
        if (item.itemId === null || item.type === null) {
            throw new Error('Item is not valid');
        }

        let remainsToBeFilledCount = item.nb;

        this.findSlotsByItemId(item.itemId).forEach((slot) => {
            const itemStack = this.getBackpackItemBySlot(slot);

            if (!itemStack) {
                return;
            }

            const currentCountInStack = itemStack.nb;

            if (currentCountInStack < STACK_LIMIT) {
                const spaceInSlot = STACK_LIMIT - currentCountInStack;

                if (spaceInSlot >= remainsToBeFilledCount) {
                    this.incrementItemStack(slot, remainsToBeFilledCount);
                    remainsToBeFilledCount = 0;
                } else {
                    this.incrementItemStack(slot, spaceInSlot);
                    remainsToBeFilledCount -= spaceInSlot;
                }
            }
        });

        return Math.max(remainsToBeFilledCount, 0);
    }

    /*
        If slotsNeeded is 3 it may return 2 slots from one backpack and 1 slot from another
        If slotsNeeded is 3 it may return 1 slot if there is no more space in other backpacks
    */
    private getEmptySlots(slotsNeeded: number): Slot[] {
        const slots: Slot[] = [];

        for (const backpack of this.backpacks) {
            slots.push(...backpack.getEmptySlots(slotsNeeded));

            if (slots.length >= slotsNeeded) {
                return slots;
            }
        }

        return slots;
    }

    hasEmptySlot(): boolean {
        return this.backpacks.some((backpack) => backpack.hasEmptySlot());
    }

    findSlotsByItemId(itemId: string): Slot[] {
        return this.backpacks.map((backpack) => {
            return backpack.findSlotsByItemId(itemId);
        }).flat();
    }

    showFullNotification(player: RpgPlayer) {
        player.showNotification('Your inventory is full');
    }

    decreaseQuantityOfSlot(slot: Slot, quantity: number): void {
        const item = this.getBackpackItemBySlot(slot);

        if (quantity <= 0) {
            throw new Error('Cannot decrease quantity by negative value');
        }

        if (!item) {
            return;
        }

        if ((item.nb - quantity) <= 0) {
            this.removeBySlot(slot);

            return;
        }

        this.updateQuantityOfSlot(slot, item.nb - quantity);
    }

    removeBySlot(slot: Slot) {
        this.getBackpack(slot.backpack).items.removeBySlot(slot.slot);
    }

    incrementItemStack(slot: Slot, count: number): void {
        const item = this.getBackpack(slot.backpack).items.findBySlot(slot.slot);

        if (!item) {
            return;
        }

        this.updateQuantityOfSlot(slot, item.nb + count);
    }

    updateQuantityOfSlot(slot: Slot, count: number): void {
        const item = this.getBackpackItemBySlot(slot);

        if (!item) {
            return;
        }

        this.updateBackpackItemBySlot(new BackpackItem({
            ...item,
            nb: count
        }), slot);
    }

    spaceInInventoryForCount(itemId: string, nb: number): number {
        let spaceCount = 0;

        this.findSlotsByItemId(itemId)
            .forEach((slot) => {
                spaceCount += this.spaceInSlot(slot);
            });

        if (spaceCount >= nb) {
            return nb;
        }

        const slotsNeeded = Math.ceil(nb - spaceCount / STACK_LIMIT);
        const emptySlotsCount = this.getEmptySlots(slotsNeeded).length;

        spaceCount += emptySlotsCount * STACK_LIMIT;

        if (spaceCount >= nb) {
            return nb;
        }

        return spaceCount;
    }

    spaceInSlot(slot: Slot): number {
        const itemStack = this.getBackpackItemBySlot(slot)

        if (!itemStack) {
            return 0;
        }

        return STACK_LIMIT - itemStack.nb;
    }

    getBackpackItem(backapack: string, slot: number): Readonly<BackpackItem> | null {
        return this.getBackpack(backapack).findBySlot(slot);
    }

    getBackpackItemBySlot(slot: Slot): BackpackItem | null {
        return this.getBackpackItem(slot.backpack, slot.slot);
    }

    updateBackpackItemBySlot(backpackItem: BackpackItem, slot: Slot) {
        this.getBackpack(slot.backpack).updateBackpackItemBySlot(backpackItem, slot.slot);
    }

    getBackpack(id: string): Backpack {
        const backpack = this.backpacks.find((backpack) => backpack.id === id);

        if (!backpack) {
            throw new Error(`No such backpack ${id}`);
        }

        return backpack;
    }

    hasItem(itemId: string): boolean {
        let hasItem = false;

        Object.values(this.backpacks).forEach((backpack) => {
            if (backpack.hasItem(itemId)) {
                hasItem = true;
            }
        });

        return hasItem;
    }

    removeByItemId(itemId: string, nb: number = 1) {
        let remainsToBeRemovedCount = nb;

        this.findSlotsByItemId(itemId).forEach(slot => {
            const backpackItem = this.getBackpackItemBySlot(slot);

            if (!backpackItem) {
                return;
            }

            if (backpackItem.nb <= remainsToBeRemovedCount) {
                this.decreaseQuantityOfSlot(slot, backpackItem.nb);

                remainsToBeRemovedCount -= backpackItem.nb;

                return;
            }

            this.decreaseQuantityOfSlot(slot, remainsToBeRemovedCount);
            remainsToBeRemovedCount = 0;
        });
    }

    dump() {
        this.backpacks.forEach((backpack) => {
            console.log('backpack', backpack.id, backpack.size);

            backpack.items.forEach((item) => {
                console.log('item', item);
            });
        });
    }
}
