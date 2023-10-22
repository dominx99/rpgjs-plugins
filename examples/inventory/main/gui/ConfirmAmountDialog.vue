<template>
    <rpg-window width="300" class="dialog">
        <div class="dialog-title">
            <slot name="title"></slot>
        </div>
        <div class="dialog-body">
            <input type="number" v-model="amount">
        </div>
        <div class="dialog-actions" ref="dialog">
            <button @click="$emit('accept', amount)">OK</button>
            <button @click="$emit('decline')">Cancel</button>
        </div>
    </rpg-window>
</template>

<script lang="ts">
export default {
    data: () => ({
        amount: 1
    })
}
</script>

<style scoped lang="scss">
input {
    width: calc(100% - 20px);
    margin: 0 !important;
}

.dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;

    color: white;

    .dialog-title {
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 1rem;
    }

    .dialog-actions {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 1rem;

        button {
            display: block;
            padding: .5rem 1rem;
            border: none;
            border-radius: 5px;
            background: #206ea7;
            color: white;

            &:not(:last-child) {
                margin-right: .5rem;
            }
        }
    }
}
</style>
