import { stringToHex, Hex } from 'viem';

// The Builder Code from User
export const BUILDER_CODE = 'bc_fh385nuq';
// App ID from Base Buildathon
export const APP_ID = '68f51d868c4fe3f562003e65';

/**
 * ERC-8021 Transaction Attribution Utils
 * Appends app and builder attributions to the end of call data.
 */
export function withERC8021Attribution(originalData?: Hex): Hex {
  const attributionString = `?app=${APP_ID}&builder=${BUILDER_CODE}`;
  const attributionHex = stringToHex(attributionString);
  
  if (!originalData || originalData === '0x') {
    return attributionHex;
  }
  
  // Concatenate hex strings (remove the '0x' from the second one)
  return `${originalData}${attributionHex.replace('0x', '')}` as Hex;
}
