<script setup lang="ts">
import { watch, ref, computed } from 'vue';

import ConfiguratorViewItem from './ConfiguratorViewItem.vue';

import { useCasesSelectsStore } from '../../stores/casesSelectsStore';
const casesSelectsStore = useCasesSelectsStore()

const props = defineProps<{
    itemsCount: number;
    withDefault: boolean;
    currentTab: number;
}>();

const itemsSrc = <string[]>[ // Массив путей к изображениям
    'images/frame-img-stock.svg',
    'images/frame-img-1.svg',
    'images/frame-img-2.svg',
    'images/frame-img-1.svg',
]

const displayedItems = computed(() => { // Вычисляемое свойство для определения отображаемых изображений
    return props.withDefault ? itemsSrc : itemsSrc.slice(1);
});

const visibleElementIndex = ref<number>(0); // Константа с индексом отображаемого элемента

const itemProps = computed(() => { // Вычисляемое свойство для определения класса и флага по умолчанию
    return displayedItems.value.map((item, index) => ({
        src: item,
        isDefault: index === 0,
        class: index === 0 && props.withDefault ? 'configurator-view__wrapper--stock' : '',
        isVisible: index === visibleElementIndex.value ? true : false
    }));
});

watch( // Обновление индекса отображаемого элемента при изменении значения свойства 'Серия'
    () => casesSelectsStore.selectValues['A series of polyester'],
    (newValue) => {
        visibleElementIndex.value = newValue ? +newValue + 1 : 0;
    },
    { immediate: true }
);

watch( // Обновление индекса отображаемого элемента при изменении значения свойства 'Серия'
    () => casesSelectsStore.selectValues['The series is steel'],
    (newValue) => {
        visibleElementIndex.value = newValue ? +newValue + 1 : 0;
    },
);

</script>

<template>
    <div class="configurator-item__view configurator-view">
        <ConfiguratorViewItem v-for="(item, index) in itemProps" :key="index" :src="item.src"
            :isDefault="item.isDefault" :class="item.class" :isVisible="item.isVisible"
            :currentTab="props.currentTab" />
    </div>
</template>

<style lang="scss">
.configurator-view {
    margin-top: 60px;
    position: relative;
}
</style>