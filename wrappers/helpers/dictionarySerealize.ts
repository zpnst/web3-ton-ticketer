import { Cell, DictionaryValue } from "@ton/core";

const HOW_MANY_SIZE = 16;
const TICKET_LEVEL_SIZE = 32;

export type TicketData = {
    ticketPrice: bigint;
    howMany: bigint;
    ticketLevel: bigint;
    ticketContent: Cell;
}

export const TicketDataValue: DictionaryValue<TicketData> = {
    serialize(src, builder) {
        builder.storeCoins(src.ticketPrice);
        builder.storeUint(src.howMany, HOW_MANY_SIZE);
        builder.storeUint(src.ticketLevel, TICKET_LEVEL_SIZE);
        builder.storeRef(src.ticketContent);
    },

    parse(src) {
        return {
            ticketPrice: src.loadCoins(),
            howMany: src.loadUintBig(HOW_MANY_SIZE),
            ticketLevel: src.loadUintBig(TICKET_LEVEL_SIZE),
            ticketContent: src.loadRef()
        }
    }
};