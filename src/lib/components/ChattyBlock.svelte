<svelte:options accessors />

<script lang="ts">
    import { Styles } from "@sveltestrap/sveltestrap";
    import type { Style } from "svelte/types/compiler/interfaces";

    const speakingDelay = 50;

    export let style: string = "";

    /**
     * @type {string|Function[]} The speech to say per click. Functions will be called instead and the text box will be closed.
     */
    export let textOrActions: (string | (() => void))[];

    const textOrActionsArray = textOrActions;

    export let voiceUri: string | null = null;

    let isOpen = false;

    let currentDialogue: string = "";

    // TODO add timeout functionality the callables can induce to force a wait time.
    let isSleeping: boolean = false;
    export function sleep(time: number) {
        isSleeping = true;
        setTimeout(() => {
            isSleeping = false;
        }, time);
    }

    function enunciate(character: string) {
        if (!voiceUri) {
            return;
        }

        const loud = new Audio(voiceUri);
        loud.preservesPitch = false;
        loud.play();
        loud.playbackRate = 1;
    }

    let sayings: number[] = [];

    function say(characters: string[]): void {
        let speakingOffset = 0;
        characters.forEach((character) => {
            let re = /[^\?\,\.\!]/;
            let isSpoken = character.match(re);

            sayings.push(
                setTimeout(() => {
                    currentDialogue += character;
                    if (isSpoken) {
                        enunciate(character);
                    }
                }, speakingDelay * speakingOffset),
            );

            switch (character) {
                case "?":
                case "!":
                case ".":
                    speakingOffset += 10;
                    break;
                case ",":
                    speakingOffset += 5;
                    break;
                default:
                    speakingOffset++;
                    break;
            }
        });
    }

    function updateDialogue(text: string): void {
        currentDialogue = "";

        let characters = text.split("");
        say(characters);
    }

    export function progress() {
        if (isSleeping) {
            return;
        }

        const textOrAction = textOrActionsArray.shift();
        textOrActions = textOrActions;

        if (typeof textOrAction === "undefined") {
            return;
        }

        sayings.forEach((saying) => {
            clearTimeout(saying);
        });

        if (typeof textOrAction === "function") {
            isOpen = false;
            let action = textOrAction;
            action();
            return;
        }

        isOpen = true;

        let text = textOrAction;
        updateDialogue(text);
    }
</script>

<svelte:head>
    {#if voiceUri}
        <link rel="preload" href={voiceUri} as="audio" />
    {/if}
</svelte:head>

<div class="block-wrapper" {style}>
    <button
        type="button"
        on:click|preventDefault|stopPropagation={progress}
        on:auxclick|preventDefault|stopPropagation={progress}
        on:contextmenu|preventDefault|stopImmediatePropagation={progress}
        class="chat-box {isOpen ? '' : 'hidden'}"
        ><div
            bind:innerHTML={currentDialogue}
            contenteditable="false"
        ></div></button
    >
    <slot />
</div>

<style lang="scss">
    button {
        outline: none;
    }
    .block-wrapper {
        position: relative;
    }
    .chat-box {
        position: absolute;
        cursor: default;

        border: 2px solid white;
        border-radius: 0;
        background-color: black;
        position: absolute;
        left: 100%;
        bottom: 100%;

        width: 260px;
        height: 75px;
        font-size: 0.8rem;
        padding: 0.5rem;
        font-family: DTM-Mono;
        white-space: pre-wrap;
        display: flex;
        flex-direction: row;
        text-align: start;
        color: white;

        &.hidden {
            display: none;
        }
    }
</style>
