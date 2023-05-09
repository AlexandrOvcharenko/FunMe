import { task } from "hardhat/config";

export default task("block-number").setAction(async (taskArgs, hre) => {
  const blockNumber = await (hre as any).ethers.provider.getBlockNumber();
  console.log("🚀 ~ file: block-number.js:6 ~ blockNumber:", blockNumber);
});
