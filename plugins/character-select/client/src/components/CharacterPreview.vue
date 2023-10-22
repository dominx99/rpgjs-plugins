<template>
    <div v-if="graphics" v-for="sprite in mapSpritesheets(graphics)" class="spritesheet-preview"
        :style="spritesheet(sprite)"></div>
</template>

<script lang="ts">
export default {
    inject: ['rpgCurrentPlayer', 'rpgResource'],
    props: {
        graphics: {
            type: Array as () => string[],
            default: () => [],
        },
    },
    methods: {
        mapSpritesheets(graphics: string[]): string[] {
            const spritesheets = graphics.map(
                graphic => this.rpgResource.spritesheets.get(graphic)?.image
            ).filter(sprite => Boolean(sprite));

            return spritesheets as string[];
        },
        spritesheet(sprite: string) {
            return {
                'background-image': `url(${sprite})`,
            }
        },
    },
}
</script>

<style>
.spritesheet-preview {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 64px;
    height: 64px;
    transform: scale(5) translateX(calc(-50% / 5)) translateY(calc(-50% / 5));
    background-position: 0 -128px;
}
</style>
