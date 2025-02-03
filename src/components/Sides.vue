<script setup lang="ts">
import { ref } from 'vue' // Импортируем ref
import Side from './Side.vue' // Импортируем компонент Side

const sides = ['Side А', 'Side B', 'Side C', 'Side D']; // Массив с названиями сторон
const activeTub = ref(1); // Храним активный индекс

// Определяем события компонента
const emit = defineEmits<{
    (event: 'changeTab', index: number): void;
}>();

// Функция для обработки выбора
const selectTab = (tab: number) => {
    activeTub.value = tab; // Переключаем состояние
    emit('changeTab', tab); // Вызываем событие
};
</script>

<template>
    <div class="configurator-body__tubs configurator-tubs">
        <Side v-for="(side, index) in sides" :key="index" :label="side" :index="index" :isActive="index === activeTub"
            @select="selectTab" />
    </div>
</template>

<style lang="scss">
.configurator-tubs {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin-bottom: 25px;
    border-radius: 4px;
    overflow: hidden;
}
</style>