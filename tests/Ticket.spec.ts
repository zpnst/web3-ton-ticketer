import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { Ticket } from '../wrappers/Ticket';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('Ticket', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Ticket');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let ticket: SandboxContract<Ticket>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        ticket = blockchain.openContract(Ticket.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await ticket.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: ticket.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and ticket are ready to use
    });
});
