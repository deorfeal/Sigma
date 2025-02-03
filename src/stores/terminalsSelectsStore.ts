import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SelectedValues } from '../interfaces/selects'; // Импортируем тип

export const useTerminalsSelectsStore = defineStore('terminalsSelectsStore', () => {
    // Хранение значений всех селектов в одном объекте
    const selectValues = ref<Record<string, string>[]>([]);

    // Функция для обновления значения конкретного селекта
    function setSelectValue(object: SelectedValues, id: number, count: number) {
        const idString = id.toString();
        const countString = count.toString();

        // Проверяем, есть ли объект с таким id
        const existingItemIndex = selectValues.value.findIndex(item => item.id === idString);

        if (existingItemIndex === -1) {
            // Если объекта нет, добавляем новый
            selectValues.value.push({ ...object, id: idString, count: countString });
        } else {
            // Если объект существует, обновляем его
            selectValues.value[existingItemIndex] = { ...object, id: idString, count: countString };
        }
    }


    // Функция для удаления конкретного селекта
    function removeSelectValue(id: number) {
        selectValues.value = selectValues.value.filter((item) => item.id !== id.toString());
    }

    return { selectValues, setSelectValue, removeSelectValue }
});