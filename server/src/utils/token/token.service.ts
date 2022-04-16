import { Injectable } from '@nestjs/common';
import { bufferToObject } from '../bufferEncode';
import { UserUtils } from '../user/user.service';
import { FabricWalletService } from "../fabric/fabric-wallet.service";

@Injectable()
export class TokenUtils {
    constructor(
        private userUtils: UserUtils,
        private fsw: FabricWalletService
    ) {}

    async transferToken({username, recipient, token}) {
        const recipientId = await this.userUtils.getUserClientId(recipient)
        await this.fsw.getGateway().connect(this.fsw.getCCP(), {
            wallet: await this.fsw.getWallet(),
            identity: username,
            discovery: { enabled: true, asLocalhost: true }
        });
        const network = await this.fsw.getGateway().getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.CHAINCODE_NAME);
        const userAllTokens = bufferToObject(await contract.evaluateTransaction("ClientUTXOs"));
        const tokenIndex = userAllTokens.findIndex(token => token.utxo_key === token);
        const userToken = userAllTokens[tokenIndex];
        const userTokenKey = userToken.utxo_key;
        const transferResult = [
            {
                Key: "",
                Owner: recipientId,
                Amount: userToken.amount,
                additional_data: { prev_tokens: [userTokenKey] },
            }
        ];
        await contract.submitTransaction("Transfer", JSON.stringify([userTokenKey]), JSON.stringify(transferResult));
    }

}
