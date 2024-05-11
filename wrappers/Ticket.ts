import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type TicketConfig = {};

export function ticketConfigToCell(config: TicketConfig): Cell {
    return beginCell().endCell();
}

export class Ticket implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Ticket(address);
    }

    static createFromConfig(config: TicketConfig, code: Cell, workchain = 0) {
        const data = ticketConfigToCell(config);
        const init = { code, data };
        return new Ticket(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async getFullTicketData(provider: ContractProvider): Promise<[bigint, bigint, Address, Address, Cell, bigint, bigint, bigint]> {
        const result = await provider.get("get_full_ticket_data", []);
        
        let data: [bigint, bigint, Address, Address, Cell, bigint, bigint, bigint];
        data = [
            result.stack.readBigNumber(),
            result.stack.readBigNumber(),
            result.stack.readAddress(),
            result.stack.readAddress(),
            result.stack.readCell(),
            result.stack.readBigNumber(),
            result.stack.readBigNumber(),
            result.stack.readBigNumber()
        ];
        return data;
    } 
}
