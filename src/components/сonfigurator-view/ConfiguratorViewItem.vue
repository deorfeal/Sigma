<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue';
import Side from './Side.vue';
import Rail from './Rail.vue'
import Revert from '../Revert.vue'
import Info from '../Info.vue'
import Inlets from './Inlets.vue'
import type { Ref } from '@vue/reactivity';
import { showAlert, useAlertState } from '../../utils/alertManager'; // Импорт функции showAlert
import { generateUniqueId } from '../../utils/generateId';

const props = defineProps<{ // Пропсы для компонента из родителя ConfiguratorView
    src: string;
    isDefault: boolean;
    isVisible: boolean;
    currentTab: number;
}>();

const sides = <Record<string, string>[]>[ // Массив путей к изображениям сторон
    { side: 'A', src: 'images/frame-side-y.svg', text: 'Side A' },
    { side: 'D', src: 'images/frame-side-x.svg', text: 'Side D' },
    { side: 'B', src: 'images/frame-side-y.svg', text: 'Side B' },
    { side: 'C', src: 'images/frame-side-x.svg', text: 'Side C' },
];

const inputsSides = <Record<string, string>[]>[ // Массив путей к изображениям сторон
    { side: 'A', src: 'images/frame-side-y-inputs.svg' },
    { side: 'D', src: 'images/frame-side-x-inputs.svg' },
    { side: 'B', src: 'images/frame-side-y-inputs.svg' },
    { side: 'C', src: 'images/frame-side-x-inputs.svg' }
];

const currentSrc = computed(() => { // Вычисляемое свойство для определения активного изображения
    return props.currentTab === 2 ? inputsSides : sides
});

const degrees = ref<number>(0); // Константа с углом поворота

function updateRotation(newDegrees: number) { // Функция поворота
    degrees.value = newDegrees
    showAlert(`The rail is returned to ${newDegrees + '°'}`, 'alert--success');
}

const isRail = inject<Ref<string>>('isRail') // Инжектим значения из родительского компонента App
const isTerminals = inject<Ref<string>>('isTerminals') // Инжектим значения из родительского компонента App
const isInputs = inject<Ref<string>>('isInputs') // Инжектим значения из родительского компонента App

// Типы для структур данных
interface ComponentItem {
    mainLocation: string;
    additionalLocation: string;
    componentsItems: string[];
}

interface NewValue {
    inputsValues: {
        side: keyof InputItems;
        componentValues: { Компонент: string };
        mainLocation: string;
        additionalLocation: string;
        count: number;
    };
    fromAdditionalBlock: boolean;
}

interface InputItems {
    A: ComponentItem;
    B: ComponentItem;
    C: ComponentItem;
    D: ComponentItem;
}

const addedInputsValues = inject<Ref<NewValue>>('addedInputsValues');
const acitveInputsTab = inject<Ref<number>>('acitveInputsTab');

const activeInputsTabString = computed(() => {
    const sidesNames = ['A', 'B', 'C', 'D'];
    if (!acitveInputsTab?.value) return '';
    return sidesNames[acitveInputsTab?.value]
})

// Инициализация состояния
const inputsIsAdded = ref(false);

const inputsItems = ref<InputItems>({
    A: { mainLocation: '', additionalLocation: '', componentsItems: [] },
    B: { mainLocation: '', additionalLocation: '', componentsItems: [] },
    C: { mainLocation: '', additionalLocation: '', componentsItems: [] },
    D: { mainLocation: '', additionalLocation: '', componentsItems: [] },
});

const currentInputItem = computed(() => { // Вычисляемое свойство для определения активного изображения
    if (acitveInputsTab?.value === 0) return inputsItems.value['A' as keyof InputItems]
    if (acitveInputsTab?.value === 1) return inputsItems.value['B' as keyof InputItems]
    if (acitveInputsTab?.value === 2) return inputsItems.value['C' as keyof InputItems]
    if (acitveInputsTab?.value === 3) return inputsItems.value['D' as keyof InputItems]
});

const activedSides = ref(
    {
        A: false,
        B: false,
        C: false,
        D: false
    }
)

// Наблюдение за изменениями
watch(
    () => addedInputsValues?.value,
    (newValue) => {
        if (!newValue) return;
        inputsIsAdded.value = true
        const handler = newValue.fromAdditionalBlock ? addAdditionalInput : addMainInput;
        handler(newValue);
    },
    { deep: true }
);

// Добавление основной точки
function addMainInput(newValue: NewValue) {
    const { side, componentValues, mainLocation } = newValue.inputsValues;

    // Удаляем предыдущие элементы с флагом main
    inputsItems.value[side].componentsItems = inputsItems.value[side].componentsItems.filter(
        (item) => !item.includes('main')
    );

    console.log(inputsItems.value, 'value')

    // Добавляем новые компоненты с уникальным ID и флагом main
    addComponent(newValue, componentValues.Компонент === '0' ? 'plug' : 'cabel', false, 'main');
    inputsItems.value[side].mainLocation = mainLocation;

    activedSides.value[side] = true;
}

// Добавление дополнительной точки
function addAdditionalInput(newValue: NewValue) {
    const { side, componentValues, additionalLocation } = newValue.inputsValues;

    // Удаляем предыдущие элементы с флагом additional
    inputsItems.value[side].componentsItems = inputsItems.value[side].componentsItems.filter(
        (item) => !item.includes('additional')
    );

    // Добавляем новые компоненты с уникальным ID и флагом additional
    addComponent(newValue, componentValues.Компонент === '0' ? 'plug' : 'cabel', true, 'additional', additionalLocation);
    inputsItems.value[side].additionalLocation = additionalLocation;
}

// Универсальная функция добавления компонента
function addComponent(
    newValue: NewValue,
    componentType: string,
    isAdditional: boolean,
    flag: string, // Флаг: main или additional
    position?: string
) {
    const side = newValue.inputsValues.side;
    const componentsItems = inputsItems.value[side].componentsItems;

    // Генерация уникального компонента с флагом и ID
    const uniqueComponent = `${componentType}-${flag}-${generateUniqueId()}`;

    if (isAdditional && position) {
        const positionMap: Record<string, (item: string) => void> = {
            Left: (item) => componentsItems.unshift(item),
            Center: (item) => {
                const middleIndex = Math.floor(componentsItems.length / 2);
                componentsItems.splice(middleIndex, 0, item);
            },
            Right: (item) => componentsItems.push(item),
        };
        positionMap[position]?.(uniqueComponent);
    } else {
        for (let i = 0; i < newValue.inputsValues.count; i++) {
            componentsItems.push(uniqueComponent);
        }
    }
}


function inletsClass(index: string): string {
    const length = inputsItems.value[index as keyof InputItems].componentsItems.length;
    const classes = <Record<string, string>>{
        1: 'inlets--one',
        2: 'inlets--two',
        3: 'inlets--three',
        4: 'inlets--four',
    }

    return classes[length.toString()] || 'inlets--more';
}

</script>

<template>
    <template v-if="isVisible">
        <div class="configurator-view__wrapper">
            <template v-if="!isDefault">
                <Side v-for="(side, index) in currentSrc" :key="index" :img="side.src" :text="side.text"
                    :inputItem="activeInputsTabString === side['side'] ? currentInputItem : inputsItems[side['side'] as keyof InputItems]"
                    :inputsIsVisible="currentTab === 2 ? true : false" :side="side['side']">
                </Side>
            </template>
            <Rail v-if="isRail" :style="{ 'transform': `translateX(-50%) translateY(-50%) rotate(${degrees}deg)` }" />
            <div class="configurator-view__body">
                <template v-for="(item, index) in activedSides">
                    <Inlets v-if="isInputs && item === true"
                        :class="[inletsClass(index), index, (inputsItems[index].componentsItems[0].includes('cabel') ? 'inlets inlets--cabels' : '')]"
                        :inletsArray="inputsItems[index].componentsItems" :side="index" />
                </template>
                <picture class="configurator-view__img"
                    :class="{ 'configurator-view__img--stock': src === 'images/frame-img-stock.svg' }">
                    <img :src="src" alt="img">
                </picture>
                <picture v-if="inputsIsAdded && currentTab === 2" class="configurator-view__grounding">
                    <img src="../../../public/images/grounding-icon.svg" alt="img">
                </picture>
            </div>
        </div>
        <Revert v-if="isTerminals" @changeOrientation="updateRotation($event)" class="configuratour-view__revert" />
        <Info v-if="isTerminals || isInputs" class="configurator-view__info" />
    </template>
</template>

<style lang="scss">
.configurator-view {
    &__wrapper {
        display: flex;
        width: 470px;
        height: 470px;
        position: relative;
        justify-content: center;
        align-items: center;
        z-index: 1;

        &--stock {
            .configurator-view__img {
                width: 100%;
                height: 100%;
            }
        }
    }

    &__img {
        display: block;
        width: 200px;
        height: 200px;

        &--stock {
            width: 470px;
            height: 470px;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    &__body {
        position: relative;
    }

    &__grounding {
        position: absolute;
        width: 60px;
        height: 18px;
        bottom: 50px;
        right: -22px;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}
</style>