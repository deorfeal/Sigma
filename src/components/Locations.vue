<script setup lang="ts">

import { ref, computed } from 'vue';
import Location from './Location.vue'; // Импортируем компонент

// Определяем свойства
const props = defineProps<{
    isMainLocations: boolean,
    index: number,
}>();

// Определяем события
const emit = defineEmits<{
    (event: 'changeChecked', tabIndex: number, selectedIndex: number, isMainLocations: boolean): void;
}>();

// Объединение путей к изображениям
const imageSrcs = ref<{ type: 'head' | 'additional', images: string[] }[]>([
    {
        type: 'head',
        images: [
            'images/inputs-location-icon-1.svg',
            'images/inputs-location-icon-2.svg'
        ]
    },
    {
        type: 'additional',
        images: [
            'images/inputs-location-icon-3.svg',
            'images/inputs-location-icon-4.svg',
            'images/inputs-location-icon-5.svg'
        ]
    }
]);

const isActive = ref<number | null>(null); // Храним активный индекс

// Вычисляемое свойство для получения изображений на основе типа локаций
const imageSrc = computed(() => {
    const locationType = props.isMainLocations ? 'head' : 'additional'; // Определяем тип
    return imageSrcs.value.find(loc => loc.type === locationType)?.images || []; // Возвращаем изображения
});

// Функция для обработки выбора локации
function handleSelect(index: number) {
    isActive.value = index; // Переключаем состояние
    emit('changeChecked', props.index, index, props.isMainLocations) // Вызываем событие
}
</script>

<template>
    <div class="inputs-location">
        <label class="inputs-location__label" for="">
            The location of the inputs
        </label>
        <div class="inputs-location__inner">
            <Location v-for="(item, index) in imageSrc" :key="index" :src="item" :index="index"
                @select="handleSelect($event)" :isActive="isActive === index" />
        </div>
    </div>
</template>

<style lang="scss">
.inputs-location {
    width: 100%;
    margin-bottom: 15px;
    margin-top: 15px;
    &__label {
        color: #3e4650;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
        display: inline-block;
        margin-bottom: 10px;
    }

    &__inner {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: clamp(15px, calc(15px + (20 - 15) * ((100vw - 375px) / (1165 - 375))), 20px);
    }

    .hidden {
        display: none;
    }
    &.disabled {
        pointer-events: none;
    }
}

.inputs-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;

    &--active {
        .inputs-item__icon {
            &::after {
                opacity: 1;
            }
        }
    }

    &__input {
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
    }

    &__icon {
        position: relative;
        width: 20px;
        height: 20px;
        min-width: 20px;
        border-radius: 100%;
        border: 1px solid #E6E8EB;

        &::after {
            content: '';
            width: 12px;
            height: 12px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            background: #007CBE;
            opacity: 0;
            transition: opacity 0.3s;
            border-radius: 100%;
        }
    }

    &__view {
        background: #fff;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56px;
        width: 100%;
    }
}
</style>