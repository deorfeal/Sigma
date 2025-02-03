<script setup lang="ts">
import { ref, provide, computed, watch } from 'vue';
// View components for different configuration sections
import CasesView from './views/CasesView.vue';
import TerminalsView from './views/TerminalsView.vue';
import InputsView from './views/InputsView.vue';
// Configuration components
import Accessories from './components/Accessories.vue';
import Tubs from './components/Tubs.vue';
import ConfiguratorView from './components/сonfigurator-view/ConfiguratorView.vue';

// Instruction system imports
import Instruction from './components/Instruction.vue';
import { instructionData } from './constans/instructionData'

// State management for input selections
import { useInputsSelectsStore } from './stores/inputsSelectsStore';
const inputsSelectsStore = useInputsSelectsStore()

// Active tab state management
const activeTub = ref<number>(0);

// Feature toggle flags for child components
const isRail = ref<boolean>(false)
const isTerminals = ref<boolean>(false)
const isInputs = ref<boolean>(false)

// Provide state to child components
provide('isRail', isRail)
provide('isTerminals', isTerminals)
provide('isInputs', isInputs)

// Handles tab switching and updates feature flags
function changeComponent(newTab: number) {
  activeTub.value = newTab;
  isRail.value = newTab > 0;
  isTerminals.value = newTab === 1;
  isInputs.value = newTab === 2;
}

// State management for input additions
const providedInputsValues = ref();
const acitveInputsTab = ref<number>();
provide('addedInputsValues', providedInputsValues);
provide('acitveInputsTab', acitveInputsTab);

// Handles input additions from different sources
function handleAddInputs(index: number, fromAdditionalBlock: boolean, activeTub: number): void {
  const inputsValues = inputsSelectsStore.selectsValues[fromAdditionalBlock ? 'additionalSelectsValues' : 'mainSelectsValues'][index]

  // Deep clone to break reactivity reference
  const result = JSON.parse(JSON.stringify({ inputsValues, fromAdditionalBlock }));
  providedInputsValues.value = result;
  acitveInputsTab.value = activeTub;
}

// Instruction system state
const activatedInstructions = ref<number[]>([]);
const accessoriesIsHighlight = ref(false);
const configuratorIsHighlight = ref(false);
const instructions = ref(getInstructionsByName('casesInstructionData'));
const popupsState = ref<boolean[]>([]);
const stateReloaded = ref(false)

// Updates instruction state when tab changes 
function updateState(groupName: keyof typeof instructionData) {
  if (activatedInstructions.value.includes(activeTub.value)) return
  activatedInstructions.value.push(activeTub.value);
  instructions.value = getInstructionsByName(groupName);
  popupsState.value = Array(instructions.value.length).fill(false);
  popupsState.value[0] = true; // Activate first instruction
  activeTub.value === 1 || activeTub.value === 2 ? configuratorIsHighlight.value = true : null
}

function handleAccessoriesHighlight(index: number) {
  if (index === 1) {
    accessoriesIsHighlight.value = true;
  } else {
    accessoriesIsHighlight.value = false;
  }
}

function getInstructionsByName(name: keyof typeof instructionData) {
  return instructionData[name];
}


// Watch for tab changes to update instructions
watch(
  () => activeTub.value,
  (newValue) => {
    const instructionGroups: Record<number, keyof typeof instructionData> = {
      0: 'casesInstructionData',
      1: 'terminalsInstructionData',
      2: 'inputsInstructionData',
    };

    const groupName = instructionGroups[newValue];
    if (groupName) updateState(groupName);
    activeTub.value > 0 ? stateReloaded.value = true : null
  },
  { immediate: true }
);


// Handles instruction popup state progression 
function handleClosePopup(index: number): void {
  if (index >= 0 && index < popupsState.value.length) {
    popupsState.value[index] = false;
    if (index + 1 < popupsState.value.length) {
      popupsState.value[index + 1] = true;
    }
  }

  // Handle highlight states based on instruction progress
  if (stateReloaded.value) {
    index === 0 ? configuratorIsHighlight.value = false : null
  } else {
    index === 0 ? configuratorIsHighlight.value = true : configuratorIsHighlight.value = false
    index === 1 ? accessoriesIsHighlight.value = true : accessoriesIsHighlight.value = false
  }
}
</script>

<template>
  <div class="wrapper">
    <main class="main">
      <section class="main__сonfigurator сonfigurator">
        <div class="container">
          <div class="сonfigurator__wrapper">
            <!-- Tab navigation component -->
            <Tubs @change-tub="changeComponent($event)" />
            <div class="сonfigurator__inner">
              <div class="configurator__item configurator-item">
                <!-- Keep components alive for state preservation -->
                <KeepAlive>
                  <CasesView v-if="activeTub === 0" @accessoriesHighlight="handleAccessoriesHighlight"
                    :configuratorIsHighlight="configuratorIsHighlight" />
                </KeepAlive>
                <KeepAlive>
                  <TerminalsView v-if="activeTub === 1" :configuratorIsHighlight="configuratorIsHighlight" />
                </KeepAlive>
                <KeepAlive>
                  <InputsView @addInputs="handleAddInputs" v-if="activeTub === 2"
                    :configuratorIsHighlight="configuratorIsHighlight" />
                </KeepAlive>

                <!-- Main configurator component -->
                <ConfiguratorView v-if="activeTub !== 3" :itemsCount="3" :withDefault="true" :isRail="isRail"
                  :currentTab="activeTub" />

                <!-- Accessories panel with conditional highlight -->
                <Accessories :class="{ 'accessories--highlight': accessoriesIsHighlight }" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Dynamic instruction popups -->
      <template v-for="(instruction, index) in instructions" :key="index">
        <Instruction :itemData="instruction" :isActive="popupsState[index]" @closePopup="handleClosePopup(index)" />
      </template>
    </main>
  </div>
</template>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.сonfigurator {
  padding-top: clamp(40px, calc(15px + (80 - 40) * ((100vw - 375px) / (1165 - 375))), 80px);
  padding-bottom: clamp(40px, calc(15px + (80 - 40) * ((100vw - 375px) / (1165 - 375))), 80px);
  overflow: hidden;

  &__wrapper {
    display: flex;
    align-items: flex-start;
    position: relative;
  }

  &__inner {
    width: 100%;
  }
}

// item 

.configurator-item {
  display: flex;
  position: relative;
  align-items: flex-start;
  gap: 30px;
  border: 1px solid #E6E8EB;
  border-radius: 0 10px 10px 10px;
  padding: clamp(15px, calc(15px + (30 - 15) * ((100vw - 375px) / (1165 - 375))), 30px);
  min-height: 600px;

  &--active {
    display: flex;
  }

  &--accessories {
    border-radius: 0px 10px 10px 0px;
    padding-left: 40px;
    min-height: 548px;
    padding-bottom: 120px;

    .info {
      right: 30px;
      bottom: 30px;
    }
  }

  &--terminals {
    .configurator-body {
      max-height: 570px;
      overflow: auto;
      margin-bottom: -30px;
      padding-bottom: 30px;

      /* width */
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
  }

  &--inputs {
    .info {
      right: 30px;
      bottom: 30px;
    }

    .configurator-body__wrapper {

      &--active {
        display: block;
      }
    }
  }
}

.configurator-body {
  width: 100%;
  max-width: 485px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 25px;

  &--highlight {
    z-index: 20;
    position: relative;
    pointer-events: none;
  }

  &__inner {
    .configurator-body__wrapper {
      display: none;

      .configurator-body__title {
        margin-bottom: 15px;
        font-size: 16px;
        line-height: 24px;
      }

      &--active.configurator-body__wrapper--tub-active {
        display: block;
      }
    }
  }

  &__wrapper {
    background: #F5F6F8;
    border-radius: 6px;
    padding-top: clamp(15px, calc(30px + (35 - 5) * ((100vw - 375px) / (1165 - 375))), 35px);
    padding-right: clamp(15px, calc(15px + (30 - 15) * ((100vw - 375px) / (1165 - 375))), 30px);
    padding-bottom: clamp(15px, calc(30px + (35 - 15) * ((100vw - 375px) / (1165 - 375))), 35px);
    padding-left: clamp(15px, calc(15px + (30 - 15) * ((100vw - 375px) / (1165 - 375))), 30px);

    position: relative;
    height: max-content;

    &--disabled {
      .form {
        pointer-events: none;
      }

      .form__add {
        display: none;
      }

      .count {
        margin-bottom: unset;
      }
    }

    &--tubs {
      .inputs-location {
        margin-bottom: unset;
      }
    }
  }

  &__title {}

  &__close {
    position: absolute;
    top: 40px;
    right: 30px;
    width: 16px;
    height: 16px;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  transition: opacity 0.3s;

  &__row {
    display: flex;
    align-items: center;
    gap: 15px;
    width: 100%;
    margin-bottom: 20px;
    margin-top: 10px;

    &:last-child {
      margin-bottom: unset;
    }
  }

  &--additional {
    .count {
      margin-bottom: 10px;
    }
  }

  &__apply {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 7px 10px;
    background: #007CBE;
    border: 1px solid #007CBE;
    border-radius: 4px;
    color: #fff;
    font-size: 16px;
    line-height: 26px;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    transition: background 0.3s, color 0.3s, border 0.3s;
    max-width: max-content;
    text-transform: uppercase;

    &:hover {
      background: transparent;
      color: #007CBE;
    }
  }

  &__add {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 10px 20px;
    background: #007CBE;
    border: 1px solid #007CBE;
    border-radius: 4px;
    color: #fff;
    font-size: 18px;
    line-height: 26px;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    transition: background 0.3s, color 0.3s, border 0.3s;
    max-width: max-content;
    text-transform: uppercase;

    &:hover {
      background: transparent;
      color: #007CBE;
    }
  }
}

.btn--disabled {
  color: #A9ACB4;
  border: 1px solid #E6E8EB;
  background: #E6E8EB;
  pointer-events: none;
}

.form.disabled {
  pointer-events: none;
}

// Media 

@media (max-width: 1350px) {
  .configurator-item {
    border-radius: 0 0 10px 10px;
  }

  .сonfigurator__wrapper {
    flex-direction: column;
  }
}

@media (max-width: 1150px) {
  .configurator-item {
    flex-direction: column;
  }

  .configurator-view {
    order: -1;
    margin-top: unset;
  }

  .configurator-body {
    max-width: 100% !important;
    overflow: unset !important;
    max-height: unset !important;
    margin-bottom: unset !important;
    padding-right: unset;
  }

  .configurator-body--terminals {
    padding-bottom: unset;
  }

  .configurator-view {
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 850px) {
  .order__wrapper:nth-child(2) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .configurator-item {
    padding-top: 550px;
  }

  .configurator-view {
    position: absolute;
    top: 30px;
    left: 50%;
    width: 100%;
    transform: translateX(-50%);
  }

  .revert {
    left: 30px;
  }

  .configurator-view {
    height: 475px;

    .info {
      right: 30px;
    }
  }

  .configurator-view__wrapper {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    transform-origin: 0% 25%;
  }
}

@media (max-width: 600px) {
  .configurator-view__wrapper {
    transform: scale(0.9) translateX(-50%);
  }
}

@media (max-width: 550px) {
  .configurator-view__wrapper {
    transform: scale(0.8) translateX(-50%);
  }

  .inputs-item__view picture {
    transform: scale(0.9);
  }

  .configurator-item--accessories {
    // padding-bottom: 30px !important;
  }
}

@media (max-width: 500px) {
  .configurator-view__wrapper {
    transform: scale(0.7) translateX(-50%);
  }

  .configurator-view {
    height: 425px;
  }

  .configurator-item {
    padding-top: 500px;
  }

  .inputs-item__view picture {
    transform: scale(0.8);
  }
}

@media (max-width: 450px) {
  .inputs-item__view picture {
    transform: scale(0.7);
  }

  .form--additional {
    .inputs-location__inner {
      grid-template-columns: 1fr 1fr;
    }
  }

  .inputs-location__inner {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 400px) {
  .configurator-view__wrapper {
    transform: scale(0.6) translateX(-50%);
  }

  .configurator-view {
    height: 400px;
  }

  .configurator-item {
    padding-top: 475px;
  }
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
