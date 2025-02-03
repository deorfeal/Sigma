<script setup lang="ts">
import { ref } from 'vue';
import Tub from './Tub.vue';
import Alert from './Alert.vue'; // Импортируйте новый компонент
import { useTerminalsSelectsStore } from '../stores/terminalsSelectsStore';
import { useCasesSelectsStore } from '../stores/casesSelectsStore';
import { isSelectsFilled } from '../utils/isSelectsFilled';
import { showAlert, useAlertState } from '../utils/alertManager'; // Импорт функции showAlert
import { useInputsSelectsStore } from '../stores/inputsSelectsStore';

const alertState = useAlertState(); // Получаем состояние алерта

const casesSelectsStore = useCasesSelectsStore();

const tubItems = <string[]>[
    'Frame', 'Terminals', 'Cable inputs'
];

const activeTub = ref<number>(0);

// Массив проверок, где индекс соответствует номеру таба
const checks = [
    () => true, // Для таба 0
    () => isSelectsFilled(casesSelectsStore.selectValues), // Для таба 1
    () => isSelectsFilled(casesSelectsStore.selectValues), // Для таба 2
];

const emit = defineEmits<{
    (event: 'changeTub', newTab: number): void;
}>();

function changeTub(newTab: number) {
    if (checks[newTab]()) {
        activeTub.value = newTab;
        emit('changeTub', newTab);
    } else {
        showAlert('To go to the next section, you need to fill out all the fields in the previous stages', 'alert--warning'); // Используйте showAlert
    }
}
</script>

<template>
    <div class="configuratour__tubs tubs">
        <Tub class="tubs__tub" v-for="(item, index) in tubItems" :key="index" :title="item" :index="index"
            :activeTub="activeTub" @changeTub="changeTub($event)" />
    </div>
    <Teleport to="body">
        <Alert :isVisible="alertState.isVisible" :message="alertState.message" :class="alertState.class" />
    </Teleport>
</template>

<style lang="scss">
.tubs {
    position: absolute;
    left: -60px;
    display: grid;
    grid-template-columns: 60px;
    grid-template-rows: 137px 137px 137px;
    background: #F5F6F8;
    border-radius: 10px 0 0 10px;
}

@media (max-width: 1350px) {
    .tubs {
        position: unset;
        transform: unset;
        grid-template-rows: unset;
        width: 100%;
        grid-template-columns: 1fr 1fr 1fr;
        border-radius: 10px 10px 0 0;
        overflow: hidden;
    }
}

</style>
