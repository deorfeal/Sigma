import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCasesSelectsStore = defineStore('casesSelectsStore', () => {
    // Хранение значений всех селектов в одном объекте
    const selectValues = ref<Record<string, string>>({
        'Case material': '',
        'A series of polyester': '',
        'The series is steel': '',
        'Size': ''
    });

    // Функция для обновления значения конкретного селекта
    function setSelectValue(key: string, value: string) {
        selectValues.value[key] = value;
    }

    // Функция для удаления конкретного селекта
    function deleteSelectValue(key: string) {
        delete selectValues.value[key];
    }

    return { selectValues, setSelectValue, deleteSelectValue }
});