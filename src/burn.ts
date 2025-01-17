import { ethers } from "ethers";
import { getProvider, sendFunds } from "./util";
import { config } from "./args";

const provider = getProvider();

const monitorWallet = async () => {
  const address = new ethers.Wallet(config.privateKey).address;
  console.log(`Monitoring wallet: ${address}`);

  provider.on("block", async () => {
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);

    console.log(`Balance: ${balanceInEth} ETH`);

    if (balance.gt(ethers.utils.parseEther("0.01"))) { // Отправка, если баланс больше 0.01 ETH
      console.log("Balance threshold reached. Sending funds...");
      await sendFunds(config.recipient, balanceInEth);
    }
  });
};

monitorWallet();
