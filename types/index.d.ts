import TwitchJs, { Chat } from 'twitch-js';

declare global {
  interface Window {
    TwitchJs: { Chat: typeof Chat };
  }
}

export {};
