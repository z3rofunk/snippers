import fetch from 'node-fetch';

import { TimeoutController, ProxyController } from '../utils/request';

import { SnipperError } from '../error/SnipperError';

import { type SnipperConfig, type SnipResult } from '../types/snipper';

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
  /**
   * Validates and normalizes a URL string.
   *
   * @param url - The URL to validate.
   * @returns The validated and possibly normalized URL.
   * @throws {SnipperError} If the URL is empty or invalid.
   *
   * @example
   * const validUrl = this.validateUrl('example.com'); // returns 'http://example.com'
   */
  protected validateUrl = (url: string) => {
    if (!url || url.trim() === '') {
      throw new SnipperError('URL cannot be empty', url);
    }
    const urlRegex: RegExp =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `http://${url}`;
    }

    if (!url.match(urlRegex)) {
      throw new SnipperError('Invalid URL format', url);
    }
    return url;
  };

  /**
   * Abstract method to snip (shorten) a URL.
   *
   * @param {string} url - The URL to snip.
   * @returns {Promise<SnipResult>} A Promise resolving to the SnipResult.
   * @throws {SnipperError} If snipping fails.
   */
  protected abstract snip(url: string): Promise<SnipResult>;

  /**
   * Optional method to un-snip (expand) a shortened URL.
   *
   * @param {string} snippedUrl - The snipped (shortened) URL to un-snip (expand).
   * @returns  {Promise<SnipResult>} A Promise resolving to the SnipResult with original URL.
   * @throws {SnipperError} If un-snipping fails.
   */
  protected unSnip?(snippedUrl: string): Promise<SnipResult>;
}
