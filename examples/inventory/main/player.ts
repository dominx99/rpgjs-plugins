import { RpgPlayer, type RpgPlayerHooks, Control, Components } from '@rpgjs/server'
import Potion from './database/Potion'
import { Inventory, Backpack, Equipment } from 'rpgjs-inventory'
import { InventoryInteractionHooks } from './src/InventoryInteractionHooks'
import Sword from './database/Sword'

const player: RpgPlayerHooks = {
    onConnected(player: RpgPlayer) {
        player.name = 'YourName'
        player.setComponentsTop(Components.text('{name}'))
    },
    onInput(player: RpgPlayer, { input }) {
        if (input == Control.Back) {
            player.callMainMenu()
        }
    },
    onEquip(player: RpgPlayer, itemId: string) {
        console.log('onEquip', itemId)
    },
    async onJoinMap(player: RpgPlayer) {
        setTimeout(() => {
            player.gui('inventory').open();
        }, 1000)

        player.addItem(Potion, 500);
        player.inventory.addItem({
            itemId: 'hp-potion-1',
            type: 'item',
            nb: 500
        });

        let addedItem = player.addItem(Sword(), 1);
        player.inventory.addItem({
            itemId: addedItem.item.id,
            type: 'item',
            nb: 1
        });

        addedItem = player.addItem(Sword(), 1);
        player.inventory.addItem({
            itemId: addedItem.item.id,
            type: 'item',
            nb: 1
        });

        InventoryInteractionHooks.init(player);
    }
}

const originalInitializeMethod = RpgPlayer.prototype.initialize;
RpgPlayer.prototype.initialize = function() {
    originalInitializeMethod.apply(this);

    this.inventory = new Inventory([new Backpack('main', 30) ], new Equipment());
}

export default player
