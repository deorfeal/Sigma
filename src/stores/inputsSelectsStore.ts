import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SelectedValues } from '../interfaces/selects'; // Импортируем тип

// Функция для генерации объекта с дефолтными значениями
function createDefaultSelect() {
    return {
        'Size': '',
        'Component': '',
        'Material': '',
        'Type of component': ''
    };
}

// Функция для создания объекта с четырьмя сторонами (A, B, C, D), включая свойство count
function generateSelects(count: number) {
    return [
        {
            added: false,
            side: 'A',
            componentValues: createDefaultSelect(),
            count,
            mainLocation: '',
            additionalLocation: '',
        },
        {
            added: false,
            side: 'B',
            componentValues: createDefaultSelect(),
            count,
            mainLocation: '',
            additionalLocation: '',
        },
        {
            added: false,
            side: 'C',
            componentValues: createDefaultSelect(),
            count,
            mainLocation: '',
            additionalLocation: '',
        },
        {
            added: false,
            side: 'D',
            componentValues: createDefaultSelect(),
            count,
            mainLocation: '',
            additionalLocation: '',
        }
    ];
}

export const useInputsSelectsStore = defineStore('inputsSelectsStore', () => {

    // Хранение значений всех селектов в одном объекте
    const selectsValues = ref({
        mainSelectsValues: generateSelects(5), // 4 элемента для mainSelectsValues с объектами для сторон
        additionalSelectsValues: generateSelects(1) // 4 элемента для additionalSelectsValues с объектами для сторон
    });

    // Функция для обновления значения конкретного селекта
    function setSelectValue(selectedValues: SelectedValues, index: number, fromAdditionalBlock: boolean) {
        const targetArray = fromAdditionalBlock ? selectsValues.value['additionalSelectsValues'] : selectsValues.value['mainSelectsValues'];

        // Получаем текущий объект по индексу
        const currentValues = targetArray[index]['componentValues'];

        // Обновляем все ключи из selectedValues, добавляем отсутствующие с значением ''
        targetArray[index]['componentValues'] = {
            ...currentValues,
            ...Object.keys(currentValues).reduce((acc: { [key: string]: string }, key) => {
                // Если ключ в selectedValues отсутствует, ставим значение ''
                acc[key] = selectedValues[key] !== undefined ? selectedValues[key] : '';
                return acc;
            }, {})
        };
    }


    // Функция для обновления значения количества
    function setSliderValue(selectedValue: number, index: number, fromAdditionalBlock: boolean) {
        const targetArray = fromAdditionalBlock ? selectsValues.value['additionalSelectsValues'] : selectsValues.value['mainSelectsValues'];

        // Обновляем значение количества
        targetArray[index]['count'] = selectedValue;
    }

    // Функция для обновления значения локации
    function setLocationValue(tabIndex: number, selectedIndex: number, isMainLocations: boolean) {
        const locationTarget = isMainLocations ? selectsValues.value.mainSelectsValues : selectsValues.value.additionalSelectsValues;

        const mainLocations = ['Chess', 'Linear'];
        const additionalLocations = ['Left', 'Center', 'Right'];

        locationTarget[tabIndex][isMainLocations ? 'mainLocation' : 'additionalLocation'] =
            isMainLocations ? mainLocations[selectedIndex] || '' : additionalLocations[selectedIndex] || '';
    }

    // Функция для обновления значения добавления
    function setAdded(added: boolean, index: number, fromAdditionalBlock: boolean) {
        const targetArray = fromAdditionalBlock ? selectsValues.value['additionalSelectsValues'] : selectsValues.value['mainSelectsValues'];

        // Обновляем значение количества
        targetArray[index]['added'] = added;
    }

    function hasAddedElement(): boolean {
        const { mainSelectsValues, additionalSelectsValues } = selectsValues.value;

        // Проверяем наличие added: true в обоих массивах
        return mainSelectsValues.some(item => item.added) || additionalSelectsValues.some(item => item.added);
    }

    return { selectsValues, setSelectValue, setSliderValue, setLocationValue, setAdded, hasAddedElement }
});
