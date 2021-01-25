<template>
  <div>
    <h1 class="not-found-title text-center">404</h1>
    <div class="not-found-container">
      <p class="description">
        🍌 Oh, No, the page you are looking for isn’t available. Try
        to use the Go Back button below.
      </p>
      <g-link to="/">
        <div id="draw-button">
          <button>Go Back</button>
        </div>
      </g-link>
      <g-image
        alt="404 Not Found"
        class="not-found-bg"
        src="~/assets/images/404.svg"
        blur="5"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-container {
  text-align: center;
  max-width: var(--content-width);
  margin: 0 auto;

  .description {
    opacity: 0.8;
    font-size: 20px;
  }
}
.textHover {
  .back {
    font-weight: 700;
    font-size: 16px;
  }
}

#draw-border {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

button {
  border: 0;
  background: none;
  text-transform: uppercase;
  color: #4361ee;
  font-weight: bold;
  position: relative;
  outline: none;
  padding: 10px 20px;
  box-sizing: border-box;
}

button::before,
button::after {
  box-sizing: inherit;
  position: absolute;
  content: '';
  border: 2px solid transparent;
  width: 0;
  height: 0;
}

button::after {
  bottom: 0;
  right: 0;
}

button::before {
  top: 0;
  left: 0;
}

button:hover::before,
button:hover::after {
  width: 100%;
  height: 100%;
}

button:hover::before {
  border-top-color: #4361ee;
  border-right-color: #4361ee;
  transition: width 0.3s ease-out, height 0.3s ease-out 0.3s;
}

button:hover::after {
  border-bottom-color: #4361ee;
  border-left-color: #4361ee;
  transition: border-color 0s ease-out 0.6s, width 0.3s ease-out 0.6s,
    height 0.3s ease-out 1s;
}
</style>
