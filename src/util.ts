import { BigNumber } from "@ethersproject/bignumber";

const GWEI = BigNumber.from(1e9);

/** Returns human-readable gas price in gwei for Optimism. */
export const gasPriceToGwei = (gasPrice: BigNumber) => {
    if (gasPrice.isZero()) {
        return 0; // Explicitly return 0 gwei if gasPrice is zero
    }
    return gasPrice.mul(100).div(GWEI).toNumber() / 100;
};
