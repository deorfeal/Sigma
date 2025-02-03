<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
// Configuration management components
import ConfiguratorItem from '../components/ConfiguratorItem.vue';
import Alert from '../components/Alert.vue';

// Type definitions for type safety
import type { SelectsValues, SelectedValues } from '../interfaces/selects';
import type { ItemInfo } from '../interfaces/itemInfo';

// State management imports
import { useTerminalsSelectsStore } from '../stores/terminalsSelectsStore';
import { showAlert, useAlertState } from '../utils/alertManager';
import { isSelectsFilled } from '../utils/isSelectsFilled';
import { generateUniqueId } from '../utils/generateId';

// Component interface definitions
const props = defineProps<{
    configuratorIsHighlight: boolean;
}>();

const emit = defineEmits<{
    (e: 'addInputs', index: number): void;
}>();

// Alert system initialization
const alertState = useAlertState();
const terminalsSelectsStore = useTerminalsSelectsStore();

// Configuration options data
const selectsValues = ref<SelectsValues>({
    'Clem brand': [{ value: '0', text: 'WeidMuller' }],
    'Size': ['2.5', '4', '6', '10', '16', '35'].map((text, value) => ({ value: value.toString(), text })),
    'Color': ['White', 'Blue', 'Green'].map((text, value) => ({ value: value.toString(), text }))
});

// Default values for form controls
const startedValues = ref<SelectedValues>({
    'Clem brand': '',
    'Size': '',
    'Color': ''
});

// Dynamic items management
const items = ref<Array<{ id: number, itemInfo: ItemInfo }>>([
    {
        id: generateUniqueId(),
        itemInfo: {
            hasSlider: true,
            hasAdd: true,
            hasAddNew: true,
            willCloses: true,
            title: 'Block',
            number: 1,
            disabled: false,
            sliderValue: 3
        }
    }
]);

// Current selection state
const selectedValues = ref<SelectedValues>({
    'Clem brand': '',
    'Size': '',
    'Color': ''
});

// Updates current selections and validates form state
function addSelectedValues(el: SelectedValues) {
    selectedValues.value = el;
    applyButtonIsActive.value = isSelectsFilled(selectedValues.value);
}

// Slider value management
const sliderValue = ref<number>(3);
const totalsliderValue = ref<number>(0);

// Handles slider value updates from child components
function updateSliderValue(number: number) {
    sliderValue.value = number;
    applyButtonIsActive.value = isSelectsFilled(selectedValues.value);
}

// Persists selections to global store
function syncSelectedValuesWithStore(el: SelectedValues, id: number, count: number) {
    terminalsSelectsStore.setSelectValue(el, id, count);
}

// Adjusts total count when removing items
function decreaseTotalSliderValue(id: number) {
    const item = terminalsSelectsStore.selectValues.find((item) => item.id === id.toString());
    item ? totalsliderValue.value -= Number(item.count) : totalsliderValue.value -= sliderValue.value;
}

// Adds new configurable item with validation
async function addNewItem(id: number) {
    if (totalsliderValue.value < 13) {
        const newNumber = items.value.length + 1;
        const newId = generateUniqueId();
        items.value.push({
            id: newId,
            itemInfo: {
                hasSlider: true,
                hasAdd: true,
                hasAddNew: true,
                willCloses: true,
                title: 'Block',
                number: newNumber,
                disabled: false,
                sliderValue: 3
            }
        });
        selectedValues.value = { 'Clem brand': '', 'Size': '', 'Color': '' };
        updateItemVisibility();
        addButtonIsActive.value = false;
        showAlert('The new block is added', 'alert--success');
    } else {
        showAlert('You can not add more than 13 elements', 'alert--warning');
    }
}

// Removes item with validation and state cleanup
async function deleteItem(id: number) {
    if (items.value.length > 1) {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1 && index !== items.value.length - 1) {
            decreaseTotalSliderValue(id);
            items.value.splice(index, 1);
            terminalsSelectsStore.removeSelectValue(id);
            await nextTick();
            refreshItemIndexes();
            showAlert('The terminals are removed', 'alert--warning');
        } else {
            showAlert('You can not remove the last element', 'alert--warning');
        }
    } else {
        showAlert('Cannot delete the only element', 'alert--warning');
    }
}

// UI state helpers
function refreshItemIndexes() {
    items.value.forEach((item, idx) => {
        item.itemInfo.number = idx + 1;
    });
}

function updateItemVisibility() {
    items.value.forEach((item, idx) => {
        if (idx < items.value.length - 1) {
            item.itemInfo.hasAdd = false;
            item.itemInfo.disabled = true;
        }
    });
}

// Application state tracking
const previousSliderId = ref<number>(0);
const previousSliderValue = ref<number>(3);
const applyButtonIsActive = ref<boolean>(false);
const addButtonIsActive = ref<boolean>(false);

// Finalizes selection with comprehensive validation:
async function handleApplySelectedValues(id: number) {
    const itemInStore = terminalsSelectsStore.selectValues.find(
        (item) => item.id === id.toString()
    );

    if (itemInStore) {
        totalsliderValue.value -= Number(itemInStore.count);
    }

    if (totalsliderValue.value + sliderValue.value > 13) {
        if (itemInStore) {
            totalsliderValue.value += Number(itemInStore.count);
        }
        showAlert('You can not add more than 13 elements', 'alert--warning');
        return;
    }

    totalsliderValue.value += sliderValue.value;
    previousSliderId.value = id;
    previousSliderValue.value = sliderValue.value;
    syncSelectedValuesWithStore(selectedValues.value, id, sliderValue.value);

    showAlert('The terminals are added', 'alert--success');
    applyButtonIsActive.value = false;
    addButtonIsActive.value = true;
}
</script>

<template>
    <div class="configurator-item__body configurator-body configurator-body--terminals"
        :class="{ 'configurator-body--highlight': configuratorIsHighlight }">
        <!-- Dynamic configuration items list -->
        <template v-for="(item, index) in items" :key="item.id">
            <ConfiguratorItem :selectsValues="selectsValues" :startedValues="startedValues"
                @updateSelectedValues="addSelectedValues($event)" :itemInfo="item.itemInfo"
                @updateCountOfItems="addNewItem(item.id)" @removeItem="deleteItem(item.id)"
                @updateSliderValue="updateSliderValue($event)" :sliderValue="item.itemInfo.sliderValue"
                @applySelectedValues="handleApplySelectedValues(item.id)" :applyButtonIsActive="applyButtonIsActive"
                :addButtonIsActive="addButtonIsActive" />
        </template>
    </div>

    <!-- Global alert system portal -->
    <Teleport to="body">
        <Alert :isVisible="alertState.isVisible" :message="alertState.message" :class="alertState.class" />
    </Teleport>
</template>

<style lang="scss">
.configurator-body--terminals {
    max-height: 570px;
    overflow: auto;
    margin-bottom: -30px;
    padding-bottom: 30px;

    &::-webkit-scrollbar {
        width: 5px;
        max-height: 100px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
        background: #E6E8EB;
        border-radius: 2px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
        background: #007CBE;
        border-radius: 2px;
    }
}
</style>