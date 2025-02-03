<script setup lang="ts">
import { ref } from 'vue';
// Component and type imports
import ConfiguratorItem from '../components/ConfiguratorItem.vue';
import type { SelectsValues, SelectedValues } from '../interfaces/selects';
import type { ItemInfo } from '../interfaces/itemInfo';

// Store integration for state management
import { useCasesSelectsStore } from '../stores/casesSelectsStore';
const casesSelectsStore = useCasesSelectsStore();

// Component interface definitions
const props = defineProps<{
    configuratorIsHighlight: boolean;
}>();

const emit = defineEmits<{
    (e: 'accessoriesHighlight', index: number): void;
}>();

// Configuration options for case selection
const selectsValues = ref<SelectsValues>({
    'Case material': [
        { value: '0', text: 'Stainless steel' },
        { value: '1', text: 'Reinforced polyester' },
    ],
    'A series of polyester': [
        { value: '0', text: 'P1000', img: 'images/p1000-img.png' },
        { value: '1', text: 'P7000', img: 'images/p7000-img.png' },
    ],
    'The series is steel': [
        { value: '0', text: 'S1', img: 'images/s1-img.png' },
    ],
    'Size': [
        { value: '0', text: '250x250' },
        { value: '1', text: '500x500' },
    ]
});

// Initialize form values from store
const startedValues = ref(casesSelectsStore.selectValues);

// Single item configuration structure
const items = ref<Array<{ id: number, itemInfo: ItemInfo }>>([
    {
        id: 1, itemInfo: {
            hasSlider: false,
            hasAdd: false,
            willCloses: false,
            title: 'Case'
        }
    }
]);

// Persists selections to global store and cleans dependent values
function syncSelectedValuesWithStore(el: SelectedValues) {
    // Update store with new selections
    Object.entries(el).forEach(([key, value]) => {
        casesSelectsStore.setSelectValue(key, value);
    });

    // Clean up dependent values
    handleDeleteSelectValue()
}

// Maintains data integrity by removing irrelevant series
function handleDeleteSelectValue() {
    const filterType = getFilterType();
    const seriesToRemove = filterType === '0'
        ? 'A series of polyester'
        : 'The series is steel';
    casesSelectsStore.deleteSelectValue(seriesToRemove);
}

// Dynamic form filtering configuration
const filterObject = <Record<string, string[]>>(
    {
        'started': ['Case material', 'Size'],
        '0': ['Case material', 'The series is steel', 'Size'],
        '1': ['Case material', 'A series of polyester', 'Size']
    }
)

// Determines active filter based on material selection
function getFilterType() {
    const materialSelection = casesSelectsStore.selectValues['Case material'];
    return ['0', '1'].includes(materialSelection) ? materialSelection : 'started';
}
</script>

<template>
    <div class="configurator-item__body configurator-body"
        :class="{ 'configurator-body--highlight': configuratorIsHighlight }">
        <!-- Main configuration item -->
        <template v-for="(item, index) in items" :key="item.id">
            <ConfiguratorItem :selectsValues="selectsValues" :startedValues="startedValues"
                @updateSelectedValues="syncSelectedValuesWithStore($event)" :itemInfo="item.itemInfo"
                :filterObject="filterObject" :filterType="getFilterType()" :filterWatchedProperty="'Case material'" />
        </template>
    </div>
</template>