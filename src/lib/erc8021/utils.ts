/**
 * ERC-8021: Transaction Attribution
 * Enables attribution of transactions for builders and developers.
 */

export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";
export const BUILDER_CODE = "[BUILDER_CODE]";

export function generateAttributionString() {
  return `Attribution: ${ATTRIBUTION_CODE} | Builder: ${BUILDER_CODE}`;
}

export function appendAttributionToCalldata(baseCalldata: string): string {
  // Simple append simulator for ERC-8021
  const attributionHex = Buffer.from(generateAttributionString(), 'utf8').toString('hex');
  return `${baseCalldata}${attributionHex}`;
}
