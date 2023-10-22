import { EquippedGraphics } from "../interfaces/EquippedGraphics";

export interface ItemCommon {
    displayName?: string,
    graphic?: EquippedGraphics,
    icon: string,
}

export function RPGItemCommon(options: ItemCommon) {
    return function (target: any) {
        target.displayName = options.displayName;
        target.graphic = options.graphic;
        target.icon = options.icon;
    };
}
