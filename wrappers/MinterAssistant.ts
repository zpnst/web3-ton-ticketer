
import { TicketData, TicketDataValue } from './helpers/dictionarySerealize';
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Dictionary, Sender, SendMode } from '@ton/core';


const TICKET_INDEX_SIZE = 64;
const OPERATION_CODE_SIZE = 32;

export type MinterAssistantConfig = {
    ticketMinterAddress: Address,
    nextTicketIndex: bigint,
    ownerAddress: Address,
    minterContent: Cell,
    ticketCode: Cell,
    ticketMinterCode: Cell,
    ticketContentDict: Dictionary<bigint, TicketData>,
    ifMinterDeployed: number
};

export function minterAssistantConfigToCell(config: MinterAssistantConfig): Cell {
    return (
        beginCell()
            .storeAddress(config.ticketMinterAddress)
            .storeUint(config.nextTicketIndex, TICKET_INDEX_SIZE)
            .storeAddress(config.ownerAddress)
            .storeRef(config.minterContent)
            .storeRef(config.ticketCode)
            .storeRef(config.ticketMinterCode)
            .storeDict(config.ticketContentDict)
            .storeBit(config.ifMinterDeployed)
        .endCell());
}

export class MinterAssistant implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new MinterAssistant(address);
    }

    static createFromConfig(config: MinterAssistantConfig, code: Cell, workchain = 0) {
        const data = minterAssistantConfigToCell(config);
        const init = { code, data };
        return new MinterAssistant(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendDeployTicketMinter(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint,
            deployAmount: bigint
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0xbbba, OPERATION_CODE_SIZE)
                    .storeCoins(options.deployAmount)
                .endCell(),
        });
    }

    async sendSmartMint(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint,
            deployAmount: bigint
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: 
                beginCell()
                    .storeUint(0xbbbb, OPERATION_CODE_SIZE)
                    .storeCoins(options.deployAmount)
                .endCell(),
        });
    }

    async sendTonsToAssistant(provider: ContractProvider, via: Sender, 
        options: {
            value: bigint,
        }
    ) {
        await provider.internal(via, {
            value: options.value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }
}
