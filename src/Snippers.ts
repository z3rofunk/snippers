import { SNIPPERS } from './snippers/index';
import { SnipperError } from './error/SnipperError';
import { type SnipperId, type SnipperConfig } from './types/snipper';

/**
 *  Class for creating snipper instances based on ID.
 */
class Snippers {
  /**
   * Creates a new snipper instance of the specified type.
   *
   * @param snipperId - The ID of the snipper to create.
   * @param config - Optional configuration for the snipper.
   * @returns A new instance of the requested snipper.
   * @throws {Error} If the snipper ID is not found.
   *
   * @example
   * const snipper = Snipper.create('dagd', { timeout: 5000 });
   * const result = await snipper.snip('https://example.com');
   */
  static create<T extends SnipperId & keyof typeof SNIPPERS>(
    snipperId: T,
    config: SnipperConfig = {},
  ): InstanceType<(typeof SNIPPERS)[T]> {
    const SnipperClass = SNIPPERS[snipperId];
    if (!SnipperClass) {
      throw new SnipperError(`Snipper with id '${snipperId}' not found`);
    }
    return new SnipperClass(config) as InstanceType<(typeof SNIPPERS)[T]>;
  }

  /**
   * Retrieves a list of available snipper IDs.
   *
   * @returns {SnipperId[]} An array of available snipper IDs.
   *
   * @example
   * const available = Snipper.getAvailableSnippers();
   * console.log(available); // ['dagd']
   */
  static getAvailableSnippers(): SnipperId[] {
    return Object.keys(SNIPPERS) as SnipperId[];
  }
}

export { Snippers };
