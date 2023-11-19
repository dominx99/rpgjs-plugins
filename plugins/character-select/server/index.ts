import { RpgServer, RpgModule, RpgPlayer } from '@rpgjs/server'
import StartingActors from './src/StartingActors';
import ClassLoader from './src/ClassLoader';

/** @ts-ignore */
@RpgModule<RpgServer>({
    hooks: {
        player: ['onCharacterSelected'],
    },
    player: {
        canAuth(player: RpgPlayer, userData: any, authGui: any): boolean {
            ClassLoader.load(player, userData);

            if (userData) {
                return true;
            }

            const { actors, gui } = player.server.globalConfig.characterSelect;

            authGui.close();
            const guiInstance = player.gui(gui || 'rpg-character-select')
            guiInstance.on('character-selected', async ({ actorId }: { actorId: string }) => {
                guiInstance.close();
                const { start } = player.server.globalConfig;

                player.server.module.emit('server.player.onCharacterSelected', [player, actorId], true);
                player.server.module.emit('server.player.onAuthSuccess', [player, userData], true)

                if (start) {
                    if (start.hitbox) player.setHitbox(...(start.hitbox as [number, number]))
                    if (start.graphic) player.setGraphic(start.graphic)
                    if (start.map) await player.changeMap(start.map)
                }
            });

            const actorClasses = actors.map((actor: any) => player.databaseById(actor));

            guiInstance.open({
                actors: StartingActors.instantiateActorDecorators(actorClasses),
            });

            return false;
        },
    }
})
export default class RpgServerModule { }
