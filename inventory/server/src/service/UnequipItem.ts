import { RpgPlayer } from "@rpgjs/server";
import { ItemType } from "../enum/ItemType";
import { NativeItems } from "../utils/NativeItems";

export class UnequipItem {
    static byPlayer(player: RpgPlayer, itemType: ItemType) {
        const itemToUnEquip = player.inventory.equipment.equipped(itemType);
        if (!itemToUnEquip) {
            return;
        }

        const nativeItem = NativeItems.findItemById(player, itemToUnEquip.id);
        if (!nativeItem || !nativeItem?.item.equipped) {
            return;
        }

        player.equip(itemToUnEquip.id, false);
        player.inventory.equipment[itemType] = null;
        player.inventory.addItem({
            itemId: itemToUnEquip.id,
            type: nativeItem.item.type,
            nb: 1,
        });

        player.server.module.emit('onUnequip', [player, nativeItem.item.id])
    }
}
