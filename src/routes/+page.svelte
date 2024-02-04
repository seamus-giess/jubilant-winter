<script>
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
  import { config } from "@fortawesome/fontawesome-svg-core";

  import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
  config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
</script>

<div class="container p-5">
  <div class="hero__content">
    <h1>welcome to rot-dot-bot</h1>
    <span>I hope you enjoy your stay</span>
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

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;

    position: relative;
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
        animation: flash 6s infinite;
        transition: opacity 0 linear;
        &:nth-child(1) {
          animation-delay: 0s;
        }
        &:nth-child(2) {
          animation-delay: 2s;
        }
        &:nth-child(3) {
          animation-delay: 4s;
        }
      }
    }
  }

  @keyframes flash {
    0% {
      opacity: 1;
    }
    33% {
      opacity: 0.5;
    }
    66% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }
</style>
