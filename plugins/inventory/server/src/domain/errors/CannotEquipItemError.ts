export class CannotEquipItemError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CannotEquipItemError';
    }
}
