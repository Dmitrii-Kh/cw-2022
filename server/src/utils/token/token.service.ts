import { Injectable } from '@nestjs/common';
import { bufferToObject, bufferToString } from '../bufferEncode';
import { UserUtils } from '../user/user.service';
import { FabricWalletService } from '../fabric/fabric-wallet.service';
import { triggerAsyncId } from 'async_hooks';
import { getContractForUser } from '../get-contract';

@Injectable()
export class TokenUtils {
    constructor(
        private userUtils: UserUtils,
        private fws: FabricWalletService,
    ) {
    }

    async transferToken({ userId, recipientId, tokenId, transferAmount = 0 }): Promise<any[]> {
        const recipientKey = await this.userUtils.getUserClientId(recipientId.toString());
        const contract = await getContractForUser(this.fws, userId);
        const userAllTokens = bufferToObject(await contract.evaluateTransaction('ClientUTXOs'));
        const tokenIndex = userAllTokens.findIndex(token => token.utxo_key === tokenId);
        const { utxo_key: userTokenKey, owner, amount: tokenAmount, EAC } = userAllTokens[tokenIndex];
        let transferResult = [];
        const amountLeft = tokenAmount - transferAmount;
        if (amountLeft !== 0 && transferAmount !== 0) {
            if (amountLeft < 0) {
                throw {
                    status: 400,
                    message: 'Transfer amount exceeds token amount',
                };
            } else {
                transferResult = [
                    {
                        Key: '',
                        Owner: recipientKey,
                        Amount: +transferAmount,
                        EAC: EAC,
                    },
                    {
                        Key: '',
                        Owner: owner,
                        Amount: (tokenAmount * 1000 - transferAmount * 1000) / 1000,
                        EAC: EAC,
                    },
                ];
            }
        } else {
            transferResult.push({
                Key: '',
                Owner: recipientKey,
                Amount: tokenAmount,
                EAC: EAC,
            });
        }
        const data = await contract.submitTransaction(
            'Transfer',
            JSON.stringify([userTokenKey]),
            JSON.stringify(transferResult));
        return bufferToString(data) === '' ? [] : bufferToObject(data);
    }

}
