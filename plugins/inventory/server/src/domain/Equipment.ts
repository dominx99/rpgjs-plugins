export interface EquipmentItem {
    id: string;
    type: string;
}

export default class Equipment {
    items: EquipmentItem[] = [];

    static load(equipment: any): Equipment {
        if (!equipment) {
            return new Equipment();
        }

        return Object.assign(new Equipment(), equipment);
    }

    equipped(type: string): EquipmentItem | undefined {
        return this.items.find(item => item.type === type);
    }

    equip(item: EquipmentItem) {
        if (this.isEquipped(item.type)) {
            throw new Error('Item already equipped');
        }

        this.items.push(item);
    }

    unequip(type: string) {
        this.items = this.items.filter(item => item.type !== type);
    }

    isEquipped(type: string) {
        return this.items.some(item => item.type === type);
    }
}
