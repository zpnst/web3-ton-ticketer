import { Address, toNano } from '@ton/core';
import { TicketMinter } from '../wrappers/TicketMinter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const ui = provider.ui();
    const address = Address.parse("<MINTER ASSISTANT ADDRESS>"); // Minter Assistant address
    const nftCollection = provider.open(TicketMinter.createFromAddress(address));

    await nftCollection.sendBuyTicket(provider.sender(),{
        value: toNano("<The ticket price of the desired level>"), //
        wishedTicketLevel: 1n // desired level
    })
    ui.write(`Tickets minted successfully!`);
}
