// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require('fs')

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Main = await hre.ethers.getContractFactory("Main");
  const main = await Main.deploy()

  await main.deployed();

  console.log("Main deployed to:", main.address);
  // this code writes the contract addresses to a local file named config.js that we can use in the app
  fs.writeFileSync('./config.js', `
  export const contractAddress = "${main.address}"
  export const ownerAddress = "${main.signer.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });