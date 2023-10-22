import { RpgPlayer } from "@rpgjs/server";
import { Slot } from "../domain/Inventory";
import { NativeInventoryItem } from "../interfaces/NativeInventoryItem";

export class ConsumeItem {
    static byPlayer(player: RpgPlayer, nativeItem: NativeInventoryItem, slot: Slot) {
        if (!nativeItem.item.id) {
            return;
        }

        if (!nativeItem.item.consumable) {
            throw new Error('Item is not consumable');
        }

        player.useItem(nativeItem.item?.id);

        player.inventory.decreaseQuantityOfSlot(slot, 1);
    }
}
