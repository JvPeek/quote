<template>
  <div v-if="currentQuote && currentStyle">
    <Transition appear :name="currentStyle.transition ?? 'fade'" @after-appear="onAfterAppear" @after-leave="onAfterLeave">
      <QuoteView v-show="showQuote" v-bind="{ quote: currentQuote, quoteStyle: currentStyle }" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { BaseMessage, PrivateMessage } from 'twitch-js';
// import type { SetRequired } from 'type-fest';
import { computed, ref } from 'vue';

import type { Command, Config, Quote } from '~/types/index.js';

import { addToDenyList, getConfig, isAllowed } from '~/lib/config.js';
import { getRandomValue, isModerator } from '~/lib/helpers.js';
import { Queue } from '~/lib/Queue.js';
import { styles } from '~/lib/styles.js';

import QuoteView from '~/components/QuoteView.vue';

const config = getConfig();

const quotes = new Queue<Quote>();

const defaultStyles = computed(() => styles.filter((style) => !style.check || style.eligible));
// const specialStyles = computed(() => styles.filter((style): style is SetRequired<QuoteStyle, 'check'> => style.check !== undefined));

const currentStyleIndex = ref(0);
const currentStyle = computed(() => styles.at(currentStyleIndex.value));

const currentQuote = ref<Quote>();

const showQuote = ref(false);

const hide = () => {
  showQuote.value = false;
};

const show = () => {
  currentQuote.value = quotes.peek();

  const foundStyle = styles.findIndex(({ check }) => check && check(currentQuote.value!, config)); // eslint-disable-line @typescript-eslint/no-non-null-assertion
  currentStyleIndex.value = foundStyle === -1 ? styles.indexOf(getRandomValue(defaultStyles.value)) : foundStyle;

  showQuote.value = true;
};

const onAfterLeave = () => {
  quotes.dequeue();
  currentQuote.value = undefined;

  if (quotes.length > 0) {
    window.setTimeout(show, config.gap);
  }
};

const onAfterAppear = () => {
  window.setTimeout(hide, config.timeout);
};

const addQuote = (text: string) => {
  const quoteUser = text.match(/@\w+/)?.[0];
  const filteredText = (quoteUser ? text.replace(quoteUser, '') : text)
    .trim()
    .replaceAll(/[^\s\w!'(),.?[\]ÄÖÜßäöü\uD800-\uDFFF-]/g, '')
    .replace(/ \uDB40\uDC00$/, ''); // this string is automatically appended by Twitch if sending the message twice (arrow up, enter)

  if (filteredText === '') {
    return;
  }

  quotes.enqueue({
    text: filteredText,
    cite: quoteUser ? quoteUser.slice(1) : config.channel!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    year: new Date().getFullYear(),
  });

  if (quotes.length > 0 && currentQuote.value === undefined) {
    show();
  }
};

const commands: Record<string, Command> = {
  quote: {
    cmds: ['quote'],
    check: (message, config_) => (config_.everyone || isModerator(message, config_)) && config_.rewardId === undefined,
    run: (message) => {
      addQuote(message.message.split(/ (.*)/s)[1]);
      console.log(quotes);
    },
  },
  unquote: {
    cmds: ['unquote'],
    check: isModerator,
    run: (message) => {
      const usernames = message.message.split(' ').slice(1);
      addToDenyList(...usernames);
    },
  },
};

const handleReward = (message: BaseMessage | PrivateMessage, config_: Config) => {
  if (
    config_.rewardId !== undefined &&
    (config_.everyone || isModerator(message, config_)) &&
    message.tags.customRewardId !== undefined &&
    message.tags.customRewardId === config_.rewardId
  ) {
    addQuote(message.message);
    return true;
  }

  return false;
};

const handleMessage = async (message: BaseMessage | PrivateMessage) => {
  const config_ = getConfig();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { username, tags, message: message_ } = message;

  if (!isAllowed(username)) {
    console.log(username, 'is on blocklist');
    return;
  }

  if (tags.customRewardId !== undefined) {
    console.log(tags.customRewardId);
  }

  const wasHandled = handleReward(message, config_);

  if (wasHandled) {
    return;
  }

  for (const { cmds, check, run } of Object.values(commands)) {
    // eslint-disable-next-line no-await-in-loop
    if (cmds.some((cmd) => message_.startsWith(`!${cmd} `)) && (await check(message, config_))) {
      void run(message, config_);
    }
  }
};

if (config.channel) {
  const { Chat } = window.TwitchJs;
  const chat = new Chat({ token: config.token, username: config.username, log: { level: 'warn' } });

  chat.on('PRIVMSG', (message) => {
    void handleMessage(message);
  });

  await chat.connect();
  await chat.join(config.channel);
} else {
  new Error('Please define a channel via URL, either by ?channel=yourchannel or #yourchannel.');
}
</script>

<style lang="postcss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: filter 1.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  filter: opacity(0);
}
</style>
