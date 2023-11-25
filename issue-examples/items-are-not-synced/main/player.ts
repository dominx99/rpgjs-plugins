import { RpgPlayer, type RpgPlayerHooks, Control, Components } from '@rpgjs/server'
import Potion from './database/Potion'
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

        if (input == Control.Action) {
            console.log(player.items);
        }
    },
    async onJoinMap(player: RpgPlayer) {
        player.gui('inventory').open();

        player.addItem(Sword, 1);

        setTimeout(() => {
            player.addItem(Potion, 1);
        }, 5000);
    }
}

export default player
