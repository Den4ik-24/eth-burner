import { ethers } from "ethers";
import { config } from "./args";

// Функция для получения провайдера сети Optimism
export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(config.optimismRpcUrl);
};

// Функция для создания кошелька с привязкой к провайдеру
export const getWallet = () => {
  const provider = getProvider();
  return new ethers.Wallet(config.privateKey, provider);
};

// Функция для автоматического определения оптимальной цены газа
export const getOptimalGasPrice = async (): Promise<ethers.BigNumber> => {
  const provider = getProvider();
  const gasPrice = await provider.getGasPrice(); // Получаем текущую цену газа
  console.log(`Optimal Gas Price: ${ethers.utils.formatUnits(gasPrice, "gwei")} GWEI`);
  return gasPrice;
};

// Функция для отправки средств
export const sendFunds = async (recipient: string, amount: string) => {
  const wallet = getWallet();
  const gasPrice = await getOptimalGasPrice(); // Динамически получаем цену газа

  const tx = {
    to: recipient,
    value: ethers.utils.parseEther(amount), // Сумма перевода в ETH
    gasLimit: config.gasLimit, // Лимит газа
    gasPrice: gasPrice, // Оптимальная цена газа
  };

  try {
    const transaction = await wallet.sendTransaction(tx);
    console.log(`Transaction sent: ${transaction.hash}`);
    await transaction.wait(); // Ожидаем подтверждения транзакции
    console.log(`Transaction confirmed. Sent ${amount} ETH to ${recipient}`);
  } catch (error) {
    console.error(`Error sending funds: ${error.message}`);
  }
};
