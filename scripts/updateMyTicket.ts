import { Address, toNano } from '@ton/core';
import { TicketMinter } from '../wrappers/TicketMinter';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const ui = provider.ui();
    const address = Address.parse("<MINTER ASSISTANT ADDRESS>"); // Minter Assistant address
    const nftCollection = provider.open(TicketMinter.createFromAddress(address));

    await nftCollection.sendUpdateMyTicket(provider.sender(),{
        value: toNano("<EXTRA PAYMENTS>"), // 2 level ticket costs 0.5 TON => need to pay extra 0.4 TON's
        currentTicketAddress: Address.parse("<Ticket address>"), // ticket address to update
        wishedTicketLevel: 3n // a new desired level
    })
    ui.write(`Tickets minted successfully!`);
}
