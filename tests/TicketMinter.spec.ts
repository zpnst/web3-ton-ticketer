import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { TicketMinter } from '../wrappers/TicketMinter';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('TicketMinter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('TicketMinter');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let ticketMinter: SandboxContract<TicketMinter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        ticketMinter = blockchain.openContract(TicketMinter.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await ticketMinter.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: ticketMinter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and ticketMinter are ready to use
    });
});
