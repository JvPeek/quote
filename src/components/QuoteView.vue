<template>
  <div :class="cssClasses" :style="{ backgroundImage: quoteStyle.backgroundImage ? `url(${quoteStyle.backgroundImage})` : undefined }">
    <audio v-if="quoteStyle.sound" autoplay :loop="quoteStyle.sound.loop">
      <source :src="quoteStyle.sound.src" />
    </audio>

    <video v-if="quoteStyle.backgroundVideo" autoplay :loop="quoteStyle.backgroundVideo.loop" muted>
      <source :src="quoteStyle.backgroundVideo.src" />
    </video>

    <template v-if="quoteStyle.name === 'style-nyan'">
      <div class="rainbow">
        <div class="sprite" />
      </div>
    </template>

    <img v-if="quoteStyle.foregroundImage" :src="quoteStyle.foregroundImage" alt="" />

    <blockquote>
      <p v-text="quote.text" />

      <footer>
        <cite><span v-text="quote.cite" /> <small v-text="quote.year" /></cite>
      </footer>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { QuoteData } from '~/types/index.js';

const props = defineProps<QuoteData>();

const baseClass = 'quote';
const cssClasses = computed(() => [baseClass, `${baseClass}--${props.quoteStyle.name}`]);
</script>

<style lang="postcss" scoped>
@import url('~/assets/css/styles/moody.postcss');
@import url('~/assets/css/styles/minecraft.postcss');
@import url('~/assets/css/styles/newspaper.postcss');
@import url('~/assets/css/styles/nyan.postcss');
@import url('~/assets/css/styles/train.postcss');

.quote {
  align-items: center;
  aspect-ratio: 16/9;
  display: flex;
  filter: opacity(1);
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
}

p {
  word-wrap: break-word;

  &::before {
    content: '\201e';
  }

  &::after {
    content: '\201c';
  }
}

footer {
  text-align: right;
}
</style>
