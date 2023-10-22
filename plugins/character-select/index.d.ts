import { RpgPlayer } from "@rpgjs/server";

declare module '@rpgjs/server' {
    export interface RpgPlayerHooks {
        /**
         * This method is called at the end of character select process, when everything has worked.
         *
         * @prop { (player: RpgPlayer, dbData: string) => void } [onCharacterSelected]
         * @param {RpgPlayer} player - The RPG player object.
         * @param {string} actorId - Id of the selected actor.
         * @returns {void}
         * @memberof RpgPluginCharacterSelect
         * @since 1.1.0-rc.3
         * @example
         *
         * ```ts
         * import { RpgPlayer, RpgPlayerHooks } from '@rpgjs/server'

         * const player: RpgPlayerHooks = {
         *    onCharacterSelected(player: RpgPlayer, actorId: string) {
         *          console.log('Character selected', actorId);
         *    }
         * }
         * ```
         */
        onCharacterSelected?: (player: RpgPlayer, actorId: string) => void;
    }
}
