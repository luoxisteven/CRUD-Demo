// src/config.tsx
const config = {
    apiUrls: import.meta.env.PROD
      ? ['https://api2.xiluo.net/Task', 'https://api.xiluo.net/api']
      : ['https://api2.xiluo.net/Task', 'https://api.xiluo.net/api'],
    apiType: 'aws-lambda', // 'restapi' or 'graphql' or 'aws-lambda'
  };

export default config;