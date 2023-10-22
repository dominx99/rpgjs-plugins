import { ItemType } from "../enum/ItemType";
import { Armor, ArmorOptions } from "./Armor";

export function Plate(options: ArmorOptions): (target: any, propertyKey: any) => void {
    return function(target: any, propertyKey: any) {
        options.type = ItemType.Plate;
        Armor(options)(target, propertyKey);
    };
}
