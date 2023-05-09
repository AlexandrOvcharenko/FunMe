import { developmentChains, networkConfig } from '../helper-hardhat-config';
import { network } from 'hardhat';
import { verify } from '../utils/verify';

export const deployFundMe = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let ethUsedPriceFeedAddress;
    const isDevelopmentNetwork = developmentChains.includes(network.name);

    if (isDevelopmentNetwork) {
        const aggregator = await get('MockV3Aggregator');
        ethUsedPriceFeedAddress = aggregator.address;
    } else {
        ethUsedPriceFeedAddress =
            networkConfig[chainId!]['ethUsedPriceFeedAddress'];
    }

    const args = [ethUsedPriceFeedAddress];
    const fundMe = await deploy('FundMe', {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkConfig[chainId!]?.blockConfirmations || 0,
    });

    if (!isDevelopmentNetwork && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }
};
export default deployFundMe;
deployFundMe.tags = ['all', 'fundMe'];
