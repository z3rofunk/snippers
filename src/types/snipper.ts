import { SNIPPERS } from '../snippers/index';

/**
 * Configuration options for snipper instances.
 */
export interface SnipperConfig {
  /** Optional timeout in milliseconds for operations. */
  timeout?: number;

  proxy?: string;
}

export interface SnipResult {
  /** The snipped (shortened) URL. */
  snippedUrl: string;
  /** The original URL that was snipped. */
  originalUrl: string;
}

/**
 * Type alias for available snipper identifiers.
 */
export type SnipperId = keyof typeof SNIPPERS;
