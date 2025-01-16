import { BigNumber } from "@ethersproject/bignumber";

const GWEI = BigNumber.from(1e9);

/** Returns human-readable gas price in gwei for Optimism. */
export const gasPriceToGwei = (gasPrice: BigNumber) => {
    if (gasPrice.isZero()) {
        return 0; // Explicitly return 0 gwei if gasPrice is zero
    }
    // Multiply by 1e6 to keep precision, then divide by 1e9 (GWEI) and return as float
    return gasPrice.mul(1e6).div(GWEI).toNumber() / 1e6;
};