import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';
import '@typechain/hardhat';
import 'hardhat-deploy';

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
console.log(
    '🚀 ~ file: hardhat.config.ts:6 ~ SEPOLIA_RPC_URL:',
    SEPOLIA_RPC_URL
);

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKET_CAP_API_KEY = process.env.COINMARKET_CAP_API_KEY;

const config: HardhatUserConfig = {
    defaultNetwork: 'hardhat',
    solidity: {
        compilers: [
            {
                version: '0.8.8',
            },
            {
                version: '0.6.6',
            },
        ],
    },
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY!],
            chainId: 11155111,
        },
        localhost: {
            url: 'http://127.0.0.1:7545/',
            chainId: 1337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    gasReporter: {
        enabled: true,
        noColors: true,
        outputFile: 'gas-report.txt',
        currency: 'USD',
        coinmarketcap: COINMARKET_CAP_API_KEY,
        token: 'ETH',
    },
};

export default config;
