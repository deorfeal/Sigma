<script setup lang="ts">
import { computed } from 'vue';


interface ComponentItem {
    mainLocation: string;
    additionalLocation: string;
    componentsItems: string[];
}

const props = defineProps<{
    img: string;
    text?: string;
    inputItem?: ComponentItem;
    inputsIsVisible?: boolean;
    side?: string;
}>();

const inputClass = computed(() => {
    if (!props.inputItem) return '';
    const length = props.inputItem.componentsItems.length;
    const classes = <Record<string, string>>{
        1: 'inputs--one',
        2: 'inputs--two',
        3: 'inputs--three',
        4: 'inputs--four',
    }

    return classes[length.toString()] || 'inputs--more';
});

const inputTypeClass = computed(() => {
    if (!props.inputItem) return '';
    return props.inputItem.mainLocation === 'Chess' ? 'inputs--chess' : 'inputs--liniar';
})

</script>

<template>
    <div class="configurator-view__wrap">
        <slot></slot>
        <picture class="configurator-view__side">
            <img class="configurator-view__side-img" :src="img" alt="img" />
        </picture>
        <div class="configurator-view__side-text">
            {{ text }}
        </div>
        <div v-if="inputItem && inputsIsVisible" class="configuratour-view__inputs inputs"
            :class="[inputClass, inputTypeClass, side]">
            <template v-for="item in inputItem?.componentsItems">
                <picture class="inputs__img">
                    <img src="/images/input-icon.svg" alt="input">
                </picture>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
.configurator-view {
    &__side {
        display: block;
        width: 200px;
        height: 105px;
        position: relative;
    }

    &__side-text {
        font-family: "Oswald", sans-serif;
        position: absolute;
        color: #1A232F;
        font-size: 14px;
        line-height: 14px;
    }

    &__side-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}

.configurator-view__wrap {
    position: absolute;

    &:nth-child(1) {
        top: 0;
        left: 50%;
        transform: translateX(-50%);

        .configurator-view__side {}

        .configurator-view__side-text {
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    &:nth-child(2) {
        right: 0;
        top: 50%;
        transform: translateY(-50%);

        .configurator-view__side {
            transform: rotate(180deg);
        }

        .configurator-view__side-text {
            left: -25px;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            writing-mode: tb-rl;
        }
    }

    &:nth-child(3) {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);

        .configurator-view__side {
            transform: rotate(180deg);
        }

        .configurator-view__side-text {
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    &:nth-child(4) {
        left: 0;
        top: 50%;
        transform: translateY(-50%);

        .configurator-view__side {}

        .configurator-view__side-text {
            right: -20px;
            top: 50%;
            transform: translateY(-50%) rotate(180deg);
            writing-mode: tb-rl;
        }
    }

    &:nth-child(2),
    &:nth-child(4) {
        .configurator-view__side {
            width: 105px;
            height: 200px;
        }
    }
}

// 

.inputs.A {
    transform: translateX(-50%) translateY(-60%) rotate(180deg);
}

.inputs.D {
    transform: translateX(-45%) translateY(-50%) rotate(-90deg);
}

.inputs.C {
    transform: translateX(-55%) translateY(-50%) rotate(90deg);
}

.inputs--chess.A,
.inputs--chess.B {
    .inputs__img {
        margin-top: unset;
        margin-bottom: unset;

        &:nth-child(odd) {
            margin-bottom: -5px;
        }

        &:nth-child(even) {
            margin-top: -5px;
        }
    }
}

.inputs--chess.D,
.inputs--chess.C {
    .inputs__img {
        margin-top: unset;
        margin-bottom: unset;

        &:nth-child(odd) {
            margin-bottom: -5px;
        }

        &:nth-child(even) {
            margin-top: -5px;
        }
    }
}

.inputs {
    position: absolute;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 142px;
    height: 74px;
    max-width: 142px;
    max-height: 74px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-40%);

    &--chess {
        .inputs__img {
            margin-left: unset;
            margin-right: unset;
        }
    }

    &--chess.inputs--two {
        .inputs__img {
            margin-left: auto;
            margin-right: auto;
        }
    }

    &--liniar {
        justify-content: flex-start;
    }

    &--one {
        .inputs__img {
            margin-left: unset;
            margin-right: unset;
            margin-top: unset;
            margin-bottom: unset;
            width: 50px;
            height: 56px;
        }
    }

    &--two {
        .inputs__img {
            width: 50px;
            height: 56px;
        }
    }

    &--three {
        .inputs__img {
            width: 33.3%;
            height: 33.3%;
        }
    }

    &--four {
        .inputs__img {
            width: 25%;
            height: 25%;
        }
    }

    &--more {
        .inputs__img {
            width: 25%;
            height: 25%;
        }
    }

    &--more.inputs--liniar {
        .inputs__img {

            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(3),
            &:nth-child(4) {
                margin-left: auto;
                margin-right: auto;
                margin-top: auto;
                margin-bottom: auto;
            }

            margin-left: unset;
            margin-right: unset;
            margin-top: unset;
            margin-bottom: unset;
        }
    }

    &__img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: auto;
        margin-bottom: auto;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>
