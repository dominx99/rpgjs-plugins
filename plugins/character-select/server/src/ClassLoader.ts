import { RpgPlayer } from "@rpgjs/server";

export default class ClassLoader {
    static load(player: RpgPlayer, userData: any) {
        if (!userData) {
            return;
        }

        const json = JSON.parse(userData);

        /** It is required because engine load method restores only id of class */
        if (json._class && json._class.id) {
            player.setClass(json._class.id);
        }
    }
}
