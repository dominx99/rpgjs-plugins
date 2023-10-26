import { RpgPlayer } from "@rpgjs/server"

export const itemSchemas = {
    ...RpgPlayer.schemas.items[0].item,
    displayName: String,
    consumable: Boolean,
    equippable: Boolean,
    icon: String,
    graphic: String,
    type: String,
    atk: String,
    pdef: String,
}

export const backpackItemSchema = {
    itemId: String,
    type: String,
    slot: Number,
    nb: Number,
}

export const backpackSchema = {
    id: String,
    size: Number,
    items: [
        backpackItemSchema
    ]
}

export const equipmentItemSchema = {
    id: String,
    type: String,
}

export const inventorySchemas = {
    backpacks: [
        backpackSchema
    ],
    equipment: {
        items: [equipmentItemSchema]
    }
}
