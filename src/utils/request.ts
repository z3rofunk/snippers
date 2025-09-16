import { HttpsProxyAgent } from 'https-proxy-agent';

function TimeoutController(timeout: number = 2000) {
  const controller = new AbortController();

  let timeoutId: NodeJS.Timeout | undefined;
  if (!!timeout) {
    timeoutId = setTimeout(() => controller.abort(), timeout);
  }

  return { timeoutId, controller };
}

function ProxyController(proxy: string = '') {
  const agent: HttpsProxyAgent<string> | undefined = proxy
    ? new HttpsProxyAgent(proxy)
    : undefined;
  return { agent };
}
export { TimeoutController, ProxyController };
