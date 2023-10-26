import { Slot } from "../domain/Inventory";

export function areSlotsSame(a: Slot, b: Slot): boolean {
    return a.slot === b.slot && a.backpack === b.backpack;
}

export function isSlotIncluded(slots: Slot[], slot: Slot): boolean {
    return slots.some(s => areSlotsSame(s, slot));
}
