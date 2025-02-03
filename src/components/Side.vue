<script setup lang="ts">

// Определяем свойства
const props = defineProps<{
    label: string,
    isActive: boolean,
    index: number
}>();

// Определяем события
const emit = defineEmits<{
    (event: 'select', index: number): void;
}>();

</script>
<template>
    <div class="configurator-tubs__tub" :class="{ 'configurator-tubs__tub--active': isActive }"
        @click="$emit('select', index)">
        {{ label }}
    </div>
</template>
<style lang="scss">
.configurator-tubs {
    &__tub {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #1A232F;
        transition: background 0.3s, color 0.3s;
        font-weight: 700;
        font-size: 10px;
        background: #fff;
        line-height: 10px;
        cursor: pointer;
        padding: 12px 0;
        text-transform: uppercase;
        &:hover {
            color: #007CBE;
        }
    }

    &__tub--active {
        background: #007CBE;
        color: #fff;

        &:hover {
            color: #fff;
        }
    }
}
</style>