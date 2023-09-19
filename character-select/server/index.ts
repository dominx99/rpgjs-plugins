import { RpgServer, RpgModule, RpgPlayer } from '@rpgjs/server'
import StartingActors from './src/StartingActors';

/** @ts-ignore */
@RpgModule<RpgServer>({
    hooks: {
        player: ['onCharacterSelected'],
    },
    engine: {
        onStart() {
            console.log('started');
        }
    },
    player: {
        canAuth(player: RpgPlayer, userData: any, authGui: any): boolean {
            if (userData) {
                return true;
            }

            authGui.close();
            const gui = player.gui('rpg-character-select')
            gui.on('character-selected', async ({ actorId }: { actorId: string }) => {
                gui.close();
                const { start } = player.server.globalConfig;

                player.server.module.emit('server.player.onCharacterSelected', [player, actorId], true);
                player.server.module.emit('server.player.onAuthSuccess', [player, userData], true)

                if (start) {
                    if (start.hitbox) player.setHitbox(...(start.hitbox as [number, number]))
                    if (start.graphic) player.setGraphic(start.graphic)
                    if (start.map) await player.changeMap(start.map)
                }
            });

            const { actors } = player.server.globalConfig.characterSelect;

            const actorClasses = actors.map((actor: any) => player.databaseById(actor));

            gui.open({
                actors: StartingActors.instantiateActorDecorators(actorClasses),
            });

            return false;
        },
    }
})
export default class RpgServerModule { }
