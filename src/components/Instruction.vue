<script setup lang="ts">

const props = defineProps<{
    itemData: any,
    isActive: boolean
}>();

const emit = defineEmits<{
    (e: 'closePopup'): void;
}>();

function closePopup() {
    emit('closePopup')
}
</script>

<template>
    <Teleport to="body">
        <div v-if="isActive" class="configuratour-body__instruction instruction instruction--btn"
            :class="itemData.class">
            <Transition name="fade" appear>
                <div class="instruction__inner">
                    <div class="instruction__wrapper">
                        <h2 v-if="itemData.title" class="instruction__title title">
                            {{ itemData.title }}
                            <span>
                                {{ itemData.titleSpan }}
                            </span>
                        </h2>
                        <p class="instruction__text">
                            {{ itemData.text }}
                        </p>
                        <svg v-if="itemData.arrow" width="108" height="93" viewBox="0 0 108 93" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_2873_12042)">
                                <path
                                    d="M5.89499 78.2331C10.81 78.3767 15.7251 78.6639 20.6401 78.6023C29.5117 78.4793 38.2201 77.187 46.7042 74.4999C66.4459 68.2437 81.3338 55.8339 91.9797 38.1524C98.5671 27.2195 102.809 15.384 104.808 2.72799C104.889 2.19468 104.971 1.64085 105.032 1.10753C105.114 0.369097 105.562 -0.0411452 106.256 -0.00012096C107.01 0.0409033 107.439 0.553707 107.337 1.33317C107.072 3.26131 106.827 5.18945 106.439 7.09707C103.339 22.3376 97.2618 36.2653 87.7377 48.5521C75.2359 64.6746 58.9408 74.7461 39.0563 78.9305C28.8999 81.0638 18.6619 81.433 8.34231 80.592C7.40417 80.51 6.44564 80.4484 5.24237 80.3459C5.65026 80.7151 5.91538 80.9612 6.18051 81.1869C9.72913 84.1201 13.2778 87.0328 16.8264 89.9456C16.9487 90.0481 17.0915 90.1712 17.2139 90.2737C17.8665 90.7865 18.1112 91.4429 17.5606 92.1198C16.9895 92.7967 16.3165 92.6121 15.6843 92.0788C10.6877 87.9559 5.69104 83.8535 0.71481 79.7305C-0.243724 78.9305 -0.14175 78.0075 0.959546 77.4742C6.79234 74.6435 12.6455 71.8333 18.4783 69.0027C19.2125 68.654 19.8855 68.6335 20.2934 69.4745C20.7013 70.3154 20.2118 70.8283 19.498 71.177C15.2764 73.2077 11.0548 75.2589 6.83313 77.2896C6.50682 77.4537 6.2009 77.6178 5.87459 77.8024C5.83381 77.9665 5.87459 78.11 5.89499 78.2331Z"
                                    fill="white" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2873_12042">
                                    <rect width="92.5917" height="107.336" fill="white"
                                        transform="translate(107.336) rotate(90)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <div class="next-btn" @click="closePopup">
                            <svg v-if="itemData.btnSvg" width="25" height="24" viewBox="0 0 25 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 12H19.5" stroke="white" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M12.5 5L19.5 12L12.5 19" stroke="white" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span>
                                {{ itemData.btn }}
                            </span>
                        </div>
                    </div>
                </div>
            </Transition>
            <div class="instruction__bg"></div>
        </div>
    </Teleport>
</template>

<style lang="scss">
.instruction {
    &__bg {
        background: rgba(0, 40, 68, .8);
        position: fixed;
        z-index: 15;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    &__inner {
        position: fixed;
        z-index: 20;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    &__wrapper {
        position: absolute;
        left: 46%;
        top: 50px;
        padding-left: 15px;
        padding-right: 15px;
    }

    &--main {
        animation: opacity 0.3s linear;

        .instruction__wrapper {
            width: 100%;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
        }

        .instruction__text {
            text-align: center;
            padding-left: unset;
            max-width: 360px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    &--accessories {
        svg {
            transform: rotateY(180deg) translateX(-400px);
        }
    }

    &--btn {
        .next-btn {
            opacity: 1;
            pointer-events: unset;
        }
    }

    &__title {
        color: #fff;
        line-height: 28px;
        margin-bottom: 10px;
        text-align: center;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;

        span {
            color: #f2a41f;
            display: inline-block;
        }
    }

    &__text {
        font-size: 16px;
        line-height: 22px;
        color: #fff;
        margin-bottom: 22px;
        padding-left: 55px;
        max-width: 280px;
    }

    svg {
        width: 92px;
        height: 107px;
    }
}

.next-btn {
    // user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #F2A41F;
    border: 1px solid #F2A41F;
    padding: 10px 20px;
    color: #fff;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.54px;
    transition: background 0.3s, color 0.3s, opacity 0.3s;
    font-family: "Oswald", sans-serif;
    z-index: 10;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    max-width: 150px;
    margin-left: auto;
    margin-right: auto;
    position: relative;

    &:hover {
        background: transparent;
    }

    svg {
        position: absolute;
        left: -40px;
        top: 50%;
        width: 32px;
        height: 32px;
        transform: translateY(-50%);
        animation: arrowAnimation 1s infinite ease;
        pointer-events: none;
    }
}

@keyframes arrowAnimation {
    0% {
        transform: translateY(-50%) translateX(-0%);
    }

    50% {
        transform: translateY(-50%) translateX(-25%);
    }

    100% {
        transform: translateY(-50%) translateX(-0%);
    }
}

@media (max-width: 1150px) {
    .instruction__wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
    }

    .instruction__text {
        padding-left: unset;
        max-width: 320px;
    }

    .instruction {
        svg {
            transform: rotate(-96deg);
        }

        .next-btn {
            svg {
                path {
                    stroke: #f2a41f;
                }
            }
        }
    }

    .next-btn {
        position: fixed;
        right: 15px;
        bottom: 15px;
    }

    .instruction--main {
        .next-btn {
            position: unset;
        }
    }

    .instruction__wrapper {
        height: 100%;
    }

    .instruction--accessories svg {
        transform: rotateY(180deg) rotate(25deg) translateX(-400%);
    }
}

@media(max-width: 1050px) {
    .instruction--accessories svg {
        transform: rotateY(180deg) translateY(-200%) rotate(0deg) translateX(-250%);
    }
}

@media(max-width: 850px) {
    .instruction--accessories svg {
        transform: rotateY(180deg) translateY(110%) rotate(35deg) translateX(-250%);
    }
}

@media(max-width: 750px) {
    .instruction--accessories svg {
        transform: rotateY(180deg) translateY(80%) rotate(35deg) translateX(-200%);
    }
}

@media(max-width: 600px) {
    .instruction--accessories svg {
        transform: rotateY(180deg) translateY(0%) rotate(35deg) translateX(-50%);
    }
}

@media(max-width: 400px) {
    .instruction--accessories svg {
        transform: rotateY(180deg) translateY(0%) rotate(35deg) translateX(-0%);
    }
}
</style>