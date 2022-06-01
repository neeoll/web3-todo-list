require("@nomiclabs/hardhat-waffle")

const ALCHEMY_API_KEY = "MCMFr3BnL4IqMABkqhIqFFGParjITlPF"
const GOERLI_PRIVATE_KEY = "a89792116b214273ba5c64bb57b0b6844a43fe86c5ac75e10dd7d29ebcfe69bc"

module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 31337
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  },
};
