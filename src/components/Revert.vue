<script setup lang="ts">
import { ref } from 'vue';
import { useOrientationStore } from '../stores/orientationStore';
import { useCasesSelectsStore } from '../stores/casesSelectsStore';
const casesSelectsStore = useCasesSelectsStore()
const orientationStore = useOrientationStore()

const degrees = ref<number>(0); // Константа с углом поворота

const emit = defineEmits<{
    (event: 'changeOrientation', degrees: number): void;
}>();

function rotateRail() { // Функция поворота

    const selectedCase = casesSelectsStore.selectValues['Case material'];
    const selectedSeries = casesSelectsStore.selectValues['A series of polyester'];
    if (selectedCase === '1' && selectedSeries === '0') {
        if (degrees.value === 90) {
            degrees.value = 0
        } else {
            degrees.value += 90;
        }
    } else if (selectedCase === '1' && selectedSeries === '1') {
        if (degrees.value === 135) {
            degrees.value = 0
        } else {
            degrees.value += 45;
        }
    } else {
        if (degrees.value === 90) {
            degrees.value = 0
        } else {
            degrees.value += 90;
        }
    }

    orientationStore.setOrientationValue(degrees.value) // Устанавливаем значение в хранилище
    emit('changeOrientation', degrees.value); // Вызываем событие
}
</script>
<template>
    <div class="revert" @click="rotateRail">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2692_12933)">
                <path
                    d="M1.99507 18.519C1.94685 18.9852 1.90934 19.3763 1.87183 19.7675C1.81825 20.3569 1.4003 20.732 0.837673 20.6891C0.317914 20.6463 -0.0518113 20.2015 -0.00358625 19.6389C0.135731 18.0207 0.280406 16.4025 0.446514 14.7896C0.537606 13.884 1.28777 13.5518 2.02722 14.0716C3.32394 14.9879 4.6153 15.9148 5.90666 16.8418C6.41035 17.2062 6.52287 17.7635 6.19601 18.2136C5.87451 18.6583 5.30117 18.7173 4.79749 18.3582C4.42776 18.0957 4.05803 17.8331 3.64544 17.6027C3.70438 17.6938 3.76333 17.7795 3.82763 17.8653C5.91202 20.7052 8.71979 22.2109 12.2402 22.1091C16.0661 21.9966 18.906 20.1426 20.7975 16.8311C20.8243 16.7829 20.8457 16.7347 20.8725 16.6918C21.1565 16.172 21.6977 15.9952 22.1853 16.2578C22.6568 16.515 22.8015 17.0669 22.5282 17.5813C22.046 18.4922 21.478 19.3442 20.7707 20.0997C18.2308 22.8271 15.0962 24.1828 11.3722 23.9845C7.46594 23.7809 4.41168 21.9644 2.16118 18.7708C2.12903 18.6958 2.08081 18.6369 1.99507 18.519Z"
                    fill="white" />
                <path
                    d="M20.3074 6.43574C19.4501 5.04257 18.3141 3.94947 16.8941 3.16716C14.2257 1.69361 11.434 1.45249 8.57264 2.48665C6.18818 3.34934 4.40921 4.95684 3.18215 7.18055C3.05891 7.4056 2.87136 7.62529 2.66239 7.75925C2.3141 7.97894 1.86935 7.87714 1.58536 7.58243C1.29601 7.28236 1.23707 6.85905 1.44069 6.46789C2.06761 5.26227 2.86065 4.17452 3.8573 3.25289C6.26855 1.0131 9.12455 -0.112148 12.4092 0.0110934C16.2351 0.155769 19.284 1.84365 21.5827 4.89254C21.7059 5.05865 21.8184 5.22476 21.9363 5.39622C21.9417 5.40158 21.9524 5.40158 22.006 5.42837C22.0489 5.00507 22.0864 4.59783 22.1292 4.1906C22.1775 3.68691 22.5365 3.32791 23.008 3.30647C23.6081 3.27432 24.0475 3.7405 23.9993 4.37278C23.9296 5.24619 23.8439 6.11424 23.7635 6.98765C23.6885 7.76997 23.6135 8.55229 23.5385 9.3346C23.5117 9.62931 23.3777 9.85972 23.1259 10.0205C22.7722 10.2455 22.4132 10.2455 22.0703 10.0044C20.7093 9.03989 19.3483 8.07004 17.998 7.09482C17.5639 6.77868 17.4943 6.20533 17.8051 5.78738C18.1105 5.37479 18.6731 5.28906 19.1178 5.59984C19.5197 5.8624 19.9109 6.15175 20.3074 6.43574Z"
                    fill="white" />
            </g>
            <defs>
                <clipPath id="clip0_2692_12933">
                    <rect width="24" height="23.9893" fill="white" />
                </clipPath>
            </defs>
        </svg>
    </div>
</template>

<style lang="scss">
.revert {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 50px;
    height: 50px;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #F2A41F;
    cursor: pointer;

    svg {
        width: 24px;
        height: 24px;
    }
}
</style>