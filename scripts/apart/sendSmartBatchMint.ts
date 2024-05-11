import { Address, toNano } from '@ton/core';
import { MinterAssistant } from '../../wrappers/MinterAssistant';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const ui = provider.ui();
    const address = Address.parse("<MINTER ASSISTANT ADDRESS>"); // Minter Assistant address
    const nftCollection = provider.open(MinterAssistant.createFromAddress(address));

    await nftCollection.sendSmartMint(provider.sender(),{
        value: toNano(""), 
        deployAmount: toNano("") 
    })
    ui.write(`Tickets minted successfully!`);
}
