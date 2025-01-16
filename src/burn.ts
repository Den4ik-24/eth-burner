import { utils, Wallet } from "ethers"; 
import args from "./args";
import { gasPriceToGwei } from "./util";
const { formatEther } = utils;
const flashbotsBeerFund = args.beerFund;

const burn = async (burnWallet: Wallet) => {
    const balance = await burnWallet.getBalance();
    if (balance.isZero()) {
        console.log(`Balance is zero`);
        return;
    }

    // Устанавливаем фиксированную цену газа (0.001 gwei)
    const gasPrice = utils.parseUnits('0.001', 'gwei'); 
    console.log(`Using fixed gas price: ${gasPriceToGwei(gasPrice)} gwei`);

    // Оцениваем газ для простой транзакции
    const gasLimit = await burnWallet.provider.estimateGas({
        to: flashbotsBeerFund,
        value: balance
    });

    // Рассчитываем стоимость газа
    const gasCost = gasPrice.mul(gasLimit);
    if (balance.lte(gasCost)) {
        console.log(`Balance too low to cover gas cost (balance=${formatEther(balance)}, gasCost=${formatEther(gasCost)}) ETH`);
        return;
    }

    const leftovers = balance.sub(gasCost);
    console.log(`Leftovers after gas cost: ${formatEther(leftovers)} ETH`);

    try {
        console.log(`Burning ${formatEther(balance)} ETH`);
        const nonce = await burnWallet.provider.getTransactionCount(burnWallet.address);
        const tx = await burnWallet.sendTransaction({
            to: flashbotsBeerFund,
            gasLimit,
            gasPrice,
            nonce,
            value: leftovers,
        });
        console.log(`Sent tx with nonce ${tx.nonce} burning ${formatEther(balance)} ETH at gas price ${gasPriceToGwei(gasPrice)} gwei`);
        console.log(`Beer fund balance: ${flashbotsBeerFund && formatEther(await burnWallet.provider.getBalance(flashbotsBeerFund))} ETH`);
    } catch (err: any) {
        console.log(`Error sending tx: ${err.message ?? err}`);
    }
}

export default burn;
