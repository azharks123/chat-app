let apiUrl; // Default API server URL
let webSocketUrl; // Deafult WebSocket URL
let baseUrl;
let aiStreamUrl;
let mqttUrl;
let frontendBaseUrl;

const { protocol, hostname, port, origin } = window?.location;
apiUrl = `${protocol}//${hostname}:8000/api`;
webSocketUrl = `${protocol === 'https:' ? 'wss' : 'ws'}://${hostname}:8000/ws`;
baseUrl = `${protocol}//${hostname}:8000/`;
aiStreamUrl = `${protocol}//${hostname}:8889/ai_stream`;
mqttUrl = `${protocol === 'https:' ? 'wss' : 'ws'}://${hostname}:8080/mqtt`;
frontendBaseUrl = `${protocol}//${hostname}:${port}`;
const config = {
  apiserver: apiUrl,
  webSocketUrl: webSocketUrl,
  baseUrl: baseUrl,
  aiStreamUrl: aiStreamUrl,
  mqttUrl: mqttUrl,
  frontendBaseUrl:frontendBaseUrl
};

export default config;
export const hostUrl = window.location.origin;