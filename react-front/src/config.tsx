// src/config.tsx
const isProduction = import.meta.env && import.meta.env.PROD;

const config = {
    apiUrl: isProduction ? 'https://crudapi.xiluo.net' : 'http://localhost:3000/api',
    apiType: 'restapi', // 'restapi' or 'graphql'
  };
  
export default config;