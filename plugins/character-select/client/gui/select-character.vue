<template>
    <div class="character-select">
        <div class="character-select__preview-wrapper">
            <CharacterPreview :graphics="graphics()" />
        </div>
        <div class="character-select__description-wrapper" v-if="currentActor">
            <div class="character-select__description-content">
                <h2 class="character-select__title">
                    <span class="character-select__actor-name">{{ currentActor.name }}&nbsp;</span>
                    <span class="character-select__class-name">{{ currentActor.class.name }}</span>
                </h2>
                <p class="character-select__description">{{ currentActor.description }}</p>
            </div>
        </div>
        <button @click="handlePreviousCharacter()" class="character-select__arrow-left"></button>
        <button @click="handleNextCharacter()" class="character-select__arrow-right"></button>

        <button @click="handleSelectCurrentActor()" class="btn-success character-select__submit-button">Start</button>
    </div>
</template>

<script lang="ts">
import CharacterPreview from './../src/components/CharacterPreview.vue';
import ClassGraphics from './../../server/src/graphics/ClassGraphics'

interface Actor {
    id: string,
    name: string,
    description: string,
    class: {
        type: string,
        graphics: ClassGraphics,
    }
}

export default {
    name: 'rpg-character-select',
    inject: ['rpgGuiInteraction'],
    props: {
        actors: {
            type: Array as () => Actor[],
            default: () => [],
        },
    },
    components: {
        CharacterPreview,
    },
    data: () => ({
        currentSelectedActor: null as string | null,
    }),
    mounted() {
        const [firstActor] = Object.values(this.actors) as Actor[];

        this.currentSelectedActor = firstActor.id;
    },
    computed: {
        currentActor(): Actor {
            return this.actors[this.currentSelectedActor];
        }
    },
    methods: {
        handleSelectCurrentActor() {
            this.rpgGuiInteraction('rpg-character-select', 'character-selected', {
                actorId: this.currentSelectedActor,
            })
        },
        handlePreviousCharacter() {
            const ids = Object.keys(this.actors);

            const currentIndex = ids.findIndex(id => id === this.currentSelectedActor);
            const previousIndex = currentIndex - 1;

            if (previousIndex < 0) {
                this.currentSelectedActor = ids[ids.length - 1];
            } else {
                this.currentSelectedActor = ids[previousIndex];
            }
        },
        handleNextCharacter() {
            const ids = Object.keys(this.actors);

            const currentIndex = ids.findIndex(id => id === this.currentSelectedActor);
            const nextIndex = currentIndex + 1;

            if (nextIndex > ids.length - 1) {
                this.currentSelectedActor = ids[0];
            } else {
                this.currentSelectedActor = ids[nextIndex];
            }
        },
        graphics() {
            if (!this.currentSelectedActor) {
                return [];
            }

            const actor = this.actors[this.currentSelectedActor];
            return [
                ...actor.class.graphics.pernament,
                ...Object.values(actor.class.graphics.baseEquipment),
            ];
        }
    }
}
</script>

<style lang="scss">
$character-select-screen-background: url('../assets/backgrounds/character-select.png') !default;
$window-button-success-color: #1c8634 !default;
$window-button-success-shadow: #0d4c30 !default;
$window-button-color: rgba(128, 130, 162, 0.7) !default;
$window-button-shadow: rgb(128, 130, 162) !default;

$character-select-arrow-left-image: url('../assets/gui/arrow-left.png') !default;
$character-select-arrow-right-image: url('../assets/gui/arrow-right.png') !default;

.character-select {
    background: $character-select-screen-background;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &__preview-wrapper {
        position: absolute;
        top: 58%;
        left: 50%;
    }

    &__arrow-left,
    &__arrow-right {
        background-size: 100% 100%;
        width: 100px;
        height: 100px;
        background-color: transparent;
        border: none;
        outline: none;
        position: absolute;
        top: 62%;
        left: 25%;
        filter: brightness(1.5);
        filter: brightness(0.9);
        transition: filter 0.15s ease-in-out;
        z-index: 100;

        &:hover {
            cursor: pointer;
            filter: brightness(1);
        }
    }

    &__arrow-right {
        background-image: $character-select-arrow-right-image;
        left: unset;
        right: 25%;
    }

    &__arrow-left {
        background-image: $character-select-arrow-left-image;
    }

    &__description-content {
        width: 300px;
        height: 300px;
        background: rgba(0, 0, 0, 0.5);
        color: #fefefe;
        border-radius: 7px;
        padding: 1rem;
        overflow: auto;

        &::-webkit-scrollbar {
            width: 5px;
            background: #fff;
        }

        &::-webkit-scrollbar-thumb {
            background-color: rgb(0, 0, 0, .5);
        }

        &::-webkit-scrollbar-track {
            background-color: #fff;
        }
    }

    &__description-wrapper {
        position: absolute;
        top: 20%;
        right: 15%;
    }

    &__submit-button {
        position: absolute;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 50px;
    }

    &__title {
        margin: 0;
        padding: 0;
        margin-bottom: 1rem;
    }
}

.btn-success {
    min-width: 130px;
    height: 40px;
    color: #fff;
    padding: 5px 10px;
    font-weight: bold;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-block;
    outline: none;
    border-radius: 5px;
    border: none;
    background: $window-button-success-color;
}

.btn-success:hover {
    box-shadow: 0 3px $window-button-success-shadow;
}

.btn-success:active {
    box-shadow: 0 0 $window-button-success-shadow;
}
</style>
