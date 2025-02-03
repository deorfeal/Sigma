import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrderFormStore = defineStore('orderStore', () => {
    const orderFormData = ref<Record<string, string>>();

    // Функция для обновления значения конкретного селекта
    function setOrderFormData(formData: Record<string, string>) {
        orderFormData.value = formData
    }

    return { orderFormData, setOrderFormData }
});