import { RpgPlayer } from "@rpgjs/server";
import { ItemEntity } from "../inventory/interfaces/ItemModel";
import ClassGraphics from "./ClassGraphics";

export interface PlayerGraphics {
    base: string[],
    equipped: EquippedGraphics,
}

export interface EquippedGraphics {
    head?: string,
    torso?: string,
    legs?: string,
}

export class GraphicsOfPlayer {
    static sync(player: RpgPlayer) {
        const classGraphics = player._class.graphics as ClassGraphics;

        /** @ts-ignore */
        const equipment = player.equipments as { [key: string]: ItemEntity };

        let equippedGraphics: EquippedGraphics = Object.assign({}, classGraphics.baseEquipment);

        Object.values(equipment).forEach((equipment: ItemEntity) => {
            if (equipment.graphic !== undefined) {
                Object.entries(equipment.graphic as EquippedGraphics).forEach(([key, graphic]: [string, string]) => {
                    if (graphic !== undefined) {
                        equippedGraphics[key] = graphic;
                    }
                });
            }
        });

        const equippedGraphicsResult: string[] = Object.values(equippedGraphics as EquippedGraphics)
            .filter((graphic: string) => graphic !== undefined)
        ;

        const graphics = [
            ...classGraphics.pernament,
            ...equippedGraphicsResult.flat(),
            ...classGraphics.animations
        ]

        player.setGraphic(graphics);

        console.log('set graphics', graphics);

        player.graphics = {
            base: classGraphics.pernament,
            equipped: equippedGraphics,
        };
    }
}
