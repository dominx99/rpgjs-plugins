import { Gui, RpgPlayer, RpgPlayerHooks } from "@rpgjs/server";
import { Inventory } from './src/domain/Inventory';
import { Backpack } from "./src/domain/Backpack";
import { inventorySchemas, itemSchemas } from "./src/schemas/InventorySchemas";
import { Utils } from "@rpgjs/common";
import Equipment from "./src/domain/Equipment";

declare module '@rpgjs/server' {
    export interface RpgPlayer {
        inventoryGui?: Gui;
        isInventoryOpened: boolean;

        inventory: Inventory,
    }
}

const player: RpgPlayerHooks = {
    props: {
        items: [{ nb: Number, item: itemSchemas }],
        equipments: [itemSchemas],
        inventory: inventorySchemas,
    },

    onAuthSuccess(player: RpgPlayer) {
        if (Utils.isObject(player.inventory)) {
            player.inventory = Inventory.load(player.inventory as any);
        }

        if (!player.inventory) {
            player.inventory = new Inventory([
                new Backpack('main', 32),
            ]);
        }

        player.inventoryGui = player.gui('inventory');
        player.isInventoryOpened = false;
    },

    onInput(player: RpgPlayer, { input }) {
        if (input == 'inventory') {
            if (player.isInventoryOpened) {
                player.inventoryGui?.close();
                player.isInventoryOpened = false;
            } else {
                player.inventoryGui?.open();
                player.isInventoryOpened = true;
            }
        }
    }
}

const originalInitializeMethod = RpgPlayer.prototype.initialize;
RpgPlayer.prototype.initialize = function() {
    originalInitializeMethod.apply(this);

    this.inventory = new Inventory([new Backpack('main', 32) ], new Equipment());
}

export default player;
