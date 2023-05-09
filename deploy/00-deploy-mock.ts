import { network } from 'hardhat';
import {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} from '../helper-hardhat-config';

export const deployMocks = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    console.log(
        '🚀 ~ file: 00-deploy-mock.ts:13 ~ deployMocks ~ network.name):',
        network.name
    );

    if (developmentChains.includes(network.name)) {
        log('Local network detected! Deploying mocks...');
        await deploy('MockV3Aggregator', {
            contract: 'MockV3Aggregator',
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        log('Deployed!!!!');
        log('_____________________________');
    }
};

export default deployMocks;
deployMocks.tags = ['all', 'mocks'];
