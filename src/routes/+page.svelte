<script>
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
  import { config } from "@fortawesome/fontawesome-svg-core";
  import { Tooltip } from "@sveltestrap/sveltestrap";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  let disappointingTextHidden = true;
  let isOpen = false;
  let isDoneReveal = false;
</script>

<div class="scroll-wrapper">
  <div class="container centered">
    <div class="hero__content">
      <h1>welcome to rot-dot-bot</h1>
      <span>please enjoy your stay</span>
    </div>
    <div class="hero__scroll-prompt">
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
  <div class="container centered">
    <div id="test" class="centered">
      <span
        role="banner"
        on:contextmenu|stopImmediatePropagation={(event) => {
          if (disappointingTextHidden) {
            event.preventDefault();
          }
        }}
      >
        what? you expected something to be <a
          id="externalLink"
          href="/the-cool-thing-youre-hoping-for"
          on:click|preventDefault={() => {
            disappointingTextHidden = false;
            isOpen = false;
          }}
          on:auxclick|preventDefault={(event) => {
            if (event.button !== 1) return false;
            if (!isOpen && isDoneReveal) {
              return;
            }
            isOpen = !isDoneReveal ? true : false;
            isDoneReveal = true;
          }}
          on:mouseover|stopImmediatePropagation={() => null}
          on:focus|stopImmediatePropagation={() => null}
          on:blur|stopImmediatePropagation={() => null}
          on:mouseleave|stopImmediatePropagation={() => null}
        >
          here</a
        ><Tooltip
          bind:isOpen
          target="externalLink"
          style="border: 1px solid white; background-color: black; --bs-tooltip-max-width: auto;"
          ><div class="text-white text-start">
            WOAH there, pardner!<br />
            Who said you could push me around?
          </div></Tooltip
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

<style lang="scss">
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
