import {Injectable} from '@nestjs/common';
import {FabricWalletService} from "../fabric/fabric-wallet.service";
import {bufferToString, bufferToObject} from '../bufferEncode';

@Injectable()
export class UserUtils {
    constructor(
        private fws: FabricWalletService,
    ) {
    }

    async getUserClientId(username) {
        await this.fws.getGateway().connect(this.fws.getCCP(), {
            wallet: await this.fws.getWallet(),
            identity: username,
            discovery: {enabled: true, asLocalhost: true}
        });
        const network = await this.fws.getGateway().getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.CHAINCODE_NAME);
        return bufferToString(await contract.evaluateTransaction("ClientID"));
    }

    async getUserTokensAmount(username) {
        await this.fws.getGateway().connect(this.fws.getCCP(), {
            wallet: await this.fws.getWallet(),
            identity: username,
            discovery: {enabled: true, asLocalhost: true}
        });
        const network = await this.fws.getGateway().getNetwork(process.env.CHANNEL_NAME);
        const contract = network.getContract(process.env.CHAINCODE_NAME);
        const userAllTokens = bufferToObject(await contract.evaluateTransaction("ClientUTXOs"));
        return userAllTokens.map(token => token.amount).reduce((acc, curr) => (acc * 10000 + curr * 10000) / 10000);
    }
}
