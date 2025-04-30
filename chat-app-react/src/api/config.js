let apiUrl;
let webSocketUrl;
let baseUrl;
let frontendBaseUrl;

// http://127.0.0.1:8000/
// const hostname = '192.168.1.10'
const { protocol, hostname, port, origin } = window?.location;
// const { protocol, hostname, port, origin } = window?.location;
apiUrl = `${protocol}//${hostname}:8000/api`;
webSocketUrl = `${protocol === 'https:' ? 'wss' : 'ws'}://${hostname}:8000/ws`;
baseUrl = `${protocol}//${hostname}:8000/`;
frontendBaseUrl = `${protocol}//${hostname}:${port}`;
const config = {
  apiserver: apiUrl,
  baseUrl: baseUrl,
  frontendBaseUrl: frontendBaseUrl,
  webSocketUrl: webSocketUrl
};

export default config;
export const hostUrl = window.location.origin;