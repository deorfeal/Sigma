<template>
    <div class="count">
        <div class="count__wrapper">
            <div class="count__text">Quantity</div>
            <div class="slider-container" ref="sliderContainer" @click="handleTrackClick">
                <div class="slider-track" :style="{ width: `${sliderPosition}px` }"></div>
                <div class="slider-thumb" :style="{ left: `${sliderPosition}px` }" @mousedown="startDragging"
                    @touchstart="startDragging"></div>
            </div>
        </div>
        <input class="count__input" type="number" v-model="inputValue" :min="min" :max="max"
            @input="updateSliderFromInput" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, defineProps, defineEmits } from 'vue';

const props = defineProps<{
    min: number;
    max: number;
    modelValue: number;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
}>();

const sliderContainer = ref<HTMLElement | null>(null);
const sliderPosition = ref(0);
const isDragging = ref(false);
const inputValue = ref(props.modelValue);

// Update slider based on the input value
const updateSliderFromInput = () => {
    const percentage =
        ((inputValue.value - props.min) / (props.max - props.min)) *
        (sliderContainer.value?.offsetWidth || 0);
    updateSliderPosition(percentage);
};

// Update input based on the slider position
const updateInputFromSlider = (position: number) => {
    const percentageValue = Math.round(
        (position / (sliderContainer.value?.offsetWidth || 0)) * (props.max - props.min) + props.min
    );
    inputValue.value = percentageValue;
    emit('update:modelValue', percentageValue);
};

// Main function to update slider position and track width
const updateSliderPosition = (position: number) => {
    const limitedPosition = Math.min(
        Math.max(position, 0),
        sliderContainer.value?.offsetWidth || 0
    );
    sliderPosition.value = limitedPosition;
    updateInputFromSlider(limitedPosition);
};

// Track click
const handleTrackClick = (e: MouseEvent) => {
    const rect = sliderContainer.value?.getBoundingClientRect();
    const position = rect ? e.clientX - rect.left : 0;
    updateSliderPosition(position);
};

// Start dragging
const startDragging = () => {
    isDragging.value = true;
};

// Handle dragging
const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) {
        const rect = sliderContainer.value?.getBoundingClientRect();
        const position = rect ? e.clientX - rect.left : 0;
        updateSliderPosition(position);
    }
};

// Handle touch dragging
const handleTouchMove = (e: TouchEvent) => {
    if (isDragging.value) {
        const rect = sliderContainer.value?.getBoundingClientRect();
        const position = rect ? e.touches[0].clientX - rect.left : 0;
        updateSliderPosition(position);
    }
};

// Stop dragging
const stopDragging = () => {
    isDragging.value = false;
};

// Initialize slider on mount
onMounted(() => {
    updateSliderFromInput();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
});

// Update slider if the modelValue prop changes
watch(
    () => props.modelValue,
    (newVal) => {
        inputValue.value = newVal;
        updateSliderFromInput();
    }
);
</script>

<style lang="scss">
.count {
    width: 100%;
    display: flex;
    gap: 20px;

    &:last-child {
        margin-bottom: unset;
    }

    &__wrapper {
        width: 100%;
    }

    &__text {
        margin-bottom: 15px;
        color: #1A232F;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);

    }

    &__input {
        height: 100%;
        width: 40px;
        height: 40px;
        min-width: 40px;
        background: #fff;
        border-radius: 4px;
        color: #1A232F;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
        font-weight: 600;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;

        &::placeholder {
            color: #1A232F;
            font-size: 14px;
            line-height: 16px;
            font-weight: 600;
        }

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            /* display: none; <- Crashes Chrome on hover */
            -webkit-appearance: none;
            margin: 0;
            /* <-- Apparently some margin are still there even though it's hidden */
        }

    }



    .slider-container {
        position: relative;
        width: 100%;
        height: 4px;
        background: #D5DAE2;
        border-radius: 2px;
    }

    .slider-track {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #007CBE;
        border-radius: 2px;
    }

    .slider-thumb {
        position: absolute;
        top: 50%;
        width: 14px;
        height: 14px;
        background-color: #007CBE;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .slider-thumb:hover {
        // background-color: #45a049;
    }
}
</style>