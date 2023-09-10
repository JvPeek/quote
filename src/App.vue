<template>
  <main>
    <Suspense>
      <QuotePage />
    </Suspense>
  </main>
</template>

<script setup lang="ts">
import QuotePage from '~/views/quote.vue';
</script>

<style lang="postcss">
@import url('~/assets/css/animate.min.css');
@import url('~/assets/css/fonts.css');

@keyframes deblur {
  from {
    filter: blur(30px);
  }
  to {
    filter: blur(0);
  }
}

@keyframes blur {
  from {
    filter: blur(0);
  }
  to {
    filter: blur(30px);
  }
}

:root {
  color-scheme: dark;
}

/** Fix for Chrome 115+ - TODO: can be removed when fixed by Chrome */
* {
  animation-duration: 0s;
}

body {
  hyphens: auto;
  margin: 0;
  max-height: 100vh;
  overflow: hidden;
}
</style>
