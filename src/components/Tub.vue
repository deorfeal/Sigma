<script setup lang="ts">
const emit = defineEmits<{
    (e: 'changeTub', index: number): void;
}>();

const props = defineProps<{
    title: string;
    index: number;
    activeTub: number;
}>();
</script>

<template>
    <div class="tub" :class="{ 'tub--active': index === activeTub }" @click="$emit('changeTub', index)">
        <span>
            {{ title }}
        </span>
    </div>
</template>

<style lang="scss">
.tub {
    color: #1A232F;
    font-size: 14px;
    line-height: 19px;
    border-radius: 10px 0 0 10px;
    transition: background 0.3s, color 0.3s;
    font-weight: 700;
    position: relative;
    cursor: pointer;
    text-align: center;
    text-transform: uppercase;

    &:hover {
        color: #007cbe;
    }

    span {
        position: absolute;
        top: 50%;
        left: 50%;
        writing-mode: tb-rl;
        transform: translateX(-50%) translateY(-50%) rotate(180deg);
    }

    &--active {
        background: #007CBE;
        color: #fff;

        &:hover {
            color: #fff;
        }
    }
}

@media (max-width: 1350px) {
    .tub {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
        border-radius: unset;
        padding-left: 10px;
        padding-right: 10px;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (19 - 5) * ((100vw - 375px) / (1165 - 375))), 19px);

        span {
            position: unset;
            transform: unset;
            writing-mode: unset;
        }
    }
}
</style>