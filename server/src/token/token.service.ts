import {Injectable} from '@nestjs/common';
import {CreateTokenDto} from './dto/create-token.dto';
import {FabricWalletService} from "../utils/fabric/fabric-wallet.service";
import {bufferToString, bufferToObject} from '../utils/bufferEncode';
import {TokenUtils} from '../utils/token/token.service'

@Injectable()
export class TokenService {

    constructor(
        private fws: FabricWalletService,
        private tokenUtils: TokenUtils
    ) {
    }

    validTokenId = str => new RegExp('[a-z0-9]{63}\\.(0|15|1)').test(str);

    numberOfDecimalPoints = number => (number.toString().includes('.')) ? (number.toString().split('.').pop().length) : (0);

    async create(createTokenDto: CreateTokenDto, req) {
        try {
            //todo DTO
            // if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('amount') || !req.body.hasOwnProperty('EAC')) {
            //   throw {
            //     status: 404,
            //     message: 'Request must contain username, amount fields and EAC fields!'
            //   };
            // }

            //todo DTO type
            // if ( this.numberOfDecimalPoints(req.body.amount) > 0 ) {
            //   throw {
            //     status: 404,
            //     message: 'Request amount must be integer'
            //   };
            // }

            const totalAmount = createTokenDto.amount * 10 / 10000;
            await this.fws.getGateway().connect(this.fws.getCCP(), {
                wallet: await this.fws.getWallet(),
                identity: createTokenDto.username,
                discovery: {enabled: true, asLocalhost: true}
            });
            const network = await this.fws.getGateway().getNetwork(process.env.CHANNEL_NAME);
            const contract = network.getContract(process.env.CHAINCODE_NAME);
            await contract.submitTransaction("Mint", String(totalAmount),
                JSON.stringify(createTokenDto.EAC));
            return {
                status: 200,
                message: 'Token(s) created successfully'
            }
        } catch (e) {
            return {
                status: e.status || 404,
                message: "Request error: " + e.message,
            }
        }
    }

    findAll() {
        return `This action returns all token`;
    }

    findOne(id: number) {
        return `This action returns a #${id} token`;
    }

    remove(id: number) {
        return `This action removes a #${id} token`;
    }

    async get(req) {
        try {
            await this.fws.getGateway().connect(this.fws.getCCP(), {
                wallet: await this.fws.getWallet(),
                identity: req.query.username,
                discovery: {enabled: true, asLocalhost: true}
            });
            const network = await this.fws.getGateway().getNetwork(process.env.CHANNEL_NAME);
            const contract = network.getContract(process.env.CHAINCODE_NAME);
            const data = await contract.evaluateTransaction("ClientUTXOs")
            return {
                status: 200,
                tokens: bufferToString(data) === "" ? [] : bufferToObject(data)
            }
        } catch (e) {
            return {
                status: 404,
                message: "Request error: " + e.message,
            }
        }

    }

   async transferByKey(body) {
        if (!body.hasOwnProperty('username') || !body.hasOwnProperty('recipient')) {
            throw {
                status: 404,
                message: 'Request must contain username and recipient fields'
            }
        }
        const token = JSON.parse(body.token);
        if (Array.isArray(token) && token.length !== 0 && token.every(tokenId => this.validTokenId(tokenId))) {
            for (let tokenId of token) {
                await this.tokenUtils.transferToken({...body, token: tokenId});
            }
        } else if (typeof token === 'string' && this.validTokenId(token)) {
            await this.tokenUtils.transferToken(body);
        } else {
            throw {
                status: 404,
                message: 'Invalid token format'
            };
        }
    }


    async redeem(req) {
        try {
            if (!req.body.hasOwnProperty('username') || !req.body.hasOwnProperty('token')) {
                throw {
                    status: 404,
                    message: 'Request must contain username field'
                }
            } else {
                await this.transferByKey({...req.body, recipient: process.env.GARBAGE});
            }
            return {
                status: 200,
                message: "Token was successfully redeemed"
            }
        } catch (e) {
            return {
                status: e.status || 404,
                message: "Request error: " + e.message,
            }
        }
    }

}
