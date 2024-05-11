import { Address, Dictionary, toNano } from '@ton/core';
import { MinterAssistant } from '../../wrappers/MinterAssistant';
import { compile, NetworkProvider } from '@ton/blueprint';
import { randomAddress } from '@ton/test-utils';
import { buildCollectionContentCell, setItemContentCell } from '../nftContent/onChain';
import { TicketData, TicketDataValue } from '../../wrappers/helpers/dictionarySerealize';

const DICT_TICKET_INDEX_SIZE = 64;

export async function run(provider: NetworkProvider) {

    let ticketOneValue: TicketData = {
        ticketPrice: toNano("0.1"),
        howMany: 20n,
        ticketLevel: 1n,
        ticketContent: setItemContentCell({
            name: "Pink Ticket",
            description: "Basic ticket of level 1",
            image: "https://i.ibb.co/J2SVPgF/t1.jpg"
        })
    };

    let ticketTwoValue: TicketData = {
        ticketPrice: toNano("0.5"),
        howMany: 5n,
        ticketLevel: 2n,
        ticketContent: setItemContentCell({
            name: "Blue Ticket",
            description: "Nice ticket of level 2",
            image: "https://i.ibb.co/wgmBq9P/t2.jpg"
        })
    };

    let ticketThreeValue: TicketData = {
        ticketPrice: toNano("1"),
        howMany: 2n,
        ticketLevel: 2n,
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
}
