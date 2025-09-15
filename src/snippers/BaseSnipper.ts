import fetch from 'node-fetch';

import { TimeoutController, ProxyController } from '../utils/request';

import { type SnipperConfig } from '../types/snipper';

export abstract class BaseSnipper {
  constructor(protected config: SnipperConfig = {}) {
    this.config = config;
  }

  protected get = async (
    baseUrl: string,
    params: Record<string, unknown> = {},
  ) => {
    const { timeoutId, controller } = TimeoutController(this.config.timeout);
    const { agent } = ProxyController(this.config.proxy);

    try {
      const finalUrl = this.buildUrlWithParams(baseUrl, params);
      const response = await fetch(finalUrl, {
        agent,
        signal: controller.signal,
      });

      return response;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  protected post = async (
    baseUrl: string,
    payload: unknown,
    params: Record<string, unknown> = {},
    headers?: HeadersInit,
  ) => {
    const { timeoutId, controller } = TimeoutController(this.config.timeout);
    const { agent } = ProxyController(this.config.proxy);
    try {
      const finalUrl = this.buildUrlWithParams(baseUrl, params);
      const response = await fetch(finalUrl, {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify(payload),
        agent,
        ...(headers && { headers }),
      });

      return response;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  private buildUrlWithParams = (
    baseUrl: string,
    params?: Record<string, unknown>,
  ): string => {
    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }

    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }

    return url.toString();
  };
}
