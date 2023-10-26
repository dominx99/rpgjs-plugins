export interface EquippedGraphics {
    head?: string,
    torso?: string,
    legs?: string,
}

export default interface ClassGraphics {
    pernament: string[];
    animations: string[];
    baseEquipment: EquippedGraphics;
}
