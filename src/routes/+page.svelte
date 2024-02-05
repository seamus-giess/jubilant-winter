<script>
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
  import { config } from "@fortawesome/fontawesome-svg-core";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

  let disappointingTextHidden = true;
</script>

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
  <div class="centered">
    <span>
      what? you expected something to be <a
        href="/the-cool-thing-youre-hoping-for"
        on:click|preventDefault={() => (disappointingTextHidden = false)}
        >here</a
      >?
    </span>
    <div style="position: absolute; top: 100%;" class="centered">
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

<style lang="scss">
  .container {
    height: 100vh;
    height: 200;

    padding: 3rem;
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
