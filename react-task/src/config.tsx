// src/config.tsx
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const devApiUrls = [
  'http://localhost:8888/api',
  'http://host.docker.internal:8888/api',
  'https://crudapi.itm.dev/api',
  'https://api.xiluo.net/api',
];

const prodApiUrls = [
  'https://crudapi.itm.dev/api',
  'https://crudapi.xiluo.net/api',
  'https://api.xiluo.net/api',
];

const config = {
  apiUrls: isLocal ? devApiUrls : prodApiUrls,
  apiType: 'restapi', // 'restapi' or 'graphql'
};

export default config;