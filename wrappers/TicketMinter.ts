import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TicketMinterConfig = {};

export function ticketMinterConfigToCell(config: TicketMinterConfig): Cell {
    return beginCell().endCell();
}

const OPERATION_CODE_SIZE = 32;
const TICKET_LEVEL_SIZE = 32;

export class TicketMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new TicketMinter(address);
    }

    static createFromConfig(config: TicketMinterConfig, code: Cell, workchain = 0) {
        const data = ticketMinterConfigToCell(config);
        const init = { code, data };
        return new TicketMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }   

    async sendBuyTicket(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint,
            wishedTicketLevel: bigint
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0xaabb, OPERATION_CODE_SIZE)
                    .storeUint(options.wishedTicketLevel, TICKET_LEVEL_SIZE)
                .endCell(),
        });
    }

    async sendUpdateMyTicket(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint,
            currentTicketAddress: Address,
            wishedTicketLevel: bigint
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0xaaab, OPERATION_CODE_SIZE)
                    .storeAddress(options.currentTicketAddress)
                    .storeUint(options.wishedTicketLevel, TICKET_LEVEL_SIZE)
                .endCell(),
        });
    }

}
