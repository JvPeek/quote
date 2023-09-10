import type { BaseMessage, PrivateMessage } from 'twitch-js';

export type Promisable<T> = Promise<T> | T;

export type Config = {
  username: string | undefined;
  token: string | undefined;
  rewardId: string | undefined;
  channel: string | undefined;
  everyone: boolean;
  timeout: number;
  gap: number;
  deny: Set<string> | undefined;
};

export type Quote = {
  text: string;
  cite: string;
  year: number;
};

export type QuoteStyle = {
  name: string;
  backgroundImage?: string;
  foregroundImage?: string;
  backgroundVideo?: { src: string; loop?: boolean };
  sound?: { src: string; loop?: boolean };
  transition?: string;
  eligible?: boolean;
  check?: (quote: Quote, config: Config) => Promisable<boolean>;
};

export type QuoteData = {
  quote: Quote;
  quoteStyle: QuoteStyle;
};

export type Command = {
  cmds: string[];
  check: (message: BaseMessage | PrivateMessage, config: Config) => Promisable<boolean>;
  run: (message: BaseMessage | PrivateMessage, config: Config) => Promisable<void>;
};
