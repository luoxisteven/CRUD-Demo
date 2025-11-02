// src/config.tsx
const config = {
    apiUrl: import.meta.env.PROD ? 'https://crudapi.xiluo.net/api' : 'http://localhost:8888/api',
    apiType: 'restapi', // 'restapi' or 'graphql'
  };
  
export default config;