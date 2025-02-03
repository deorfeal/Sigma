<script setup lang="ts">

import { useAccessoriesStore } from '../stores/accessoriesStore';
const accessoriesStore = useAccessoriesStore();

import { ref, watch } from 'vue';

const props = defineProps<{
    src: string;
    activedSrc: string;
    text: string;
    index: number;
    textIsVisible: boolean,
    isActive: boolean,
}>();

const isActive = ref<boolean>(props.isActive); // Состояние активности

const emit = defineEmits<{
    (e: 'toggleSelection', index: number): void;
}>();

function handleSelection(index: number) {
    emit('toggleSelection', index)
}

watch(
    () => props.isActive,
    (newValue) => {
        isActive.value = newValue
        accessoriesStore.setAccessoriesValue(props.index, newValue, props.text); // Записываем в хранилище
    }
)

</script>

<template>
    <div class="accessories-form__item accessories-item" :class="{ 'accessories-item--active': isActive }">
        <input class="accessories-item__checkbox" type="checkbox" :checked="isActive" name=""
            @click="handleSelection(props.index)">
        <picture class="accessories-item__img">
            <img :src="src" alt="img">
            <Transition name="fade" mode="out-in">
                <img v-if="isActive" :src="activedSrc" alt="img">
            </Transition>
        </picture>
        <Transition name="accessoriesTextFade">
            <div v-if="textIsVisible" class="accessories-item__text">
                {{ text }}
            </div>
        </Transition>
    </div>
</template>

<style lang="scss">
.accessories--active {
    .accessories-item__text {
        height: unset;
        width: unset;
        opacity: 1;
    }
}

.accessories-item {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    cursor: pointer;

    &:hover {
        .accessories-item__img {
            border: 1px solid #F2A41F;
        }
    }

    &--active {
        .accessories-item__img {
            border: 1px solid #F2A41F;

            &::after {
                opacity: 1;
            }
        }
    }

    &__checkbox {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
        opacity: 0;
        z-index: 1;
    }

    &__img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: clamp(40px, calc(40px + (60 - 20) * ((100vw - 375px) / (1165 - 375))), 60px);
        height: clamp(40px, calc(40px + (60 - 20) * ((100vw - 375px) / (1165 - 375))), 60px);
        border-radius: 6px;
        border: 1px solid #E6E8EB;
        background: #fff;
        position: relative;
        transition: border 0.3s;

        img {
            width: clamp(30px, calc(30px + (50 - 20) * ((100vw - 375px) / (1165 - 375))), 50px);
            height: clamp(30px, calc(30px + (50 - 20) * ((100vw - 375px) / (1165 - 375))), 50px);
            object-fit: contain;

            &:nth-child(2) {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
        }
    }

    &__text {
        font-weight: 700;
        max-width: 115px;
        color: #1A232F;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
    }
}


.accessoriesTextFade-enter-active,
.accessoriesTextFade-leave-active {}

.accessoriesTextFade-enter-from,
.accessoriesTextFade-leave-to {
    width: 0;
    opacity: 0;
}
</style>