export class BackpackItem {
    readonly slot: number;
    readonly itemId: string;
    readonly type: string;
    readonly nb: number;

    constructor({
        slot,
        itemId,
        type,
        nb,
    }) {
        this.slot = slot;
        this.itemId = itemId;
        this.type = type;
        this.nb = nb;
    }

    is(other: BackpackItem) {
        return this.itemId === other.itemId && this.type === other.type;
    }

    isNot(other: BackpackItem) {
        return !this.is(other);
    }
}
