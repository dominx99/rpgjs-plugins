<template>
    <div class="item" v-on:dblclick="useItem(item)">
        <img class="graphic" :src="image(item.item.icon)">
        <div v-if="item.nb > 1" class="item-count" v-text="item.nb"></div>
    </div>
</template>

<script lang="ts">
export default {
    inject: ['rpgResource', 'rpgSocket'],
    props: {
        item: {
            type: Object,
            required: true,
        },
        drag: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        image(graphic: string) {
            const resourceImage = this.rpgResource.spritesheets.get(graphic)
            if (!resourceImage) {
                return this.icon
            }
            return resourceImage.image
        },
        useItem(item: any): void {
            const socket = this.rpgSocket();

            socket.emit('inventory.useItem', {
                itemId: item.item.id,
                slot: item.slot
            });
        },
    }
}
</script>
