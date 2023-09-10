import type { Config } from '~/types/index.js';

const config: Config = {
  username: undefined,
  token: undefined,
  rewardId: undefined,
  channel: undefined,
  everyone: false,
  timeout: 10_000,
  gap: 1000,
  deny: undefined,
};
let loaded = false;

const loadDenyList = () => {
  // @ts-expect-error because value could not be set
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  config.deny = new Set<string>([...(localStorage.getItem('denylist') ? JSON.parse(localStorage.getItem('denylist')) : [])].filter(Boolean));
};

const saveDenyList = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  localStorage.setItem('denylist', JSON.stringify([...config.deny!.entries()]));
};

export const isAllowed = (username: string) => !config.deny?.has(username);

export const addToDenyList = (...usernames: string[]) => {
  for (const username of usernames) {
    config.deny?.add(username);
  }

  saveDenyList();
};

export const removeFromDenyList = (...usernames: string[]) => {
  for (const username of usernames) {
    config.deny?.delete(username);
  }

  saveDenyList();
};

const loadConfig = () => {
  const urlParameters = new URLSearchParams(window.location.search);

  // Parse channel parameter
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  if (urlParameters.has('username') && urlParameters.has('token')) {
    config.username = urlParameters.get('username')!;
    config.token = urlParameters.get('token')!;
  }

  config.channel = urlParameters.has('channel') ? urlParameters.get('channel')! : window.location.href.split('#')[1];

  if (urlParameters.has('rewardID')) {
    config.rewardId = urlParameters.get('rewardID')!;
  }

  if (urlParameters.has('everyone')) {
    config.everyone = Boolean(urlParameters.get('everyone')!);
  }

  if (urlParameters.has('timeout')) {
    config.timeout = Number(urlParameters.get('timeout')!);
  }

  if (urlParameters.has('gap')) {
    config.gap = Number(urlParameters.get('gap')!);
  }
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  loadDenyList();
  saveDenyList();
};

export const getConfig = () => {
  if (!loaded) {
    loadConfig();
    loaded = true;
  }

  return config;
};
