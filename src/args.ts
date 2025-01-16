const cmdArgs = require("command-line-args");

type Args = {
    privateKey: string;
    rpcUrl: string;
    beerFund?: string;
    gasPrice?: string; // Новая опция для установки фиксированной цены газа
};

const optionDefinitions = [
    { name: "private-key", alias: "k", type: String },
    { name: "rpc-url", alias: "u", type: String },
    { name: "beer-fund", alias: "b", type: String, defaultOption: true },
    { name: "gas-price", alias: "g", type: String }, // Опция для фиксированной цены газа
];

// Чтение аргументов командной строки
const options = cmdArgs(optionDefinitions);

// Проверка всех необходимых параметров
for (const o of optionDefinitions) {
    if (!options[o.name] && !o.defaultOption) {
        console.error(`Missing argument --${o.name}`);
        process.exit(1);
    }
}

// Параметры по умолчанию для сети Optimism
const defaultRpcUrl = "https://mainnet.optimism.io"; // RPC URL для Optimism Mainnet
const defaultBeerFund = "0x770916d1Bf796E79E84e264aF471f3cD12b52C62"; // Пример контракта
const defaultGasPrice = "0.001"; // Значение по умолчанию для фиксированной цены газа в gwei

// Если rpcUrl не указан, используем значение по умолчанию для Optimism Mainnet
const rpcUrl = options["rpc-url"] || defaultRpcUrl;

// Проверка правильности RPC-URL для сети Optimism
if (!rpcUrl.includes("optimism")) {
    console.error("Provided rpcUrl is not valid for Optimism network.");
    process.exit(1);
}

// Проверка на наличие приватного ключа
const privateKey = options["private-key"];
if (!privateKey) {
    console.error("Missing argument --private-key");
    process.exit(1);
}

// Получение значения фиксированной цены газа из аргументов или установка значения по умолчанию
const gasPrice = options["gas-price"] || defaultGasPrice;

const args: Args = {
    privateKey,
    rpcUrl,
    beerFund: options["beer-fund"] || defaultBeerFund,
    gasPrice,
};

export default args;
