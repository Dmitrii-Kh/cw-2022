import {Injectable} from '@nestjs/common';
import {FabricWalletService} from "../fabric/fabric-wallet.service";
import {bufferToString, bufferToObject} from '../bufferEncode';
import { getContractForUser } from '../get-contract';

@Injectable()
export class UserUtils {
    constructor(
        private fws: FabricWalletService,
    ) {
    }

    async getUserClientId(username) {
        const contract = await getContractForUser(this.fws, username);
        return bufferToString(await contract.evaluateTransaction("ClientID"));
    }

    async getUserTokensAmount(username) {
        const contract = await getContractForUser(this.fws, username);
        const userAllTokens = bufferToObject(await contract.evaluateTransaction("ClientUTXOs"));
        return userAllTokens.map(token => token.amount).reduce((acc, curr) => (acc * 10000 + curr * 10000) / 10000);
    }
}
