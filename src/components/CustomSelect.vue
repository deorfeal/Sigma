<template>
    <div class="form__select select" ref="selectRef" @click="toggleItems">
        <label class="select__label">{{ label }}</label>
        <div :class="['select__custom-select', 'custom-select', { open: isOpen }]">
            <div class="select-selected">
                <picture v-if="selectedImg">
                    <img :src="selectedImg" alt="img" />
                </picture>
                {{ selectedText }}
            </div>
            <div :class="['select-items', { 'select-hide': !isOpen }]">
                <div v-for="option in filteredOptions" :key="option.value" :data-value="option.value"
                    @click.stop="selectOption(option)" :class="{ selected: option.value === selectedValue }">
                    <picture v-if="option.img">
                        <img :src="option.img" alt="img" />
                    </picture>
                    <span>{{ option.text }}</span>
                </div>
            </div>
        </div>
        <select v-model="selectedValue" class="real-select" style="display: none;">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.text }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import { onClickOutside } from '@vueuse/core';

interface Option {
    value: string;
    text: string;
    img?: string
}

const props = defineProps<{
    label: string;
    options: Option[];
    modelValue: string;
    filterExcludeValue?: string;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();

const isOpen = ref(false);
const selectedValue = ref(props.modelValue);
const selectRef = ref<HTMLElement | null>(null); // Ссылка на компонент

const selectedText = computed(() => {
    const selectedOption = props.options.find((opt) => opt.value === selectedValue.value);
    return selectedOption ? selectedOption.text : '';
});

const selectedImg = computed(() => {
    const selectedOption = props.options.find((opt) => opt.value === selectedValue.value);
    return selectedOption ? selectedOption.img : '';
});

const filteredOptions = computed(() =>
    props.options.filter((option) => option.value !== props.filterExcludeValue)
);

const toggleItems = () => {
    isOpen.value = !isOpen.value;
};

const selectOption = (option: Option) => {
    selectedValue.value = option.value;
    emit('update:modelValue', option.value);
    isOpen.value = false;
};

// Обработчик для кликов вне компонента
onClickOutside(selectRef, () => {
    isOpen.value = false;
});
</script>

<style lang="scss">
.select {
    width: 100%;
    position: relative;
    cursor: pointer;

    &__label {
        color: #3E4650;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
        display: inline-block;
        position: absolute;
        top: 9px;
        left: 12px;
        pointer-events: none;
    }


    // &--active {
    //     display: block;
    // }

    // &--hidden {
    //     display: none;
    // }
}

.custom-select {

    &::after {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        top: 22px;
        right: 20px;
        background-image: url(/images/select-arrow.svg);
        background-repeat: no-repeat;
        background-size: contain;
        transition: transform 0.3s;
    }
}

.custom-select.open {
    &::after {
        transform: rotate(-180deg);
    }
}

.select-selected {
    background: #fff;
    border-radius: 4px;
    padding: 29px 20px 8px 12px;
    color: #1A232F;
    font-weight: 600;
    font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
    line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 53px;

    picture {
        display: block;
        width: 50px;
        height: 50px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.select-items {
    position: absolute;
    top: calc(100% + 4px);
    z-index: 1;
    width: 100%;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    transition: opacity 0.3s;
    // box-shadow: 0 0px 5px 0px #1A232F;
}

.select-items div {
    padding: 12px;
    padding-top: clamp(8px, calc(8px + (12 - 4) * ((100vw - 375px) / (1165 - 375))), 12px);
    padding-bottom: clamp(8px, calc(8px + (12 - 4) * ((100vw - 375px) / (1165 - 375))), 12px);
    color: #1A232F;
    font-weight: 600;
    font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
    line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
    transition: background 0.3s;
    display: flex;
    align-items: center;
    gap: 10px;

    picture {
        display: block;
        width: 40px;
        height: 40px;
        mix-blend-mode: darken;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.select-hide {
    opacity: 0;
    pointer-events: none;
}

.select-items div:hover {
    background: #F5F6F8;
}
</style>