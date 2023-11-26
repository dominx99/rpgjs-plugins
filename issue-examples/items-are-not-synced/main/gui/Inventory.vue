<template>
</template>

<script lang="ts">
    export default {
        name: 'inventory',
        inject: ['rpgCurrentPlayer'],
        mounted() {
            this.rpgCurrentPlayer.subscribe(({ object }) => {
                console.log('frontend', object.items);
            })
        }
    }
</script>
