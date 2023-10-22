import { BackpackItem } from './BackpackItem';

export class BackpackItems extends Array<BackpackItem> {
    findBySlot(slot: number): BackpackItem | null {
        const res = this.find((item) => item.slot === slot);

        return res || null;
    }

    removeBySlot(slot: number): void {
        const item = this.findBySlot(slot);

        if (!item) {
            return;
        }

        this.splice(this.findIndex((item) => item.slot === slot), 1);
    }
}
