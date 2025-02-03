import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrientationStore = defineStore('orientationStore', () => {
    const orientationValue = ref<number>(0);

    function setOrientationValue(orientation: number) {
        orientationValue.value = orientation
    }

    return { orientationValue, setOrientationValue, }
});