<script setup lang="ts">
import { ref, watch } from 'vue'
import AccessoriesItem from '../components/AccessoriesItem.vue';
import { showAlert, useAlertState } from '../utils/alertManager'; // Импорт функции showAlert
import { useOrientationStore } from '../stores/orientationStore';
const orientationStore = useOrientationStore()

import { useCasesSelectsStore } from '../stores/casesSelectsStore'; // Импортируем стор
const casesSelectsStore = useCasesSelectsStore()

const accessoriesItems = ref<Record<string, string>[]>([ // Массив аксессуаров
    { img: 'images/accessories-icon-1.png', activedImg: 'images/accessories-icon-active-1.png', text: 'Respiratory valve' },
    { img: 'images/accessories-icon-2.png', activedImg: 'images/accessories-icon-active-2.png', text: 'Installation plate' },
    { img: 'images/accessories-icon-3.png', activedImg: 'images/accessories-icon-active-3.png', text: 'Tag plate' },
    { img: 'images/accessories-icon-4.png', activedImg: 'images/accessories-icon-active-4.png', text: 'Grounding plate' },
])

const accessoriesIsActive = ref<boolean>(false);

function toggleAccessoriesState() {
    accessoriesIsActive.value = !accessoriesIsActive.value
}

const activeAccessories = ref<number[]>([]);
const lockedAccessories = new Set<number>(); // Значения, добавленные через watch

let previousValue: string | null = null; // Для хранения предыдущего значения

watch(
    () => casesSelectsStore.selectValues['Case material'],
    (newValue) => {
        const accessory = newValue === '1' ? 3 : 1;

        // Удаляем старое значение, если оно есть
        if (previousValue !== null) {
            const oldAccessory = previousValue === '1' ? 3 : 1;
            const index = activeAccessories.value.indexOf(oldAccessory);
            if (index !== -1) {
                activeAccessories.value.splice(index, 1);
                lockedAccessories.delete(oldAccessory); // Убираем из заблокированных
            }
        }

        // Добавляем новое значение
        if (!activeAccessories.value.includes(accessory)) {
            activeAccessories.value.push(accessory);
            lockedAccessories.add(accessory); // Блокируем это значение для удаления
        }

        previousValue = newValue; // Обновляем предыдущее значение
    },
);

watch(
    () => orientationStore.orientationValue,
    (newValue) => {
        const selectedCase = casesSelectsStore.selectValues['Case material'];
        const selectedSeries = casesSelectsStore.selectValues['A series of polyester'];
        if (selectedCase === '1' && selectedSeries === '0') {
            const accessory = 1; // Аксессуар, связанный с углом поворота
            if (newValue === 90) {
                // Добавляем аксессуар и блокируем возможность удаления
                if (!activeAccessories.value.includes(accessory)) {
                    activeAccessories.value.push(accessory);
                }
                lockedAccessories.add(accessory); // Блокируем
            } else {
                // Удаляем аксессуар и разблокируем возможность добавления
                if (lockedAccessories.has(accessory)) {
                    const index = activeAccessories.value.indexOf(accessory);
                    if (index !== -1) {
                        activeAccessories.value.splice(index, 1);
                    }
                    lockedAccessories.delete(accessory); // Разблокируем
                }
            }
        }
    },
);



function handleToggleSelection(index: number) {
    if (lockedAccessories.has(index)) {
        showAlert('You cannot delete this accessory', 'alert--error');
        return; // Заблокированные значения нельзя удалять
    }

    const exists = activeAccessories.value.includes(index);
    if (exists) {
        activeAccessories.value.splice(activeAccessories.value.indexOf(index), 1);
        showAlert('The accessory is deleted', 'alert--warning');
    } else {
        activeAccessories.value.push(index);
        showAlert('The accessory is added', 'alert--success');
    }
}

</script>

<template>
    <div class="configuratour-item__accessories accessories" :class="{ 'accessories--active': accessoriesIsActive }"
        @mouseenter="toggleAccessoriesState" @mouseleave="toggleAccessoriesState">
        <form class="accessories__form accessories-form" action="#" name="accessoriesForm">
            <div class="accessories-form__inner">
                <template v-for="(item, index) in accessoriesItems" :key="index">
                    <AccessoriesItem :text="item.text" :src="item.img" :activedSrc="item.activedImg" :index="index"
                        :textIsVisible="accessoriesIsActive" @toggleSelection="handleToggleSelection"
                        :isActive="activeAccessories.includes(index)" />
                </template>
            </div>
        </form>
    </div>
</template>

<style lang="scss">
.accessories {
    padding: 30px 10px;
    width: 100%;
    position: absolute;
    top: -1px;
    right: 0;
    bottom: -1px;
    height: calc(100% + 2px);
    width: max-content;
    transition: background 0.3s, border 0.3s, transform 0.3s;
    border-radius: 0 10px 10px 0;
    border: 1px solid transparent;
    border-left: unset;
    z-index: 10;

    &--active {
        transform: translateX(125px);
        background: #F5F6F8;
        border: 1px solid #E6E8EB;
        border-left: unset;
    }

    &--highlight {
        z-index: 20;
        pointer-events: none;
    }
}

.accessories-form {

    &__inner {
        display: grid;
        grid-template-columns: 1fr;
        gap: 5px;
    }
}

@media (max-width: 1450px) {
    .accessories {
        top: 0;
        height: 100%;
        bottom: 0;
        right: 0;
        border: unset;
        border-radius: 0 9px 9px 0;
    }

    .accessories--active {
        transform: unset;
    }
}

@media (max-width: 1350px) {
    .accessories {
        border-radius: 0 0 9px 0;
    }
}
</style>