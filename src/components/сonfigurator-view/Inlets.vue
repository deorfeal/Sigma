<script setup lang="ts">

import { computed } from 'vue';

const props = defineProps<{
    inletsArray: string[];
    side: string;
}>();

const inletsSrc = computed(() => {
    const isSideDC = props.side === 'D' || props.side === 'C';
    return props.inletsArray.map(item =>
        item.includes('cabel') // Проверка на "cabel" в строке с уникальным ID
            ? (isSideDC ? 'images/cabel-input-side.svg' : 'images/cabel-input.svg')
            : (isSideDC ? 'images/plug-side.svg' : 'images/plug.svg')
    );
});
</script>

<template>
    <div class="configuratour-view__inlets inlets">
        <template v-for="(src, index) in inletsSrc" :key="index">
            <picture class="inlets__img" v-if="index < 4">
                <img :src="src" alt="input" />
            </picture>
        </template>
    </div>
</template>

<style lang="scss">
.inlets {
    position: absolute;
    display: flex;
    gap: 5px;
    justify-content: flex-start;

    &__img {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-top: auto;
        margin-bottom: auto;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    &.A {
        top: -15px;
        left: 0;
        right: 0;
        transform: rotate(180deg);
        width: 200px;
        max-width: 200%;
        padding-left: 34px;
        padding-right: 34px;

        img {
            max-width: 50px;
            max-height: 35px;
        }
    }

    &.D {
        right: -15px;
        top: 0;
        bottom: 0;
        flex-direction: column;
        transform: rotate(180deg);
        height: 200px;
        max-height: 200%;
        padding-top: 34px;
        padding-bottom: 34px;

        img {
            max-height: 50px;
            max-width: 35px;
            transform: rotate(180deg);
        }
    }

    &.B {
        bottom: -15px;
        left: 0;
        right: 0;
        width: 200px;
        max-width: 200%;
        padding-left: 34px;
        padding-right: 34px;

        img {
            max-width: 50px;
            max-height: 35px;
        }
    }

    &.C {
        left: -15px;
        top: 0;
        bottom: 0;
        flex-direction: column;
        height: 200px;
        max-height: 200%;
        padding-top: 34px;
        padding-bottom: 34px;

        img {
            max-height: 50px;
            max-width: 35px;
            transform: rotate(180deg);
        }
    }

    &--one {
        .inlets__img {
            margin-left: unset;
            margin-right: unset;
            margin-top: unset;
            margin-bottom: unset;
        }

        &.A {
            top: -12px;
        }

        &.D {
            right: -10px;
        }

        &.B {
            bottom: -12px;
        }

        &.C {
            left: -11px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-height: 50px;
                    max-width: 27px;
                }
            }
        }
    }

    &--two {
        &.A {
            top: -12px;
        }

        &.D {
            right: -12px;
        }

        &.B {
            bottom: -12px;
        }

        &.C {
            left: -12px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-height: 50px;
                    max-width: 27px;
                }
            }
        }
    }

    &--three {
        &.A {
            top: -10px;
        }

        &.D {
            right: -8px;
        }

        &.B {
            bottom: -10px;
        }

        &.C {
            left: -8px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-height: 40px;
                    max-width: 22px;
                }
            }
        }
    }

    &--four {
        &.A {
            top: -6px;
        }

        &.D {
            right: -5px;
        }

        &.B {
            bottom: -6px;
        }

        &.C {
            left: -5px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-height: 30px;
                    max-width: 16px;
                }
            }
        }
    }

    &--more {
        &.A {
            top: -6px;
        }

        &.D {
            right: -5px;
        }

        &.B {
            bottom: -6px;
        }

        &.C {
            left: -5px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-height: 30px;
                    max-width: 16px;
                }
            }
        }
    }

    &--cabels {
        &.A img {
            max-width: 40px;
            max-height: 47px;
        }

        &.D img {
            max-width: 47px;
            max-height: 40px;
            transform: rotate(180deg);
        }

        &.B img {
            max-width: 40px;
            max-height: 47px;
        }

        &.C img {
            max-width: 47px;
            max-height: 40px;
            transform: rotate(180deg);
        }
    }

    &--cabels.inlets--one {
        &.A {
            top: -30px;
        }

        &.D {
            right: -28px;
        }

        &.B {
            bottom: -29px;
        }

        &.C {
            left: -28px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-width: 47px;
                    max-height: 40px;
                }
            }
        }
    }

    &--cabels.inlets--two {
        &.A {
            top: -30px;
        }

        &.D {
            right: -28px;
        }

        &.B {
            bottom: -29px;
        }

        &.C {
            left: -28px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-width: 47px;
                    max-height: 40px;
                }
            }
        }
    }

    &--cabels.inlets--three {
        &.A {
            top: -30px;
        }

        &.D {
            right: -28px;
        }

        &.B {
            bottom: -32px;
        }

        &.C {
            left: -30px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-width: 47px;
                    max-height: 40px;
                }
            }
        }
    }

    &--cabels.inlets--four {
        &.A {
            top: -22px;
        }

        &.D {
            right: -20px;
        }

        &.B {
            bottom: -21px;
        }

        &.C {
            left: -20px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-width: 34px;
                    max-height: 30px;
                }
            }
        }
    }

    &--cabels.inlets--more {
        &.A {
            top: -22px;
        }

        &.D {
            right: -20px;
        }

        &.B {
            bottom: -21px;
        }

        &.C {
            left: -20px;
        }

        &.D,
        &.C {
            .inlets__img {
                img {
                    max-width: 34px;
                    max-height: 30px;
                }
            }
        }
    }
}
</style>