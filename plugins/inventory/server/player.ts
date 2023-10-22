import { RpgPlayer, RpgPlayerHooks } from "@rpgjs/server";
import { Inventory } from './src/domain/Inventory';
import { Backpack } from "./src/domain/Backpack";
import { inventorySchemas, itemSchemas } from "./src/schemas/InventorySchemas";
import { Utils } from "@rpgjs/common";
import Equipment from "./src/domain/Equipment";

declare module '@rpgjs/server' {
    export interface RpgPlayer {
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
    },
}

const originalInitializeMethod = RpgPlayer.prototype.initialize;
RpgPlayer.prototype.initialize = function() {
    originalInitializeMethod.apply(this);

    this.inventory = new Inventory([new Backpack('main', 32) ], new Equipment());
}

export default player;
