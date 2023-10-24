import { RpgPlayer } from "@rpgjs/server";
import { Slot } from "rpgjs-inventory/server/src/domain/Inventory";
import { ItemType, EquipItem, UnequipItem, UseItem, ConsumeItem } from 'rpgjs-inventory'

export interface MoveItemContext {
    from: Slot,
    to: Slot,
    nb?: number,
}

export class InventoryInteractionHooks {
    static init(player: RpgPlayer) {
        player.off('inventory.slots.move');
        player.off('inventory.slots.drop');
        player.off('inventory.useItem');
        player.off('inventory.unEquip');

        player.on('inventory.unEquip', (itemType: ItemType) => InventoryInteractionHooks.onUnequip(player, itemType));
        player.on(
            'inventory.useItem',
            ({ itemId, slot }: { itemId: string, slot: Slot }) => InventoryInteractionHooks.onUseItem(player, slot, itemId)
        );
        player.on('inventory.slots.move', (context: MoveItemContext) => InventoryInteractionHooks.onMoveItem(player, context));
    }

    static onUnequip(player: RpgPlayer, itemType: ItemType) {
        try {
            if (!player.inventory.hasEmptySlot()) {
                player.inventory.showFullNotification(player);

                return;
            }
            UnequipItem.byPlayer(player, itemType);
        } catch (e: any) {
            console.error(e);
        }
    }

    static onUseItem(player: RpgPlayer, slot: Slot, itemId: string) {
        UseItem.fromInventory(player, slot, itemId);
    }

    static onMoveItem(player: RpgPlayer, { from, to, nb }: MoveItemContext) {
        if (nb != undefined && nb <= 0) {
            return;
        }

        player.inventory.moveItem(from, to, nb);
    }
}
