import { Address, toNano } from '@ton/core';
import { MinterAssistant } from '../../wrappers/MinterAssistant';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider, args: string[]) {

    const ui = provider.ui();
    const address = Address.parse("<MINTER ASSISTANT ADDRESS>"); // Minter Assistant address
    const nftCollection = provider.open(MinterAssistant.createFromAddress(address));
    
    await nftCollection.sendDeployTicketMinter(provider.sender(),{
        value: toNano(""), // value must be >= deployAmount
        deployAmount: toNano("") // TON's on TicketMinter balance!
    })
    ui.write(`Ticket minter deployed successfully!`);
}
