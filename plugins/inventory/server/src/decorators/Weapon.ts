import { Weapon as RPGWeapon } from '@rpgjs/database';
import { WeaponOptions as RPGWeaponOptions } from "@rpgjs/database/src/weapon";
import { TypeOfItem } from '../enum/ItemType';
import { Equippable } from '../interfaces/Equippable';
import { ItemCommon, RPGItemCommon } from './ItemCommon';

export interface WeaponOptions extends RPGWeaponOptions, ItemCommon, Equippable, TypeOfItem {
}

export function Weapon(options: WeaponOptions): (target: any, propertyKey: any) => void {
    return function(target: any) {
        RPGWeapon(options)(target);
        RPGItemCommon(options)(target);
        target.type = options.type;
        target.equippable = options.equippable;
    };
}
