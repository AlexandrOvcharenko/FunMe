import { deployments, ethers, network } from 'hardhat';
import { FundMe, MockV3Aggregator } from '../../typechain-types';
import { assert, expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { developmentChains } from '../../helper-hardhat-config';

!developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe', async () => {
          let fundMe: FundMe;
          let deployer: SignerWithAddress;
          let mockV3Aggregator: MockV3Aggregator;

          beforeEach(async () => {
              const [deployer] = await ethers.getSigners();
              await deployments.fixture(['all']);
              fundMe = await ethers.getContract('FundMe', deployer);
              mockV3Aggregator = await ethers.getContract(
                  'MockV3Aggregator',
                  deployer
              );
          });

          describe('constructor', () => {
              it('sets the aggregator address correctly', async () => {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });

          describe('fund', async () => {
              it('should fail when no enough etherium was passed', async () => {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      'You need to spend more ETH!'
                  );
              });
              it('should update the amount of the current founder', async () => {
                  const sendValue = ethers.utils.parseEther('1');
                  await fundMe.fund({ value: ethers.utils.parseEther('1') });
                  const amount = await fundMe.getAddressToAmountFunded(
                      deployer.address
                  );
                  assert.equal(amount.toString(), sendValue.toString());
              });
          });

          describe('withdraw', async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: ethers.utils.parseEther('1') });
              });

              it('gives a single funder all their ETH back', async () => {
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait();
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  assert.equal(endingFundMeBalance.toString(), '0');
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });
          });

          describe('chiperWithdraw', async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: ethers.utils.parseEther('1') });
              });

              it('gives a single funder all their ETH back', async () => {
                  const startingFundMeBalance =
                      await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  const transactionResponse = await fundMe.chiperWithdraw();
                  const transactionReceipt = await transactionResponse.wait();
                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(
                      fundMe.address
                  );
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer.address);

                  assert.equal(endingFundMeBalance.toString(), '0');
                  assert.equal(
                      startingFundMeBalance
                          .add(startingDeployerBalance)
                          .toString(),
                      endingDeployerBalance.add(gasCost).toString()
                  );
              });
          });
      });
