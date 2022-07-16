export default function getConfig({config}) {
  const {environment, isMobile} = config;
  let url, socketUrl;
  if (environment === 'development') {
    if (isMobile) {
      url = 'http://10.0.0.189:3004';
      socketUrl = 'ws://10.0.0.189:3003';
    } else {
      url = 'http://localhost:3004';
      socketUrl = 'ws://localhost:3003';
    };
  } else if (environment === 'production') {
    url = 'https://game.mellocloud.com';
    if (isMobile) {
      socketUrl = 'wss://m.mellocloud.com/ws';
    } else {
      socketUrl = 'wss://mellocloud.com/ws';
    };
  };
  return {url, socketUrl, isMobile};
};