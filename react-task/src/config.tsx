// src/config.tsx
const config = {
    apiUrls: import.meta.env.PROD
      ? ['https://crudapi.xiluo.net/api', 'https://api.xiluo.net/api']
      : ['http://localhost:8888/api', 'https://api.xiluo.net/api'],
    apiType: 'restapi', // 'restapi' or 'graphql'
  };

export default config;