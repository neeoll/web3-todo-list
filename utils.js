import { providerOptions } from "./providerOptions";

export const connectToNetwork = async (network) => {
  const Web3Modal = (await import("web3modal")).default;

  const web3modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
  });

  return await web3modal.connectTo(network);
};

export const getProvider = async(connection) => {
  const ethers = await import("ethers");
  return new ethers.providers.Web3Provider(connection)
}

export const getContract = async(address, abi, provider_signer) => {
  const ethers = await import("ethers");
  return new ethers.Contract(address, abi, provider_signer)
}

export const parseBytes32String = async(bytes32) => {
  const ethers = await import("ethers");
  return ethers.utils.parseBytes32String(bytes32)
}

export const formatBytes32String = async(string) => {
  const ethers = await import("ethers");
  return ethers.utils.formatBytes32String(string)
}

export const formatUnits = async(value, format) => {
  const ethers = await import("ethers");
  return ethers.utils.formatUnits(value, format)
}

export const generateHsl = () => {
  const hue = Math.round(Math.random() * 255)
  const saturation = Math.round((Math.random() * (1 - 0.5) + 0.5) * 100)
  const lightness = Math.round((Math.random() * (0.7 - 0.25) + 0.25) * 100)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}