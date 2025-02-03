import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAccessoriesStore = defineStore('accessoriesStore', () => {
    const accessoriesValue = ref<Record<string, boolean>[]>([
        { 'Respiratory valve': false, },
        { 'Installation plate': false, },
        { 'Tag plate': false, },
        { 'Grounding plate': false, }
    ]);

    function setAccessoriesValue(index: number, isActive: boolean, key: string) {
        accessoriesValue.value[index][key] = isActive
    }

    return { accessoriesValue, setAccessoriesValue }
});