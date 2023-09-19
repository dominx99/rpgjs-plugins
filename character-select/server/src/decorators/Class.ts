import { Class as RPGClass } from '@rpgjs/database';
import { ClassOptions as RPGClassOptions } from "@rpgjs/database/src/class";
import ClassGraphics from '../graphics/ClassGraphics';

export interface ClassOptions extends RPGClassOptions {
    graphics: ClassGraphics,
}

export function Class(options: ClassOptions): (target: any, propertyKey: any) => void {
    return function (target: any) {
        RPGClass(options)(target);
    };
}
