
import { Address } from '@ton/core';
import { Ticket } from '../wrappers/Ticket';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {

    const address = Address.parse("<NFT Ticket Address>");
    const itemContract = provider.open(Ticket.createFromAddress(address));

    const result = await itemContract.getFullTicketData();

    console.log("[INIT] -->", result[0]);
    console.log("[INDEX] -->", result[1]);
    console.log("[COLLECTION ADDRESS] -->", result[2]);
    console.log("[OWNER ADDRESS] -->", result[3]);
    console.log("[TICKET PRICE] -->", result[5]);
    console.log("[TICKET LEVEL] -->", result[6]);
    (result[7] == -1n) ? console.log("[SOLD?] --> TRUE") : console.log("[SOLD?] --> FALSE")
}