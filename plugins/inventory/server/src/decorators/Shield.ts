import { ItemType } from "../enum/ItemType";
import { Armor, ArmorOptions } from "./Armor";

export function Shield(options: ArmorOptions): (target: any, propertyKey: any) => void {
    return function(target: any, propertyKey: any) {
        options.type = ItemType.Shield;
        Armor(options)(target, propertyKey);
    };
}
