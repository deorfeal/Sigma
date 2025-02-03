<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue';
import CustomSelect from './CustomSelect.vue';
import Slider from './Slider.vue';
import type { SelectsValues, SelectedValues } from '../interfaces/selects';
import type { ItemInfo } from '../interfaces/itemInfo';

// Опредиляем свойства
const props = defineProps<{
    selectsValues: SelectsValues;
    startedValues: SelectedValues;
    itemInfo: ItemInfo;
    filterObject?: Record<string, string[]>;
    filterType?: string;
    sliderValue?: number;
    sliderMaxValue?: number;
    filterWatchedProperty?: string;
    applyButtonIsActive?: boolean;
    addButtonIsActive?: boolean;
}>();

// Определяем события
const emit = defineEmits<{
    (e: 'updateSelectedValues', value: SelectedValues): void;
    (e: 'updateCountOfItems'): void;
    (e: 'removeItem'): void;
    (e: 'updateSliderValue', value: number): void;
    (e: 'applySelectedValues'): void;
}>();

// Создаем реактивный объект
const selectsValues = reactive<SelectsValues>({ ...props.selectsValues });

// Создаем реактивный объект с безопасным добавлением новых ключей
const selectedValues = reactive<SelectedValues>({ ...props.startedValues });

// Проверяем есть ли фильтрация 
if (props.filterObject && props.filterType) {
    updateKeys(props.filterType, false); // Удаляем ключи
}

// Функция для обновления ключей
function updateKeys(objectKey: string, add: boolean) {
    if (props.filterObject) { // Проверяем есть ли фильтрация

        const filterKeys = props.filterObject[objectKey] || []; // Получаем ключ

        // Добавление ключей
        if (add) { // Проверяем нужно ли добавлять
            filterKeys.forEach((key) => { // Перебираем ключи
                if (!(key in selectsValues)) { // Проверяем есть ли ключ
                    selectsValues[key] = props.selectsValues[key] || ''; // Добавляем ключ
                }
                if (!(key in selectedValues)) { // Проверяем есть ли ключ
                    selectedValues[key] = ''; // Добавляем ключ
                }
            });
        } else { // Удаление ключей
            Object.keys(selectsValues).forEach((key) => { // Перебираем ключи
                if (!filterKeys.includes(key)) { // Проверяем есть ли ключ
                    delete selectsValues[key]; // Удаляем ключ
                }
            });

            Object.keys(selectedValues).forEach((key) => { // Перебираем ключи
                if (!filterKeys.includes(key)) { // Проверяем есть ли ключ
                    delete selectedValues[key]; // Удаляем ключ
                }
            });
        }
    }
}

// Создаем константу со значением количества в счётчике
const sliderValue = ref<number>(props.sliderValue || 0);

// Прослушиваем изменения свойств в объекте selectedValues
watch(
    selectedValues,
    (newValues) => {
        // Обновляем выбранные значения
        if (props.filterObject && newValues[props.filterWatchedProperty ?? ''] in props.filterObject) { // Проверяем есть ли фильтрация 
            const componentKey = newValues[props.filterWatchedProperty ?? '']; // Получаем ключ
            updateKeys(componentKey, false); // Удаляем ключ
            updateKeys(componentKey, true); // Добавляем ключ
        }
        emit('updateSelectedValues', newValues); // Вызываем событие
    }
);

// Прослушиваем изменения свойств 
watch(
    () => sliderValue.value,
    (newValues) => {
        emit('updateSliderValue', newValues); // Вызываем событие
    }
);

// Обработчик нажатия на кнопку "Применить"
function handleApply() {
    emit('applySelectedValues'); // Вызываем событие
}

// Обработчик нажатия на кнопку "Добавить"
function handleAdd() {
    emit('updateCountOfItems'); // Вызываем событие
}


</script>

<template>
    <div class="configurator-body__wrapper">
        <h2 class="configurator-body__title title">
            {{ itemInfo.title }}
            <span v-if="itemInfo.number">
                {{ itemInfo.number }}
            </span>
        </h2>
        <div v-if="itemInfo.willCloses" class="configurator-body__close" @click="emit('removeItem')">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="0.000976562" width="19.7979" height="2.82827" transform="rotate(45 2 0.000976562)"
                    fill="#1A232F" />
                <rect x="16" y="2" width="19.7979" height="2.82827" transform="rotate(135 16 2)" fill="#1A232F" />
            </svg>
        </div>
        <form class="configurator-body__form form" :class="{ 'disabled': itemInfo.disabled }" action="#" method="post">
            <template v-for="key in Object.keys(selectsValues)" :key="key">
                <CustomSelect :label="key" :options="selectsValues[key]" v-model="selectedValues[key]" />
            </template>
            <slot></slot>
            <div class="form__row">
                <Slider v-if="itemInfo.hasSlider" class="form__count" v-model="sliderValue" :min="0"
                    :max="sliderMaxValue || 13" />
                <button v-if="itemInfo.hasAdd" class="form__apply" :class="{ 'btn--disabled': !applyButtonIsActive }"
                    @click.prevent="handleApply" type="button">
                    Apply
                </button>
            </div>
        </form>
    </div>
    <button v-if="itemInfo.hasAddNew && itemInfo.hasAdd" class="form__add" :class="{ 'btn--disabled': !addButtonIsActive }"
        @click.prevent="handleAdd" type="button">
       Add a new one +
    </button>
</template>
