import { assert } from 'chai';
import { ethers, network } from 'hardhat';
import { developmentChains } from '../../helper-hardhat-config';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { FundMe } from '../../typechain-types';

developmentChains.includes(network.name)
    ? describe.skip
    : describe('FundMe Staging Tests', async function () {
          let fundMe: FundMe;
          let deployer: SignerWithAddress;

          beforeEach(async function () {
              const accounts = await ethers.getSigners();
              deployer = accounts[0];
              fundMe = await ethers.getContract('FundMe', deployer.address);
          });

          it('Allows people to fund and withdraw', async function () {
              await fundMe.fund({ value: ethers.utils.parseEther('0.1') });
              await fundMe.withdraw({
                  gasLimit: 100000,
              });
              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              assert.equal(endingFundMeBalance.toString(), '0');
          });
      });
