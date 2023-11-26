import { RpgPlayer } from "@rpgjs/server";
import { EquipItem } from "./EquipItem";
import { NativeItems } from "../utils/NativeItems";
import { Slot } from "../domain/Inventory";
import { ConsumeItem } from "./ConsumeItem";
import { CannotEquipItemError } from "../domain/errors/CannotEquipItemError";

export class UseItem {
    public static async fromInventory(player: RpgPlayer, slot: Slot, itemId: string) {
        const backpackItem = player.inventory.getBackpackItemBySlot(slot);

        if (!backpackItem || backpackItem.itemId !== itemId) {
            return;
        }

        const nativeInventoryItem = NativeItems.findItemById(player, backpackItem.itemId);

        if (!nativeInventoryItem) {
            throw new Error('Item not found');
        }

        try {
            if (nativeInventoryItem.item.consumable) {
                ConsumeItem.byPlayer(player, nativeInventoryItem, slot);

                return;
            }

            if (nativeInventoryItem.item.equippable) {
                await EquipItem.byPlayer(player, slot);

                return;
            }
        } catch (e: any) {
            console.error(e);
        }
    }
}
