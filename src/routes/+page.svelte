<script lang="ts">
  import { eggs } from "$lib/stores/FoundEggs";
  import { config } from "@fortawesome/fontawesome-svg-core";
  import ChattyBlock from "$lib/components/ChattyBlock.svelte";

  const isMobile = writable<boolean>(false);
  async function determineMobile() {
    const Device = await import("svelte-device-info");
    $isMobile = Device.isPhone || Device.isTablet;
  }
  onMount(determineMobile);

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  import { browser } from "$app/environment";
  import ScrollPrompt from "$lib/components/ScrollPrompt.svelte";
  import { Input } from "@sveltestrap/sveltestrap";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
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
    `* WOAH there, pardner!\n* Who said you could\n  bypass me?`,
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

  let isIncorrigiblyNosy = "";
  let incorrigiblyNosyText = "oh. there will be no need to fill this out...";
  let isStillNosy = false;
  onMount(() => {
    if ($eggs.isIncorrigiblyNosy) {
      isIncorrigiblyNosy = "yes";
      incorrigiblyNosyText = "you should not have done that";
    }

    if ($eggs.isStillNosy) {
      isStillNosy = true;
    }
  });
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
              console.log($isMobile);
              if ($isMobile) {
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
          currentStep = remainingSteps.shift();
          if (!currentStep) {
            return;
          }
          visibleSteps[currentStep] = true;
        }}
      />
    </div>
    <ScrollPrompt isVisible={visibleSteps.form} />
  </div>

  <div class="container {visibleSteps.form || true ? '' : 'd-none'}">
    <form class="text-start" style="width: 300px;">
      <p>suggestion disposal box</p>
      <div class="mb-3">
        <label class="form-label">genius:</label>

        <div class="input-group mb-3">
          <div class="input-group-text">
            <input
              class="form-check-input mt-0"
              type="checkbox"
              value="nosy"
              aria-label="A checkbox to test people's ability to resist clicking unlabelled checkboxes."
              bind:checked={isStillNosy}
              on:click={() => {
                $eggs.isNosy = true;
                $eggs.isStillNosy = !isStillNosy;
              }}
            />
          </div>
          <input type="text" class="form-control" placeholder="john doe" />
        </div>
      </div>
      <div class="mb-3">
        <label
          class="form-label"
          class:text-decoration-line-through={isIncorrigiblyNosy}
          >electronic mail address:</label
        >
        <input name="email" type="hidden" value="email-not-filled" />

        <div class="input-group mb-3">
          <div class="input-group-text">
            <input
              class="form-check-input mt-0"
              type="radio"
              name="isIncorrigiblyNosy"
              value="yes"
              bind:group={isIncorrigiblyNosy}
              disabled={isIncorrigiblyNosy === "yes"}
              aria-label="A radio input to test people's ability to resist clicking unlabelled inputs."
              on:click|once={() => {
                if ($eggs.isIncorrigiblyNosy) {
                  return;
                }
                isIncorrigiblyNosy = "yes";
                $eggs.isIncorrigiblyNosy = true;
                incorrigiblyNosyText = "you shouldn't 'ave done that";
              }}
            />
          </div>
          <textara
            class="form-control disabled bg-secondary bg-opacity-25"
            bind:innerHTML={incorrigiblyNosyText}
            rows="4"
            contenteditable="false"
            disabled
          ></textara>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">"well thought out" submission:</label>
        <input
          type="text"
          class="form-control"
          placeholder="monkey to scribble here"
        />
      </div>
      <button type="submit" class="btn btn-primary">do the form thing</button>
    </form>
  </div>
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
