// src/config.tsx
const config = {
    apiUrl: import.meta.env.PROD ? 'http://crudapi-xiluo-net.7hhggqp82et0a.ap-southeast-2.cs.amazonlightsail.com/api' : 'http://localhost:3000/api',
    apiType: 'restapi', // 'restapi' or 'graphql'
  };
  
export default config;