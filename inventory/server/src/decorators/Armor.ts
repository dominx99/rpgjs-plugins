import { Armor as RPGArmor } from '@rpgjs/database';
import { ArmorOptions as RPGArmorOptions } from "@rpgjs/database/src/armor";
import { TypeOfItem } from '../enum/ItemType';
import { ItemCommon, RPGItemCommon } from './ItemCommon';
import { Equippable } from '../interfaces/Equippable';

export interface ArmorOptions extends RPGArmorOptions, Equippable, ItemCommon, TypeOfItem {
}

export function Armor(options: ArmorOptions): (target: any, propertyKey: any) => void {
    return function (target: any) {
        RPGArmor(options)(target);
        RPGItemCommon(options)(target);
        target.type = options.type;
        target.equippable = options.equippable;
    };
}
