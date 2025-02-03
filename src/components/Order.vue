<script setup lang="ts">

import { ref, nextTick } from 'vue';
import { submitOrder } from '../utils/submitOrder';

import { useOrderFormStore } from '../stores/orderFormStore';
import { useAccessoriesStore } from '../stores/accessoriesStore';
import { useCasesSelectsStore } from '../stores/casesSelectsStore';
import { useTerminalsSelectsStore } from '../stores/terminalsSelectsStore';
import { useOrientationStore } from '../stores/orientationStore';
import { useInputsSelectsStore } from '../stores/inputsSelectsStore';
import { showAlert } from '../utils/alertManager';

const orderFormStore = useOrderFormStore();
const accessoriesStore = useAccessoriesStore();
const casesSelectsStore = useCasesSelectsStore();
const terminalsSelectsStore = useTerminalsSelectsStore();
const orientationStore = useOrientationStore();
const inputsSelectsStore = useInputsSelectsStore();

// Объект для привязки значений формы
const formData = ref({
    organization: '',
    bin: '',
    user: '',
    comment: ''
});

const emit = defineEmits<{
    (event: 'closePopup'): void;
}>()

function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const orderElement = document.querySelector('.order');

    if (orderElement && !orderElement.contains(target)) {
        emit('closePopup');
    }
}

async function handleOrder() {
    orderFormStore.setOrderFormData(formData.value); // Обновляем данные в стор
    await nextTick(); // Ждем завершения рендеринга
    try {
        const success = await submitOrder(orderFormStore, accessoriesStore, casesSelectsStore, terminalsSelectsStore, inputsSelectsStore, orientationStore); // Обновляеи данные в сторе
        if (success) {
            showAlert('The request is sent', 'alert--success')
        } else {
            showAlert('The request is not sent', 'alert--error')
        }
    } catch (error) {
        showAlert('The request is not sent', 'alert--error')
    }
}

</script>

<template>
    <section class="main__popup popup" @click="handleClickOutside">
        <div class="popup__wrapper">
            <div class="popup__inner">
                <form class="popup__order order" action="#" name="order" @submit.prevent="handleOrder">
                    <div class="order__decorations order-decorations">
                        <div class="order-decorations__item"></div>
                        <div class="order-decorations__item"></div>
                        <div class="order-decorations__item"></div>
                        <div class="order-decorations__item"></div>
                        <div class="order-decorations__item"></div>
                    </div>
                    <div class="order__close cls" @click="$emit('closePopup')">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2.75" y="0.000976562" width="27.2226" height="3.88894"
                                transform="rotate(45 2.75 0.000976562)" fill="white" />
                            <rect x="22" y="2.75" width="27.2226" height="3.88894" transform="rotate(135 22 2.75)"
                                fill="white" />
                        </svg>
                    </div>
                    <div class="order__inner">
                        <h2 class="order__title">
                            Ordering of the order
                        </h2>
                        <div class="order__wrapper">
                            <div class="order__box order-box">
                                <label class="order-box__label" for="">
                                The name of the organization
                                </label>
                                <input class="order-box__input" id="organization" type="text" name="organization"
                                    v-model="formData.organization" required>
                            </div>
                            <div class="order__box order-box">
                                <label class="order-box__label" for="">
                                    Bin
                                </label>
                                <input class="order-box__input" id="bin" type="text" name="bin" v-model="formData.bin"
                                    required>
                            </div>
                            <div class="order__box order-box">
                                <label class="order-box__label" for="">
                                  The final user
                                </label>
                                <input class="order-box__input" id="user" type="text" name="user"
                                    v-model="formData.user" required>
                            </div>
                        </div>
                        <div class="order__wrapper">
                            <div class="order__box order-box">
                                <label class="order-box__label" for="">
                                    Comment
                                </label>
                                <textarea class="order-box__textarea" id="comment" name="comment"
                                    v-model="formData.comment" required></textarea>
                            </div>
                        </div>
                        <button class="order__btn" type="submit">
                            Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
.popup {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background: rgba(#002844, 0.8);
    backdrop-filter: blur(5px);
    overflow: scroll;

    &--third {
        .form__inner {
            margin-bottom: 24px;
        }

        .form-titling__title {
            font-size: 24px;
            line-height: 34px;
        }
    }

    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }

    &__wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        margin-top: auto;
        margin-bottom: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

    }

    &__inner {
        width: 100%;
        padding: 20px 15px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 1085px;
        margin-top: auto;
        margin-bottom: auto;
    }
}

.order {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding-top: clamp(25px, calc(25px + (100 - 75) * ((100vw - 375px) / (1165 - 375))), 100px);
    padding-right: clamp(15px, calc(15px + (105 - 90) * ((100vw - 375px) / (1165 - 375))), 105px);
    padding-bottom: clamp(25px, calc(25px + (100 - 75) * ((100vw - 375px) / (1165 - 375))), 100px);
    padding-left: clamp(15px, calc(15px + (105 - 90) * ((100vw - 375px) / (1165 - 375))), 105px);

    background: #0B2031;
    border: 3px solid #fff;

    &__close {
        position: absolute;
        width: 22px;
        height: 22px;
        top: 27px;
        right: 27px;
        z-index: 7;
        cursor: pointer;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    &__title {
        color: #fff;
        margin-bottom: clamp(20px, calc(20px + (40 - 20) * ((100vw - 375px) / (1165 - 375))), 40px);
        text-transform: uppercase;
        font-weight: 700;
        font-family: "Oswald", sans-serif;
        font-size: clamp(32px, calc(32px + (50 - 18) * ((100vw - 375px) / (1165 - 375))), 50px);
        line-height: clamp(36px, calc(36px + (60 - 24) * ((100vw - 375px) / (1165 - 375))), 60px);
    }

    &__inner {
        position: relative;
        z-index: 6;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    &__wrapper {
        margin-bottom: clamp(15px, calc(15px + (30 - 15) * ((100vw - 375px) / (1165 - 375))), 30px);
        width: 100%;

        &:nth-child(2) {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: clamp(15px, calc(15px + (30 - 15) * ((100vw - 375px) / (1165 - 375))), 30px);
        }
    }

    &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 13px 60px;
        color: #fff;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        letter-spacing: 0.54px;
        background: #F2A41F;
        border: 1px solid #F2A41F;
        border-radius: 4px;
        text-transform: uppercase;
        transition: background 0.3s;
        font-family: "Oswald", sans-serif;

        &:hover {
            background: transparent;
        }
    }
}

.order-decorations {
    &__item {
        position: absolute;
        animation-fill-mode: forwards;
        box-shadow: 0 34px 24px 0 rgba(#000, 0.25);

        &:nth-child(1) {
            width: 405px;
            height: 405px;
            background: #0D496D;
            bottom: -296px;
            left: -205px;
            z-index: 5;
            animation: rotateItem1 1s forwards;
        }

        &:nth-child(2) {
            width: 596px;
            height: 596px;
            background: #0D496D;
            bottom: -380px;
            left: -414px;
            z-index: 4;
            animation: rotateItem2 1s forwards;
        }

        &:nth-child(3) {
            width: 855px;
            height: 855px;
            background: #0D2237;
            bottom: -477px;
            left: -714px;
            z-index: 3;
            animation: rotateItem3 1s forwards;
        }

        &:nth-child(4) {
            width: 405px;
            height: 405px;
            background: #F2A41F;
            top: -230px;
            right: -225px;
            z-index: 2;
            animation: rotateItem4 1s forwards;
        }

        &:nth-child(5) {
            width: 685px;
            height: 685px;
            background: #F2A41F;
            top: -137px;
            right: -610px;
            z-index: 1;
            animation: rotateItem5 1s forwards;
        }
    }
}

/* Keyframes */
@keyframes rotateItem1 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-45deg);
    }
}

@keyframes rotateItem2 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-30deg);
    }
}

@keyframes rotateItem3 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-15deg);
    }
}

@keyframes rotateItem4 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-45deg);
    }
}

@keyframes rotateItem5 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(-15deg);
    }
}


.order-box {
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    &__label {
        pointer-events: none;
        position: absolute;
        top: 9px;
        left: 12px;
        color: #3E4650;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
    }

    &__input {
        width: 100%;
        padding: 29px 12px 8px 12px;
        color: #1A232F;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
        ;
        font-weight: 600;

        &::placeholder {
            color: #3E4650;
            font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
            line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
            font-size: 14px;
            line-height: 16px;
            font-weight: 600;
        }
    }

    &__textarea {
        width: 100%;
        padding: 33px 12px 8px 12px;
        color: #1A232F;
        font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
        line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
        font-weight: 600;
        resize: none;

        &::placeholder {
            color: #3E4650;
            font-size: clamp(12px, calc(12px + (14 - 2) * ((100vw - 375px) / (1165 - 375))), 14px);
            line-height: clamp(14px, calc(14px + (16 - 2) * ((100vw - 375px) / (1165 - 375))), 16px);
            font-weight: 600;
        }
    }
}

@media (max-width: 550px) {
    .order__btn {
        width: 100%;
    }
}
</style>