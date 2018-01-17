/**
 * @providesModule TeleMedicine.utils.sysutils
 */

/** Usage: await sleep(ms); */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
