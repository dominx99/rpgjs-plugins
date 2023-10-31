import { BackpackItem } from "./BackpackItem";
import { BackpackItems } from "./BackpackItems";
import { Slot } from "./Inventory";

export class Backpack {
    readonly id: string;
    readonly size: number;
    readonly items: Readonly<BackpackItems>;

    constructor(id: string, size: number, items?: BackpackItems) {
        this.id = id;
        this.size = size;
        this.items = items || new BackpackItems();
    }

    findBySlot(slot: number): BackpackItem | null {
        return this.items.findBySlot(slot);
    }

    static load(backpack: any): Backpack {
        return new Backpack(backpack.id, backpack.size, new BackpackItems(
            ...backpack.items.map((item: any) => new BackpackItem(item)
            )));
    }

    findSlotsByItemId(itemId: string): Slot[] {
        return this.items
            .filter((item) => item.itemId === itemId)
            .sort((a, b) => a.slot - b.slot)
            .map((item) => ({
                slot: item.slot,
                backpack: this.id,
            }))
            ;
    }

    getEmptySlots(slotsNeeded: number): Slot[] {
        const slots: Slot[] = [];

        for (let i = 0; i < this.size; i++) {
            if (!this.items.find((item) => item.slot === i)) {
                slots.push({
                    slot: i,
                    backpack: this.id,
                });
            }

            if (slots.length >= slotsNeeded) {
                return slots;
            }
        }

        return slots;
    }

    hasEmptySlot(): boolean {
        return this.size > this.items.length;
    }

    addItem(item: BackpackItem) {
        this.items = new BackpackItems(
            ...this.items,
            item
        );
    }

    isInRange(to: number) {
        return to >= 0 && to < this.size;
    }

    /* You should not use this method to update slot on the backpackItem */
    updateBackpackItemBySlot(backpackItem: BackpackItem, slot: number): void {
        const index = this.items.findIndex(item => item.slot === slot);

        if (index === -1) {
            return;
        }

        this.items[index] = backpackItem;
    }
}
