# Tudu
## About
Tudu is an open-source, serverless React application built using the Ethereum network that allows users to create and manage todos and share them with other people. The front end is currently hosted on [Vercel](https://web3-todo-list-osa9dqk1u-ariasnoel.vercel.app/).

## Installation
After creating a fork of this repository, navigate to the root of the project directory and run `npm install` in the console to install all the requisite dependencies. 

## Usage
In your console, create a new local Hardhat node with `npx hardhat node`. Once this is done, you will be given a series of private keys to use on the network for development purposes. Copy and paste one of these keys into the wallet of your choice. In your wallet, navigate to its network settings. Enable test networks if you haven't done so, and select the option to add a custom network. Then write these values into the corresponding field.

* **Network Name**: Localhost 8545
* **New RPC URL**: http://localhost:8545
* **Chain ID**: 31337
* **Currency Symbol**: ETH

Now that all this is done, you can finally start the development server, so in a separate console, use `npm run dev`, and if everything was done correctly, the development server should be running and the app now functional.

## Contributing
If there's something you would like to see added or the app stops behaving as expected, feel free to create a new issue and I will look into it when possible. Alternatively, after creating an issue, you can open a pull request and implement functionality yourself if the feature or features align with the project ethos.