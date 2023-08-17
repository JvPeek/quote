import type { BaseMessage, PrivateMessage } from 'twitch-js';

import type { Config } from '~/types/index.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRandomIndex = (array: any[]): number => Math.floor(Math.random() * array.length);

export const getRandomValue = <T>(array: T[]): T => array[getRandomIndex(array)];

export const isModerator = (message: BaseMessage | PrivateMessage, config: Config): boolean =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  message.tags.isModerator || message.tags.badges.broadcaster || message.username.toLowerCase() === config.channel?.toLowerCase();
