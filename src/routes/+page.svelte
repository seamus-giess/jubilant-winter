<script lang="ts">
  import { eggs } from "$lib/stores/FoundEggs";
  import { config } from "@fortawesome/fontawesome-svg-core";
  import ChattyBlock from "$lib/components/ChattyBlock.svelte";

  let Device: any;
  onMount(() => {
    Device = import("svelte-device-info");
  });

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  import { browser } from "$app/environment";
  import ScrollPrompt from "$lib/components/ScrollPrompt.svelte";
  import { Input } from "@sveltestrap/sveltestrap";
  import { onMount } from "svelte";
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  let visibleSteps = {
    talking_link: true,
    scroll_toggle: false,
    form: false,
  };
  let remainingSteps = Object.keys(visibleSteps) as Array<
    keyof typeof visibleSteps
  >;

  let currentStep = remainingSteps.shift();

  let isScrollSnapping = true;

  let isFinishedLoading = browser
    ? document.readyState === "complete" ?? false
    : false;

  let disappointingTextHidden = true;

  let chattyBlock: ChattyBlock;
  let chattyBlockText: HTMLSpanElement;

  const firstChattyList = [
    `* WOAH there, pardner!\n* Who said you could ${
      Device?.isPhone || Device?.isTablet ? "long\n press" : "middle\n  click"
    } on me?`,
    "* HMM?\n* So you're ASKIN' me to\n  visit a site?",
    "* Okay, just for you,\n  pumpkin.",
    () => (chattyBlockText.style.color = "#6f42c1"),
    "* HMM?\n* You wanted me to go\n  somewhere?",
    "* Alrighty, how's this?",
    () => {
      chattyBlockText.style.top = "-20px";
      chattyBlock.sleep(4000);
    },
    "* HMM?\n* That wasn't what you\n  meant?",
    "* Okay, think I got it.",
    () => {
      $eggs.talkingLink = true;

      let origin = window.location;
      origin.pathname = "/";
      window.location = origin;
    },
  ];
  let successiveChattyList = [
    "* ...\n* No one's home.",
    () => {
      chattyBlock.dialogueOrActionOrder = [...successiveChattyList];
    },
  ];
  let chattyList =
    $eggs?.talkingLink !== true ? firstChattyList : [...successiveChattyList];

  function doNothing(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }
</script>

<svelte:window
  on:load={() => {
    isFinishedLoading = true;
  }}
/>

<div class="scroll-wrapper {isScrollSnapping ? 'is-snapping' : ''}">
  <div class="container">
    <h1>welcome to rot-dot-bot</h1>
    <span>please enjoy your stay</span>
    <ScrollPrompt
      isVisible={isFinishedLoading && currentStep === "talking_link"}
    />
  </div>

  <div
    class="container {isFinishedLoading && visibleSteps.talking_link
      ? ''
      : 'd-none'}"
  >
    <div style="position: relative; display: content;">
      <span
        role="banner"
        on:contextmenu|preventDefault|stopImmediatePropagation={() => null}
      >
        what? you<br class="d-sm-none" /> expected something to be
        <ChattyBlock
          bind:this={chattyBlock}
          style="display: inline-block;"
          voiceUri={$eggs?.talkingLink !== true
            ? "/sounds/voice_txt.mp3"
            : undefined}
          dialogueOrActions={chattyList}
        >
          <a
            id="externalLink"
            style={$eggs?.talkingLink ? "color: #6f42c1;" : ""}
            href="/the-coolest-thing-you-will-ever-see"
            bind:this={chattyBlockText}
            on:mouseover={doNothing}
            on:focus={doNothing}
            on:blur={doNothing}
            on:mouseleave={doNothing}
            on:contextmenu={(event) => {
              doNothing(event);
              if (Device?.isPhone || Device?.isTablet) {
                chattyBlock.progress();
              }
            }}
            on:click|once={() => {
              disappointingTextHidden = false;
              setTimeout(() => {
                currentStep = remainingSteps.shift();
                if (!currentStep) {
                  return;
                }
                visibleSteps[currentStep] = true;
                console.log("currentStep", currentStep, visibleSteps);
              }, 3000);
            }}
            on:click={(event) => {
              doNothing(event);
            }}
            on:auxclick|preventDefault={(event) =>
              event.button === 1 && chattyBlock.progress()}
          >
            here
          </a>
        </ChattyBlock>?
      </span>
      <div style="position: absolute; top: 100%; display: content;">
        <div
          class={disappointingTextHidden ? "hidden" : ""}
          style="transition: opacity 1s;"
        >
          well, you may be disappointed
        </div>
        <div
          class={disappointingTextHidden ? "hidden" : ""}
          style="transition: opacity 1s 1.5s;"
        >
          there's just this portfolio website...
        </div>
      </div>
    </div>
    <ScrollPrompt isVisible={currentStep === "scroll_toggle"} />
  </div>

  <div class="container {visibleSteps.scroll_toggle ? '' : 'd-none'}">
    <span>i hope you've been enjoying the scroll-snap experience so far</span>
    <span>if you don't like it, feel free to turn it off</span>
    <div class="mt-3">
      <span class="scroll-mode-switch__wrapper">scroll mode:</span>
      <Input
        type="switch"
        label={isScrollSnapping ? "ez mode" : "off"}
        theme="dark"
        bind:checked={isScrollSnapping}
        on:change|once={() => {
          visibleSteps.form = true;
        }}
      />
    </div>
    <ScrollPrompt isVisible={visibleSteps.form} />
  </div>

  <div class="container {visibleSteps.form ? '' : 'd-none'}"></div>
</div>

<style lang="scss">
  #externalLink {
    color: #0d6efd;
    top: 0;
    display: inline;
    position: relative;
    transition: top 4s ease-in-out;
  }
  .scroll-wrapper {
    overflow: scroll;
    max-height: 100vh;
    max-height: 100dvh;

    &.is-snapping {
      scroll-snap-type: y mandatory;
    }
    &:not(.is-snapping) {
      overflow: hidden;
    }
  }
  .container {
    height: 100vh;
    height: 100dvh;

    padding: 3rem;

    scroll-snap-align: center;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    position: relative;
  }
  .hidden {
    opacity: 0;
    pointer-events: none;
  }
</style>
