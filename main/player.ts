import { RpgPlayer, type RpgPlayerHooks, Control, Components } from '@rpgjs/server'
import ClassGraphics from 'rpgjs-character-select/server/src/graphics/ClassGraphics'

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
    async onJoinMap(player: RpgPlayer) {
    },
    onCharacterSelected(player: RpgPlayer, actorId: string) {
        player.setActor(actorId);
        console.log('actor set', actorId);
    },
    onAuthSuccess(player: RpgPlayer) {
        const graphics = player._class.graphics as ClassGraphics;

        player.setGraphic([
            ...graphics.pernament,
            ...Object.values(graphics.baseEquipment),
        ]);
    }
}

export default player
