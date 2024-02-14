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
    export let dialogueOrActionOrder = dialogueOrActions;

    let isOpen = false;
    let currentDialogueFull: string;
    let currentDialogue: string = "";

    let isSleeping: boolean = false;
    export function sleep(time: number) {
        isSleeping = true;
        setTimeout(() => {
            isSleeping = false;
        }, time);
    }

    let isSpeaking = false;

    function enunciate() {
        if (!voiceUri) {
            return;
        }
        new Audio(voiceUri).play();
    }

    let scheduledEnunciations: number[] = [];

    function say(characters: string[]): void {
        let speakingOffset = 0;
        characters.forEach((character, index) => {
            const notPunctuation = /[^\*\?\,\.\!]/;
            const isSpoken = character.match(notPunctuation);

            scheduledEnunciations.push(
                setTimeout(() => {
                    currentDialogue += character;
                    if (isSpoken) {
                        enunciate();
                    }

                    if (index === characters.length - 1) {
                        isSpeaking = false;
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
        isSpeaking = true;
        currentDialogueFull = text;
        say(characters);
    }

    function stopSpeaking() {
        scheduledEnunciations.forEach((saying) => {
            clearTimeout(saying);
        });

        currentDialogue = currentDialogueFull;
        if (voiceUri) {
            new Audio(voiceUri).play();
        }

        isSpeaking = false;
    }

    export function progress() {
        if (isSleeping) {
            return;
        }

        if (isSpeaking) {
            stopSpeaking();
            return;
        }

        const next = dialogueOrActionOrder.shift();

        if (typeof next === "undefined") {
            return;
        }

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
