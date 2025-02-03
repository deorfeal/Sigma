<script setup lang="ts">
import { ref, computed } from 'vue';
// Component imports
import ConfiguratorItem from '../components/ConfiguratorItem.vue';
import Sides from '../components/Sides.vue';
import Locations from '../components/Locations.vue';
import Order from '../components/Order.vue';
import Alert from '../components/Alert.vue';

// Type definitions and stores
import type { SelectsValues, SelectedValues } from '../interfaces/selects';
import type { ItemInfo } from '../interfaces/itemInfo';
import { useInputsSelectsStore } from '../stores/inputsSelectsStore';
const inputsSelectsStore = useInputsSelectsStore();

// Alert system
import { showAlert, useAlertState } from '../utils/alertManager';
const alertState = useAlertState();

// Component interface
const props = defineProps<{
    configuratorIsHighlight: boolean;
}>();

const emit = defineEmits<{
    (e: 'addInputs', index: number, fromAdditionalBlock: boolean, activeTub: number): void;
}>();

// Form validation state
const selectedValuesForValidation = ref<SelectedValues>({
    'Size': '',
    'Component': '',
    'Material': '',
    'Type of component': ''
});

// Tab management
const activeTub = ref<number>(1);
const selectTab = (tab: number) => {
    activeTub.value = tab;
    applyButtonIsActive.value = false;
    addButtonIsActive.value = false;
};

// Location management system
const locations = ref<{ type: 'main' | 'additional'; data: Record<number, boolean>[] }[]>([
    { type: 'main', data: Array(4).fill({ 0: false, 1: false }) },
    { type: 'additional', data: Array(4).fill({ 0: false, 1: false, 2: false }) }
]);

// UI state controllers
const mainLocationsAvailability = ref<boolean[]>([true, true, true, true]);
const additionalLocationsVisibility = ref<boolean[]>([false, false, false, false]);

// Resets location selections for a specific tab
function resetLocationData(locationData: Record<number, boolean>[], index: number) {
    locationData[index] = Object.keys(locationData[index]).reduce((acc, key) => {
        acc[Number(key)] = false;
        return acc;
    }, {} as Record<number, boolean>);
}

// Store synchronization
function syncSelectedLocationWithStore(tabIndex: number, selectedIndex: number, isMainLocations: boolean) {
    inputsSelectsStore.setLocationValue(tabIndex, selectedIndex, isMainLocations);
}

// Validates form state for submission
function validateApplyButton(
    selectedValues: SelectedValues,
    index: number,
    fromAdditionalBlock: boolean
) {
    const selectsFilled = Object.values(selectedValues).every(value => value !== null && value !== '');
    let locationGroup = ref(locations.value[0]);
    const hasActiveAdditionalLocation = additionalLocationsVisibility.value.some((visible, i) => i === index && visible);
    if (fromAdditionalBlock) {
        if (hasActiveAdditionalLocation) {
            locationGroup.value = locations.value[1];
        }
    }
    const hasActiveLocation = ref(locationGroup.value.data[index] && Object.values(locationGroup.value.data[index]).includes(true));
    applyButtonIsActive.value = selectsFilled && hasActiveLocation.value;
}

// UI interaction handlers
function handleCheckedLocation(tabIndex: number, selectedIndex: number, isMainLocations: boolean) {
    const locationType = isMainLocations ? 'main' : 'additional';
    const locationGroup = locations.value.find(loc => loc.type === locationType);

    if (locationGroup) {
        resetLocationData(locationGroup.data, tabIndex);
        locationGroup.data[tabIndex][selectedIndex] = true;
    }

    syncSelectedLocationWithStore(tabIndex, selectedIndex, isMainLocations);
    validateApplyButton(selectedValuesForValidation.value || {}, tabIndex, !isMainLocations);
}

// Dynamic block management
const sliderValue = ref<number>(0);
const createItem = (title: string, hasAddNew: boolean = false) => ({
    itemInfo: {
        hasSlider: true,
        hasAdd: true,
        willCloses: false,
        title,
        disabled: false,
        hasAddNew
    }
});

// Configuration blocks state
const allBlocks = ref<Record<string, Array<{ itemInfo: ItemInfo }>>>(
    {
        'mainBlock': Array(4).fill(null).map(() => createItem('Cable input', true)),
        'additionalBlock': Array(4).fill(null).map(() => createItem('Cable input'))
    },
);


// Selection options data
const selectsValues = ref<SelectsValues>({
    'Size': ['М20', 'М25', 'М32', 'М40', 'М50'].map((text, value) => ({ value: value.toString(), text })),
    'Component': ['Plug', 'Cable gland'].map((text, value) => ({ value: value.toString(), text })),
    'Material': ['Plastic', 'Metal'].map((text, value) => ({ value: value.toString(), text })),
    'Type of component': ['Armored', 'Unstable'].map((text, value) => ({ value: value.toString(), text }))
});

// Store synchronization functions
function syncSelectedValuesWithStore(selectedValues: SelectedValues, index: number, fromAdditionalBlock: boolean) {
    inputsSelectsStore.setSelectValue(selectedValues, index, fromAdditionalBlock);
}

function syncSliderValueWithStore(sliderValue: number, index: number, fromAdditionalBlock: boolean) {
    inputsSelectsStore.setSliderValue(sliderValue, index, fromAdditionalBlock);
}

// Задаем начальное значение
const startedValues = ref(inputsSelectsStore.selectsValues);

// Dynamic filter type resolver
function getFilterType(index: number, fromAdditionalBlock: boolean) {
    const targetArray = fromAdditionalBlock
        ? inputsSelectsStore.selectsValues['additionalSelectsValues']
        : inputsSelectsStore.selectsValues['mainSelectsValues'];

    const componentValue = targetArray[index]['componentValues']['Component'];
    return componentValue === '0' ? '0' : componentValue === '1' ? '1' : 'started';
}

// Filter configurations
const filterObject = <Record<string, string[]>>(
    {
        'started': ['Size', 'Component'],
        '0': ['Size', 'Component', 'Material'],
        '1': ['Size', 'Component', 'Type of component']
    }
)

// Handles selection updates with validation
function addSelectedValues(selectedValues: SelectedValues, index: number, fromAdditionalBlock: boolean) {
    syncSelectedValuesWithStore(selectedValues, index, fromAdditionalBlock);

    if (fromAdditionalBlock) {
        const mainSize = inputsSelectsStore.selectsValues['mainSelectsValues'][index]['componentValues']['Size'];
        const additionalSize = inputsSelectsStore.selectsValues['additionalSelectsValues'][index]['componentValues']['Size'];
        additionalLocationsVisibility.value[index] = additionalSize > mainSize;
    }

    selectedValuesForValidation.value = selectedValues;
    validateApplyButton(selectedValues, index, fromAdditionalBlock);
}

// UI state controllers
const additionalBlockIsVisible = ref<number>();
const applyButtonIsActive = ref<boolean>(false);
const addButtonIsActive = ref<boolean>(false);

// Handles slider value updates
function updateSliderValue(number: number, index: number, fromAdditionalBlock: boolean) {
    sliderValue.value = number;
    syncSliderValueWithStore(sliderValue.value, index, fromAdditionalBlock)
    validateApplyButton(selectedValuesForValidation.value || {}, index, fromAdditionalBlock);
}

// Manages block state transitions
function handleAdd(index: number, fromAdditionalBlock: boolean) {
    const disableBlock = (blockType: 'mainBlock' | 'additionalBlock') => {
        allBlocks.value[blockType][index].itemInfo.disabled = true;
        allBlocks.value[blockType][index].itemInfo.hasAdd = false;
    };

    if (fromAdditionalBlock) {
        if (!additionalLocationsVisibility.value[index]) {
            disableBlock('additionalBlock');
        }
    } else {
        mainLocationsAvailability.value[index] = false;
        additionalBlockIsVisible.value = index;
        disableBlock('mainBlock');
    }

    showAlert('An additional block is added', 'alert--success');
}

// Finalizes form submission
async function handleApplySelectedValues(index: number, fromAdditionalBlock: boolean) {
    const selectType = fromAdditionalBlock ? 'additionalSelectsValues' : 'mainSelectsValues';
    if (inputsSelectsStore.selectsValues[selectType][index]['count'] === 0) {
        showAlert('Add at least one input', 'alert--warning');
        return
    }

    const hasActiveLocation = (): boolean =>
        Object.values(locations.value[fromAdditionalBlock ? 1 : 0].data[index]).includes(true);

    if (hasActiveLocation()) {
        emit('addInputs', index, fromAdditionalBlock, activeTub.value);
        showAlert('Inputs are added', 'alert--success');
        addButtonIsActive.value = true;
        applyButtonIsActive.value = false;
    } else {
        showAlert('Select at least one location', 'alert--warning');
    }
}

// Order system toggle
const orderIsOpen = ref(false);
const toggleOrderOrder = () => {
    orderIsOpen.value = !orderIsOpen.value;
};
</script>

<template>
    <div class="configurator-item__body configurator-body"
        :class="{ 'configurator-body--highlight': configuratorIsHighlight }">
        <!-- Navigation and location selection -->
        <div class="configurator-body__wrapper configurator-body__wrapper--tubs">
            <Sides @changeTab="selectTab($event)" />
            <template v-for="(item, index) in 4">
                <Locations v-show="index === activeTub" :isMainLocations="true" :index="index"
                    @changeChecked="handleCheckedLocation"
                    :class="mainLocationsAvailability[index] ? '' : 'disabled'" />
            </template>
        </div>

        <!-- Main configuration blocks -->
        <template v-for="(item, index) in allBlocks['mainBlock']" :key="index">
            <ConfiguratorItem v-if="index === activeTub" :selectsValues="selectsValues"
                :startedValues="startedValues['mainSelectsValues'][index]['componentValues']"
                @updateSelectedValues="addSelectedValues($event, index, false)" :itemInfo="item.itemInfo"
                @updateCountOfItems="handleAdd(index, false)"
                @updateSliderValue="updateSliderValue($event, index, false)" :filterObject="filterObject"
                :filterType="getFilterType(index, false)" :sliderValue="startedValues['mainSelectsValues'][index].count"
                :sliderMaxValue="10" :filterWatchedProperty="'Component'"
                @applySelectedValues="handleApplySelectedValues(index, false)"
                :applyButtonIsActive="applyButtonIsActive" :addButtonIsActive="addButtonIsActive" />
        </template>

        <!-- Additional configuration blocks -->
        <template v-for="(item, index) in allBlocks['additionalBlock']" :key="index">
            <ConfiguratorItem v-if="additionalBlockIsVisible === index && index === activeTub"
                :selectsValues="selectsValues"
                :startedValues="startedValues['additionalSelectsValues'][index]['componentValues']"
                @updateSelectedValues="addSelectedValues($event, index, true)" :itemInfo="item.itemInfo"
                @updateCountOfItems="handleAdd(index, true)" @updateSliderValue="updateSliderValue($event, index, true)"
                :filterObject="filterObject" :filterType="getFilterType(index, true)"
                :sliderValue="startedValues['additionalSelectsValues'][index].count" :sliderMaxValue="1"
                :filterWatchedProperty="'Component'" @applySelectedValues="handleApplySelectedValues(index, true)"
                :applyButtonIsActive="applyButtonIsActive">

                <!-- Additional location selectors -->
                <template v-for="(item, index) in 4">
                    <Locations v-show="index === activeTub && additionalLocationsVisibility[index]"
                        :isMainLocations="false" :index="index" @changeChecked="handleCheckedLocation"
                        class="form__inputs-location" />
                </template>
            </ConfiguratorItem>
        </template>

        <!-- Order submission -->
        <button class="configurator-body__order open-order" type="button" @click.prevent="toggleOrderOrder">
            Save and send a request
        </button>
    </div>

    <!-- Portal components -->
    <Teleport to="body">
        <Transition name="fade" mode="out-in">
            <Order v-if="orderIsOpen" @closeOrder="toggleOrderOrder" :class="orderIsOpen ? 'popup--active' : ''"
                @closePopup="toggleOrderOrder" />
        </Transition>
        <Alert :isVisible="alertState.isVisible" :message="alertState.message" :class="alertState.class" />
    </Teleport>
</template>

<style lang="scss">
.open-order {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #F2A41F;
    border: 1px solid #F2A41F;
    padding: 10px 20px;
    color: #fff;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 700;
    font-size: clamp(16px, calc(16px + (18 - 2) * ((100vw - 375px) / (1165 - 375))), 18px);
    line-height: clamp(24px, calc(24px + (26 - 2) * ((100vw - 375px) / (1165 - 375))), 26px);
    letter-spacing: 0.54px;
    transition: background 0.3s, color 0.3s;
    font-family: "Oswald", sans-serif;
    width: max-content;

    &:hover {
        background: transparent;
        color: #F2A41F;
    }
}
</style>