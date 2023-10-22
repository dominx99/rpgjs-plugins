import { ItemOptions as RPGItemOptions } from "@rpgjs/database/src/item";
import { Item as RPGItem } from "@rpgjs/database";
import { ItemCommon, RPGItemCommon } from "./ItemCommon";

export interface ItemOptions extends RPGItemOptions, ItemCommon {
}

export function Item(options: ItemOptions): (target: any, propertyKey: any) => void {
    return function (target: any) {
        RPGItem(options)(target);
        RPGItemCommon(options)(target);
    };
}
