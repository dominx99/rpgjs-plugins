import { RpgPlayer } from "@rpgjs/server";
import { UnequipItem } from "./UnequipItem";
import { NativeItems } from "../utils/NativeItems";
import { Slot } from "../domain/Inventory";
import { ItemType } from "../enum/ItemType";

export class EquipItem {
    public static async byPlayer(player: RpgPlayer, slot: Slot) {
        try {

            const backpackItem = player.inventory.getBackpackItemBySlot(slot);
            if (!backpackItem) {
                return;
            }
            const nativeItem = NativeItems.findItemById(player, backpackItem.itemId);
            if (!nativeItem) {
                return;
            }

            if (!nativeItem.item.type || !nativeItem.item.id) {
                throw new Error('Item type is not defined');
            }

            const ret: (undefined | boolean)[] = await player.server.module.emit(
                'server.player.canEquip',
                [player, nativeItem],
                true
            );

            if (ret.some(r => r === false)) {
                return
            }

            const itemType: ItemType = nativeItem.item.type;

            const itemToUnequip = player.inventory.equipment.equipped(itemType);

            player.inventory.removeBySlot(slot);

            if (itemToUnequip) {
                UnequipItem.byPlayer(player, itemType);
            }

            player.inventory.equipment.equip({ id: nativeItem.item.id, type: itemType });
            player.equip(nativeItem.item.id, true);

            player.server.module.emit('server.player.onEquip', [player, nativeItem.item.id], true);
        } catch (e: any) {
            player.server.module.emit('server.player.onEquipFailed', [player, e], true);
        }
    }
}
