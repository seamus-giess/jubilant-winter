<script lang="ts">
  import { eggs } from "$lib/stores/FoundEggs";
  import { config } from "@fortawesome/fontawesome-svg-core";
  import ChattyBlock from "$lib/components/ChattyBlock.svelte";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  import { browser } from "$app/environment";
  import ScrollPrompt from "$lib/components/ScrollPrompt.svelte";
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  let isFinishedLoading = browser
    ? document.readyState === "complete" ?? false
    : false;

  let disappointingTextHidden = true;

  let chattyBlock: ChattyBlock;
  let chattyBlockText: HTMLSpanElement;

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

<div class="scroll-wrapper">
  <div class="container centered">
    <h1>welcome to rot-dot-bot</h1>
    <span>please enjoy your stay</span>
    <ScrollPrompt isVisible={isFinishedLoading} />
  </div>

  <div class="container centered {isFinishedLoading ? '' : 'd-none'}">
    <div id="test" class="centered">
      <span
        role="banner"
        on:contextmenu|preventDefault|stopImmediatePropagation={() => null}
      >
        what? you expected something to be
        <ChattyBlock
          bind:this={chattyBlock}
          style="display: inline-block;"
          voiceUri="/sounds/voice_toriel.mp3"
          dialogueOrActions={[
            () => {
              eggs.update((eggs) => {
                eggs.talkingLink = true;
                return eggs;
              });
            },
            "* WOAH there, pardner!\n* Who said you could middle\n  click on me?",
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
              eggs.update((eggs) => {
                eggs.talkingLink = true;
                return eggs;
              });
              let origin = window.location;
              origin.pathname = "/";
              window.location = origin;
            },
          ]}
        >
          <a
            id="externalLink"
            href="/the-coolest-thing-you-will-ever-see"
            bind:this={chattyBlockText}
            on:mouseover={doNothing}
            on:focus={doNothing}
            on:blur={doNothing}
            on:mouseleave={doNothing}
            on:contextmenu={doNothing}
            on:click={(event) => {
              doNothing(event);
              disappointingTextHidden = false;
            }}
            on:auxclick|preventDefault={(event) =>
              event.button === 1 && chattyBlock.progress()}
          >
            here
          </a>
        </ChattyBlock>?
      </span>
      <div
        style="position: absolute; top: 100%;"
        class="centered {disappointingTextHidden ? 'hidden' : ''}"
      >
        <span
          class={disappointingTextHidden ? "hidden" : ""}
          style="transition: opacity 1s;"
        >
          well, you may be disappointed
        </span>
        <span
          class={disappointingTextHidden ? "hidden" : ""}
          style="transition: opacity 1s 1.5s;"
        >
          there's just this portfolio website...
        </span>
      </div>
    </div>
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
    scroll-snap-type: y mandatory;
    max-height: 100vh;
    max-height: 100dvh;
  }
  .container {
    height: 100vh;
    height: 100dvh;

    padding: 3rem;

    scroll-snap-align: center;
  }
  .centered {
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
