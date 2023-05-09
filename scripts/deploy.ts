import { ethers, run, network } from 'hardhat';

const SEPOLIA_CHAIN_ID = 11155111;

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    );
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.deployed();
    console.log('Deployed contract address', simpleStorage.address);

    if (
        network.config.chainId === SEPOLIA_CHAIN_ID &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.address, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log('🚀 ~ file: deploy.js:21 ~ main ~ currentValue:', currentValue);

    const transactionResponse = await simpleStorage.store(7);
    const beforeWaitUpdatedValue = await simpleStorage.retrieve();
    console.log(
        '🚀 ~ file: deploy.js:25 ~ main ~ beforeWaitUpdatedValue:',
        beforeWaitUpdatedValue
    );
    await transactionResponse.wait(1);
    const updatedValue = await simpleStorage.retrieve();
    console.log('🚀 ~ file: deploy.js:26 ~ main ~ updatedValue:', updatedValue);
}

async function verify(contractAddress: string, args: any[]) {
    console.log('Verifying contract...');

    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e: any) {
        if (e.message.toLowerCase().includes('already verified')) {
            console.log('already verified');
        } else {
            console.log(e);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
