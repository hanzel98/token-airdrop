# Advanced Sample Hardhat Project

This airdrop is cheaper than a whitelisted version of an airdrop, but the drawback is that the deployer needs to know all the addresses that will be able to withdraw. It is not possible to change the original list because the merkle root would change too. On the other hand a whitelisted version could be modified at any moment by an admin allowing more flexibility but paying a higher price.

```shell
npm install
npx hardhat compile
npm run test
```

# Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.example file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
npm run verify-rinkeby
```
