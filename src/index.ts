import "log-timestamp";
import { providers, Wallet, ethers } from "ethers";

import args from "./args";
import burn from "./burn";

// pulls args from cmd line
const RPC_URL = args.rpcUrl || 'https://mainnet.optimism.io'; // Default to Optimism mainnet
const VICTIM_KEY = args.privateKey;

async function main() {
    console.log(`Connected to ${RPC_URL}`);
    const provider = new providers.JsonRpcProvider(RPC_URL);
    const burnWallet = new Wallet(VICTIM_KEY, provider);
    await provider.ready;
    console.log("Beer fund address: ", args.beerFund);

    provider.on("block", async (blockNumber) => {
        console.log(`[BLOCK ${blockNumber}]`);
        try {
            // Устанавливаем небольшую комиссию (gasPrice) вручную
            const gasPrice = ethers.utils.parseUnits('0.001', 'gwei'); // 0.001 gwei
            await burn(burnWallet, gasPrice);
        } catch (error) {
            console.error("Error during burn operation:", error);
        }
    });
}

main();

export default {};
