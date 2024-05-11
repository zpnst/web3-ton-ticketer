# ticketer

## This is my first small project on TON for the spring hackathon of 2024, let it be for history =)

#

## Our platform is designed to stimulate:

    - doing business using the TON blockchain
financial mechanics on the TON blockchain
    - to make the blockchain more understandable for people

## Taiga Ticketer helps:

    - create a unique collection of tickets or invitations without any special investments.
    - buy tickets in one click with the option to pay extra for a better ticket

You don't need Ton/Telegram development skills to do this. Integrate TON blockchain mechanisms into your event!

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
