import { ItemModel as RPGItemModel } from "@rpgjs/server/lib/models/Item";
import { ItemType } from "../enum/ItemType";
import { EquippedGraphics } from "./EquippedGraphics";

type ItemEntity = RPGItemModel & {
    equippable: boolean,
    displayName: string,
    type: ItemType,
    icon: string,
    graphic?: EquippedGraphics;
    atk?: number;
    pdef?: number;
};

export { ItemEntity };
