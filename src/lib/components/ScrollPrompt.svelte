<script lang="ts">
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

    export let isVisible: boolean = true;
</script>

<div class="scroll-prompt {isVisible ? '' : 'hidden'}">
    <div class="arrow">
        <FontAwesomeIcon icon={faArrowDown} size="2x" />
    </div>
    <div class="arrow">
        <FontAwesomeIcon icon={faArrowDown} size="2x" />
    </div>
    <div class="arrow">
        <FontAwesomeIcon icon={faArrowDown} size="2x" />
    </div>
</div>

<style lang="scss">
    .scroll-prompt {
        position: absolute;
        bottom: 1rem;
        gap: 0.25rem;
        opacity: 1;
        transition: opacity 4s;

        display: flex;
        flex-direction: column;
        &.hidden {
            opacity: 0;
            transition: none;
        }
        & .arrow {
            $animationDuration: 3s;
            animation: flash $animationDuration infinite;
            transition: opacity 0 linear;
            &:nth-child(1) {
                animation-delay: 0s;
            }
            &:nth-child(2) {
                animation-delay: calc(-1 * (($animationDuration / 3) * 2));
            }
            &:nth-child(3) {
                animation-delay: calc(-1 * (($animationDuration / 3) * 1));
            }
        }
    }

    @keyframes flash {
        0% {
            opacity: 1;
            color: lightgreen;
        }
        25% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
        75% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }
</style>
