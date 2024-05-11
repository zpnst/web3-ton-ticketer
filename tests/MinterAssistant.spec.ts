import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { MinterAssistant } from '../wrappers/MinterAssistant';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('MinterAssistant', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('MinterAssistant');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let minterAssistant: SandboxContract<MinterAssistant>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        minterAssistant = blockchain.openContract(MinterAssistant.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await minterAssistant.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: minterAssistant.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and minterAssistant are ready to use
    });
});
