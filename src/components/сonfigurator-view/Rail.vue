<script setup lang="ts">
import { useTerminalsSelectsStore } from '../../stores/terminalsSelectsStore'; // Импортируем стор
const terminalsSelectsStore = useTerminalsSelectsStore() // Импортируем стор

const itemsSrc = <string[]>[ // Массив путей к изображениям
    'images/terminal-icon-1.svg',
    'images/terminal-icon-2.svg',
    'images/terminal-icon-3.svg',
]
</script>


<template>
    <div class="configuratour-view__rail rail">
        <picture class="rail__img">
            <img src="/images/rail.svg" alt="rail">
        </picture>
        <div class="rail__wrapper">
            <picture class="rail__closing">
                <img src="/images/terminals-closing.svg" alt="rail">
            </picture>
            <div class="rail__inner">
                <template v-for="item in terminalsSelectsStore.selectValues">
                    <template v-for="i in Number(item['count'])">
                        <picture class="rail__terminal">
                            <img :src="itemsSrc[Number(item['Color'])]" alt="rail">
                        </picture>
                    </template>
                </template>
            </div>
            <picture class="rail__closing">
                <img src="/images/terminals-closing.svg" alt="rail">
            </picture>
        </div>
    </div>
</template>

<style lang="scss">
.rail {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    transition: transform 0.3s;

    &--revert {
        transform: translateX(-50%) translateY(-50%) rotate(90deg);
    }

    &__img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        display: block;
        width: 183px;
        height: 48px;
        z-index: -1;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    &__wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__closing {}

    &__inner {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>