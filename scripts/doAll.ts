import { Address, Dictionary, OpenedContract, toNano } from '@ton/core';
import { MinterAssistant } from '../wrappers/MinterAssistant';
import { compile, NetworkProvider, sleep } from '@ton/blueprint';
import { randomAddress } from '@ton/test-utils';
import { buildCollectionContentCell, setItemContentCell } from './nftContent/onChain';
import { TicketData, TicketDataValue } from '../wrappers/helpers/dictionarySerealize';

/* 
    CONSTANTS
*/
const DICT_TICKET_INDEX_SIZE = 64;

const FIRST_TIKET_TON_PRICE = 0.1;
const SECOND_TIKET_TON_PRICE = 0.5;
const THIRS_TIKET_TON_PRICE = 1;

const FIRST_TICKET_NUMBER = 15;
const SECOND_TICKET_NUMBER = 10;
const THIRS_TICKET_NUMBER = 5;


const TICKET_DEPLOY_AMOUNT = 0.08;
const SEND_MINT_VALUE = 1;

const TONS_FOR_FEE = 0.005;

export async function run(provider: NetworkProvider) {


    /*
        TICKETS DATA
    */
    let ticketOneValue: TicketData = {
        ticketPrice: toNano(FIRST_TIKET_TON_PRICE),
        howMany: BigInt(FIRST_TICKET_NUMBER),
        ticketLevel: 1n,
        ticketContent: setItemContentCell({
            name: "Pink Ticket",
            description: "Basic ticket of level 1",
            image: "https://i.ibb.co/J2SVPgF/t1.jpg"
        })
    };

    let ticketTwoValue: TicketData = {
        ticketPrice: toNano(SECOND_TIKET_TON_PRICE),
        howMany: BigInt(SECOND_TICKET_NUMBER),
        ticketLevel: 2n,
        ticketContent: setItemContentCell({
            name: "Blue Ticket",
            description: "Nice ticket of level 2",
            image: "https://i.ibb.co/wgmBq9P/t2.jpg"
        })
    };

    let ticketThreeValue: TicketData = {
        ticketPrice: toNano(THIRS_TIKET_TON_PRICE),
        howMany: BigInt(THIRS_TICKET_NUMBER),
        ticketLevel: 3n,
        ticketContent: setItemContentCell({
            name: "Gold Ticket",
            description: "Gold ticket of level 3",
            image: "https://i.ibb.co/hBN5f63/t3.jpg"
        })
    };

    let ticketsDictionary: Dictionary<bigint, TicketData> = Dictionary.empty(Dictionary.Keys.BigUint(DICT_TICKET_INDEX_SIZE), TicketDataValue);
    ticketsDictionary.set(
        1n,
        ticketOneValue
    );
    
    ticketsDictionary.set(
        2n,
        ticketTwoValue
    );

    ticketsDictionary.set(
        3n,
        ticketThreeValue
    );


    /*
        DEPLOY MINTER ASSISTANT
    */

    const minterAssistant = provider.open(MinterAssistant.createFromConfig({
        ticketMinterAddress: randomAddress(),
        nextTicketIndex: 1n, // starts with 0!!
        ownerAddress: provider.sender().address as Address,
        minterContent: buildCollectionContentCell({
            name: "Big Moscow Theatre",
            description: "Big Moscow Theatre NFT Tickets Collection on TON blockchain!",
            image: "https://i.ibb.co/Tv3ptKD/bigtheatre.jpg"
        }),
        ticketCode: await compile("Ticket"),
        ticketMinterCode: await compile("TicketMinter"),
        ticketContentDict: ticketsDictionary,
        ifMinterDeployed: 0
    }, await compile('MinterAssistant')));

    await minterAssistant.sendDeploy(provider.sender(), toNano('0.05'));
    await provider.waitForDeploy(minterAssistant.address);

    console.log("\n5 secs stop =) drink coffee\n");
    await sleep(5000); 
    
    /*
        DEPLOY TICKET MINTER
    */

    let mintValueForAllTickets = (TICKET_DEPLOY_AMOUNT + TONS_FOR_FEE) * (FIRST_TICKET_NUMBER + SECOND_TICKET_NUMBER + THIRS_TICKET_NUMBER) * 1.5;
    console.log(`[TICKETS DEPLOY COST] --> ${mintValueForAllTickets} TON's`);

    await minterAssistant.sendDeployTicketMinter(provider.sender(), {
        value: toNano(mintValueForAllTickets) + toNano(TONS_FOR_FEE), // value must be >= deployAmount
        deployAmount: toNano(mintValueForAllTickets) // TON's on TicketMinter balance!
    })
    console.log(`\nTicket minter deployed successfully!\n`);

    console.log("10 secs stop =) drink coffee\n");
    await sleep(10000); 

    /*
        MINT ALL TIKETS
    */

    await minterAssistant.sendSmartMint(provider.sender(),{
        value: toNano(SEND_MINT_VALUE),
        deployAmount: toNano(TICKET_DEPLOY_AMOUNT) 
    })

    console.log(`Tickets minted successfully!`);
}
