<template>
    <div class="inventory">
        <img src="./inventory.png">

        <div class="equipment-container">
            <div v-on:dblclick="unEquipItem(equipment.weapon)" class="equipped-item weapon"
                v-if="equipment && equipment.weapon" style="z-index:100">
                <img class="graphic" :src="image(equipment.weapon.icon)">
            </div>
        </div>
        <div class="items-container">
            <div class="relative">
                <drag @dragstart="drag = true" @dragend="drag = false" v-for="item in mappedItems"
                    :style="{ 'z-index': 200 }" :data="item" :disabled="!item">
                    <InventoryItem class="item" v-if="item" :item="item" />
                    <div v-else class="item"></div>
                </drag>
            </div>
        </div>
        <div class="items-container" :style="dropStyles()">
            <div class="relative">
                <drop v-for="(item, slot) in mappedItems" @drop="(event: any) => onMoveItem(event, 'main', slot)">
                </drop>
            </div>
        </div>
    </div>

    <ConfirmAmountDialog v-if="moveCallback && split" @decline="declineMove()" @accept="amount => acceptMove(amount)">
        <template #title>How many do you want to split?</template>
    </ConfirmAmountDialog>
</template>

<script lang="ts">
import { Backpack } from 'rpgjs-inventory/server/src/domain/Backpack';
import { Slot } from 'rpgjs-inventory/server/src/domain/Inventory';
import { areSlotsSame } from 'rpgjs-inventory/server/src/utils/InventoryUtils';
import InventoryItem from './InventoryItem.vue';
import { Drag, Drop } from "vue-easy-dnd";
import ConfirmAmountDialog from './ConfirmAmountDialog.vue';

export default {
    name: 'inventory',
    inject: ['rpgCurrentPlayer', 'rpgResource', 'rpgSocket'],
    components: {
        Drag,
        Drop,
        InventoryItem,
        ConfirmAmountDialog
    },
    data: () => ({
        gold: 0,
        items: [],
        inventory: undefined,
        mappedItems: [],
        drag: false,
        spilled: false,
        dropCallback: null as Function | null,
        moveCallback: null as Function | null,
        shiftActive: false,
        split: false,
        equipment: null as any,
        originalEquipment: null,
        inventoryEquipment: null,
    }),
    mounted() {
        this.obsCurrentPlayer = this.rpgCurrentPlayer
            .subscribe((obj: any) => {
                if (!obj || !obj.object || !obj.object.inventory) return;

                this.gold = obj.object.gold;
                this.inventory = obj.object.inventory;
                this.items = obj.object.items;

                this.originalEquipment = obj.object.equipments;
                this.inventoryEquipment = obj.object.inventory.equipment;
                this.equipment = this.mapEquipment();
                this.mappedItems = this.mapItems();
            });
    },
    unmounted() {
        this.obsCurrentPlayer.unsubscribe()
    },
    methods: {
        onMoveItem(event: any, backpack: string, slot: number) {
            const item = event?.data;

            if (!item) {
                return;
            }

            /* TODO: Check if it's doing something after refactor */
            if (this.spilled) {
                this.spilled = false

                return;
            }

            const socket = this.rpgSocket()

            if (event.native.shiftKey) {
                this.split = true;
            }

            if (areSlotsSame(item.slot, {
                backpack: backpack,
                slot: slot,
            })) {
                this.split = false;
                this.drag = false;
                return;
            };

            const moveCallback = (amount?: number) => socket.emit('inventory.slots.move', {
                from: item.slot,
                to: {
                    backpack: backpack,
                    slot: slot,
                },
                nb: amount,
            });

            if (this.split) {
                this.moveCallback = moveCallback;
            } else {
                moveCallback(undefined);
            }

            this.drag = false;
        },
        dropStyles() {
            if (!this.drag) {
                return {};
            }

            return {
                'z-index': 999
            }
        },
        unEquipItem(item: any) {
            const socket = this.rpgSocket();

            if (!item.type) {
                console.error('No item type', item);
                return;
            }

            socket.emit('inventory.unEquip', item.type);
        },
        acceptMove(amount?: number) {
            this.moveCallback(amount);
            this.moveCallback = null;
            this.split = false;
        },
        declineMove() {
            this.moveCallback = null;
            this.split = false;
        },
        mapEquipment() {
            if (!this.inventoryEquipment || !this.originalEquipment) return null;

            const resultEquipment: any = {};

            const originalEquipment: { [key: string]: any } = this.originalEquipment;

            Object.values(this.inventoryEquipment.items as any).forEach((item) => {
                Object.values(originalEquipment as any).forEach((originalItem) => {
                    if (!originalItem || !item || originalItem.id !== item.id) {
                        return;
                    }

                    resultEquipment[item.type] = originalItem;
                })
            });

            return resultEquipment;
        },
        mapItems() {
            if (!this.inventory || !this.items) return [];

            const itemsMap = {};
            Object.values(this.items as any).forEach((item) => {
                if (!item || !item.item || !item.item.id) {
                    return;
                }

                itemsMap[item.item.id] = item;
            });

            const resultItems: any = [];

            const mainBackpack: Backpack = this.inventory.backpacks[0];

            if (!mainBackpack || !mainBackpack.items) {
                return [];
            }

            Array.from({ length: mainBackpack.size }).forEach((val, key) => {
                const backpackItem = this.getBackpackItemBySlot(mainBackpack, key);

                if (!backpackItem) {
                    resultItems.push(null);

                    return;
                }

                const nativeItem = this.getNativeItemByItemId(backpackItem.itemId);

                if (!nativeItem) {
                    resultItems.push(null);

                    return;
                }

                resultItems.push({
                    ...nativeItem,
                    nb: backpackItem.nb,
                    slot: {
                        slot: backpackItem.slot,
                        backpack: 'main',
                    },
                });
            });

            return resultItems;
        },
        getBackpackItemBySlot(backpack: any, slot: number) {
            return Object.values(backpack.items).find((item: any) => item?.slot === slot);
        },
        getNativeItemByItemId(itemId: string) {
            return Object.values(this.items as any[]).find(item => item.item.id === itemId);
        },
        handleMove(e: any) {
            const { index, futureIndex } = e.draggedContext
            this.movingIndex = index
            this.futureIndex = futureIndex

            return false
        },
        handleDragEnd() {
            if (this.spilled || this.movingIndex === null || this.futureIndex === null) {
                this.spilled = false
                this.drag = false;

                return false;
            }

            const socket = this.rpgSocket()

            if (this.shiftActive) {
                this.split = true;
            }
            const movingIndex = this.movingIndex;
            const futureIndex = this.futureIndex;

            if (this.isEmptySlot({
                backpack: 'main',
                slot: movingIndex,
            })) {
                this.split = false;
                this.drag = false;
                this.movingIndex = null;
                this.futureIndex = null;
                return;
            }

            const moveCallback = (amount?: number) => socket.emit('inventory.slots.move', {
                oldBackpack: 'main',
                newBackpack: 'main',
                oldSlot: movingIndex,
                newSlot: futureIndex,
                nb: amount,
            });

            if (this.split) {
                this.moveCallback = moveCallback;
            } else {
                moveCallback(undefined);
            }

            this.drag = false;
            this.movingIndex = null;
            this.futureIndex = null;
        },
        image(graphic: string) {
            const resourceImage = this.rpgResource.spritesheets.get(graphic)
            if (!resourceImage) {
                return this.icon
            }
            return resourceImage.image
        },
        isEmptySlot(slot: Slot) {
            const backpack: any = Object.values(this.inventory.backpacks).find((backpack: any) => backpack.id === slot.backpack);

            return !Object.values(backpack.items as any).some((item: any) => item?.slot === slot.slot);
        }
    }
}
</script>

<style lang="scss">
.inventory {
    width: 400px;
    position: absolute;
    right: 30px;
    bottom: 30px;
    z-index: 2;

    img {
        width: 100%;
    }

    .items-container {
        position: absolute;
        top: 570px;
        left: 75px;
        width: 250px;
        height: 209px;

        .relative {
            position: relative;
            width: 100%;
            height: 100%;

            display: grid;
            grid-template-columns: repeat(6, 36px);
            grid-template-rows: repeat(5, 35px);
            grid-column-gap: 7px;
            grid-row-gap: 8px;

            .item {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .item-count {
                    pointer-events: none;
                    position: absolute;
                    right: 2px;
                    bottom: 2px;
                    color: white;
                }

                .graphic {
                    display: block;
                    width: 36px;
                    height: 36px;
                }
            }
        }
    }
}

.equipment-container {
    position: absolute;
    top: 161px;
    left: 59px;
    width: 281px;
    height: 232px;

    .equipped-item {
        position: absolute;
        width: 30px;
        height: 30px;
        padding: 3px;
    }

    .weapon {
        top: 0;
        left: 0;
    }
}

.drop-allowed {
    box-shadow: 0 0 10px 4px rgb(225 255 0 / 25%);
}
</style>
