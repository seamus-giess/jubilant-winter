<svelte:options accessors />

<script lang="ts">
    type Action = () => void;

    const speakingDelay = 50;
    const longSpeakingPause = 10;
    const shortSpeakingPause = 5;

    export let style: string = "";
    /**
     * @type {string|Action[]} The speech to say per click. Functions will be called instead and the text box will be closed.
     */
    export let dialogueOrActions: (string | Action)[];
    export let voiceUri: string | null = null;
    // Copy the prop so that we can mutate it without consequence.
    const dialogueOrActionOrder = dialogueOrActions;

    let isOpen = false;
    let currentDialogue: string = "";

    let isSleeping: boolean = false;
    export function sleep(time: number) {
        isSleeping = true;
        setTimeout(() => {
            isSleeping = false;
        }, time);
    }

    function enunciate() {
        if (!voiceUri) {
            return;
        }
        new Audio(voiceUri).play();
    }

    let scheduledEnunciations: number[] = [];

    function say(characters: string[]): void {
        let speakingOffset = 0;
        characters.forEach((character) => {
            const notPunctuation = /[^\?\,\.\!]/;
            const isSpoken = character.match(notPunctuation);

            scheduledEnunciations.push(
                setTimeout(() => {
                    currentDialogue += character;
                    if (isSpoken) {
                        enunciate();
                    }
                }, speakingDelay * speakingOffset),
            );

            switch (character) {
                case "?":
                case "!":
                case ".":
                    speakingOffset += longSpeakingPause;
                    break;
                case ",":
                    speakingOffset += shortSpeakingPause;
                    break;
                default:
                    speakingOffset++;
                    break;
            }
        });
    }

    function updateDialogue(text: string): void {
        currentDialogue = "";

        const characters = text.split("");
        say(characters);
    }

    export function progress() {
        if (isSleeping) {
            return;
        }

        const next = dialogueOrActionOrder.shift();

        if (typeof next === "undefined") {
            return;
        }

        scheduledEnunciations.forEach((saying) => {
            clearTimeout(saying);
        });

        if (typeof next === "function") {
            isOpen = false;
            const action = next;
            action();
            return;
        }

        isOpen = true;

        const text = next;
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
    .block-wrapper {
        position: relative;
    }
    .chat-box {
        position: absolute;
        left: 100%;
        bottom: 100%;
        width: 260px;
        height: 75px;

        border: 2px solid white;
        border-radius: 0;
        background-color: black;
        padding: 0.5rem;
        outline: none;

        display: flex;
        flex-direction: row;
        text-align: start;
        white-space: pre-wrap;

        color: white;
        font-size: 0.8rem;
        font-family: DTM-Mono;

        &.hidden {
            display: none;
        }
    }
</style>
