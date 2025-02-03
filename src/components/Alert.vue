<script setup lang="ts">
import { useAlertState } from '../utils/alertManager';

const alertState = useAlertState(); // Получаем состояние алерта

const icons = <Record<string, string>>{
    'alert--error': 'error-icon.svg', // замените на путь к вашей иконке
    'alert--warning': 'warning-icon.svg', // замените на путь к вашей иконке
    'alert--success': 'success-icon.svg' // замените на путь к вашей иконке
};

const props = defineProps<{
    isVisible: boolean;
    message: string;
    class: string;
}>();
</script>

<template>
    <Transition name="fade" mode="out-in">
        <template v-if="isVisible">
            <div class="alert">
                <div class="alert__inner">
                    <div class="alert__item alert-item" :class="alertState.class">
                        <span class="icon">
                            <img :src="`images/${icons[alertState.class]}`" alt="Alert Icon" />
                        </span>
                        <span class="message">{{ alertState.message }}</span>
                    </div>
                </div>
            </div>
        </template>
    </Transition>
</template>

<style lang="scss">
.alert {
    position: fixed;
    top: 15px;
    right: 15px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.alert-item {
    /* Скрыто по умолчанию */
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: "Oswald", sans-serif;
    font-weight: 700;
    padding: 10px 15px;
    border-radius: 4px;
    font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
    line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
    // opacity: 0;
    max-width: clamp(300px, calc(300px + (750 - 450) * ((100vw - 375px) / (1165 - 375))), 750px);
    /* Прозрачность 0 для анимации */
    // transition: opacity 0.3s ease;

    /* Переход прозрачности за 0.5 секунды */
    .icon {
        display: block;
        width: 20px;
        height: 20px;
        min-width: 20px;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
}

.alert.show {
    display: flex;
    opacity: 1;
    /* Полная видимость */
}

.alert--error {
    background-color: #FFE4E4;
    color: #E23030;
}

.alert--warning {
    background-color: #FFF3D2;
    color: #F46717;
}

.alert--success {
    background-color: #B9F8D2;
    color: #1FA956;
}
</style>
