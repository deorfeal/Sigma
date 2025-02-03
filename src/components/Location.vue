<script setup lang="ts">
// Определяем свойства компонента
const props = defineProps<{ 
    src: string,
    index: number,
    isActive: boolean,
}>();

// Определяем события компонента
const emit = defineEmits<{ 
    (event: 'select', index: number): void;
}>();

function toggleSelection() { // Функция для переключения состояния активности
    emit('select', props.index);
}

</script>

<template>
    <div class="inputs-location__item inputs-item" :class="{ 'inputs-item--active': isActive }">
        <input class="inputs-item__input" type="radio" name="input" value="false" :checked="isActive"
            @click="toggleSelection">
        <div class="inputs-item__icon"></div>
        <div class="inputs-item__view">
            <picture>
                <img :src="src" alt="icon">
            </picture>
        </div>
    </div>
</template>

<style lang="scss">
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

        picture {
            display: block;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
}
</style>