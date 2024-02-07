<script lang="ts">
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
  import { config } from "@fortawesome/fontawesome-svg-core";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  import { browser } from "$app/environment";
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  let isFinishedLoading = browser
    ? document.readyState === "complete" ?? false
    : false;

  let disappointingTextHidden = true;
  let isOpen = false;
  let isDoneReveal = false;

  const chattyBoxDialogue = [
    "* WOAH there, pardner!\n* Who said you could middle\n  click on me?",
    "* HMM?\n* So you're ASKIN' me to\n  visit a site?",
    "* Okay, just for you,\n  pumpkin.",
    "",
    "* HMM?\n* You wanted me to go\n  somewhere?",
    "* Alrighty, how's this?",
    "",
    "* HMM?\n* That wasn't what you\n  meant?",
    "* Okay, think I got it.",
    "",
  ];

  let chattyLinkColor: string = "#0d6efd";
  let chattyBoxCurrentText = "";
  let chattyLinkOffset = "0";
  let chattyBoxStep = 1;
  let chattyVoice = "/sounds/voice_toriel.mp3";
  let isChattyTimeout = false;

  let chattyInterval: number;

  function stopIt(event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    return false;
  }

  function haveFun(event: MouseEvent) {
    event.preventDefault();
    if (event.button !== 1) {
      return false;
    }
    if (!isOpen && isDoneReveal) {
      return;
    }
    if (isChattyTimeout) {
      return;
    }
    isOpen = true;

    const dialogue = chattyBoxDialogue.shift();
    if (dialogue === "") {
      switch (chattyBoxStep) {
        case 1:
          chattyLinkColor = "#6f42c1";
          break;
        case 2:
          chattyLinkOffset = "-20px";
          isChattyTimeout = true;
          setTimeout(() => {
            isChattyTimeout = false;
          }, 4000);
          break;
        case 3:
          let origin = window.location;
          origin.pathname = "/";
          window.location = origin;
      }
      chattyBoxStep++;
      isOpen = false;
      return;
    }
    if (!dialogue) {
      isDoneReveal = true;
      return;
    }
    // push the dialogue to the chattyBoxCurrentText one character at a time
    chattyBoxCurrentText = "";
    let i = 0;
    clearInterval(chattyInterval);
    chattyInterval = setInterval(() => {
      if (i < dialogue.length) {
        let re = /[A-Za-z]/;
        if (dialogue[i].match(re)) {
          let audio = new Audio(chattyVoice);
          audio.preservesPitch = false;
          audio.play();
          audio.playbackRate = 1;
        }
        chattyBoxCurrentText += dialogue[i];
        i++;
      } else {
        clearInterval(chattyInterval);
      }
    }, 50);
  }
</script>

<svelte:window on:load={() => (isFinishedLoading = true)} />

<div class="scroll-wrapper">
  <div class="container centered">
    <div class="hero__content">
      <h1>welcome to rot-dot-bot</h1>
      <span>please enjoy your stay</span>
    </div>
    <div class="hero__scroll-prompt {isFinishedLoading ? '' : 'opacity-0'}">
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
  </div>
  <div class="container centered {isFinishedLoading ? '' : 'd-none'}">
    <div id="test" class="centered">
      <span
        role="banner"
        on:contextmenu|preventDefault|stopImmediatePropagation={() => null}
      >
        what? you expected something to be
        <a
          id="externalLink"
          href="/the-coolest-thing-you-will-ever-see"
          style="color: {chattyLinkColor}; top: {chattyLinkOffset}; display: inline; position: relative; transition: top 4s ease-in-out 2s;"
          on:mouseover|stopImmediatePropagation={stopIt}
          on:focus|stopImmediatePropagation={stopIt}
          on:blur|stopImmediatePropagation={stopIt}
          on:mouseleave|stopImmediatePropagation={stopIt}
          on:click|preventDefault|stopImmediatePropagation={() => {
            disappointingTextHidden = false;
          }}
          on:auxclick={haveFun}
          on:auxclick|once|preventDefault={() => {
            console.log(
              "%c*Teleports behind once-off auxclick event*",
              "color:grey",
            );
            console.log('> %c"Nothing personal, kid."', "color:violet");
            setTimeout(() => {
              console.log('> %c"Nani?!"', "color:lightblue");
            }, 3000);
          }}
        >
          <div
            id="chattyBox"
            class={!isOpen ? "hidden" : ""}
            style="border: 2px solid white; border-radius: 0; background-color: black; --bs-tooltip-max-width: auto; position: absolute; left:100%; bottom: 100%;"
          >
            {chattyBoxCurrentText}
          </div>
          here</a
        >?
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

<div>
  <audio id="voice_toriel" src="/sounds/voice_toriel.mp3" preload="auto"
  ></audio>
</div>

<style lang="scss">
  #chattyBox {
    width: 260px;
    height: 75px;
    font-size: 0.8rem;
    padding: 0.5rem;
    font-family: DTM-Mono;
    white-space: pre-wrap;
    display: flex;
    flex-direction: row;
    color: white;
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

    position: relative;
  }
  .hidden {
    opacity: 0;
    pointer-events: none;
  }
  .hero {
    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    &__scroll-prompt {
      position: absolute;
      bottom: 1rem;
      gap: 0.25rem;
      opacity: 1;
      transition: opacity 4s;

      display: flex;
      flex-direction: column;
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
