import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { FabricWalletService } from '../utils/fabric/fabric-wallet.service';
import { bufferToString, bufferToObject } from '../utils/bufferEncode';
import { TokenUtils } from '../utils/token/token.service';
import { StationService } from '../station/station.service';
import { MeasurementsService } from '../measurements/measurements.service';
import { getContractForUser } from '../utils/get-contract';

@Injectable()
export class TokenService {

    constructor(
        private fws: FabricWalletService,
        private tokenUtils: TokenUtils,
        private stationService: StationService,
        private measurementsService: MeasurementsService,
    ) {
    }

    validTokenId = str => new RegExp('[a-z0-9]{63}\\.(0|15|1)').test(str);

    numberOfDecimalPoints = number => (number.toString().includes('.')) ? (number.toString().split('.').pop().length) : (0);

    async create(createTokenDto: CreateTokenDto, userId) {
        try {
            const { stationId } = createTokenDto;
            const [organisation, name] = stationId.split('.');
            const station = await this.stationService.getStationById(+organisation, name, userId);
            const {
                countryId,
                regionId,
                stationEnergyType,
                manufacturerCountryId,
                manufactureDate,
                commissioningDate,
                plantPerformance,
            } = station;
            const measurementsArray = (await station.measurements).filter(
                m => m.minted === false && m.generatedEnergy > 0
            );
            if (measurementsArray.length === 0) {
                throw {
                    status: 404,
                    message: 'No measurements yet',
                };
            }
            const generatedEnergy = measurementsArray
                .reduce((acc, curr) => acc + curr.generatedEnergy, 0);
            if (this.numberOfDecimalPoints(generatedEnergy) > 0) {
                throw {
                    status: 404,
                    message: 'generatedEnergy must be an integer',
                };
            }
            const EAC = {
                prod_start_date: measurementsArray[0].startDate,
                prod_end_date: measurementsArray[measurementsArray.length - 1].endDate,
                generated_energy: generatedEnergy,
                station_uid: stationId,
                station_location: countryId + '.' + regionId,
                station_energy_type: stationEnergyType,
                manufacturer_country_id: manufacturerCountryId,
                manufacture_date: manufactureDate,
                commissioning_date: commissioningDate,
                plant_performance: plantPerformance,
            };

            const totalAmount = generatedEnergy * 10 / 10000;
            const contract = await getContractForUser(this.fws, userId);
            await contract.submitTransaction('Mint', String(totalAmount),
                JSON.stringify(EAC));
            for (const m of measurementsArray) {
                // @ts-ignore
                await this.measurementsService.update(m.id, { ...m, minted: true });
            }
            return {
                status: 200,
                message: 'Token(s) created successfully',
            };
        } catch (e) {
            return {
                status: e.status || 404,
                message: 'Request error: ' + e.message,
            };
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

    async getClientUTXOs(userId) {
        try {
            const contract = await getContractForUser(this.fws, userId);
            const data = await contract.evaluateTransaction('ClientUTXOs');
            return bufferToString(data) === '' ? [] : bufferToObject(data);
        } catch (e) {
            return {
                status: 404,
                message: 'Request error: ' + e.message,
            };
        }

    }

    async transferByKey(body) {
        if (!body.hasOwnProperty('userId') || !body.hasOwnProperty('recipientId')) {
            throw {
                status: 404,
                message: 'Request must contain userId and recipientId fields',
            };
        }
        const token = body.token;
        if (Array.isArray(token) && token.length !== 0 && token.every(tokenId => this.validTokenId(tokenId))) {
            for (let tokenId of token) {
                await this.tokenUtils.transferToken({ ...body, tokenId });
            }
        } else if (typeof token === 'string' && this.validTokenId(token)) {
            await this.tokenUtils.transferToken({ ...body, tokenId: token });
        } else {
            throw {
                status: 404,
                message: 'Invalid token format',
            };
        }
    }


    public async transferByKeyAndAmount(body): Promise<any[]> {
        if (!body.hasOwnProperty('userId') || !body.hasOwnProperty('recipientId')
            || !body.hasOwnProperty('amount')) {
            throw {
                status: 404,
                message: 'Request must contain userId, recipientId and amount fields',
            };
        }
        const { token, amount } = body;
        if (typeof token === 'string' && this.validTokenId(token)) {
            return await this.tokenUtils.transferToken({ ...body, tokenId: token, transferAmount: amount });
        } else {
            throw {
                status: 404,
                message: 'Invalid token format',
            };
        }
    }

    async redeem(req) {
        try {
            if (!req.body.hasOwnProperty('userId') || !req.body.hasOwnProperty('token')) {
                throw {
                    status: 404,
                    message: 'Request must contain userId field',
                };
            } else {
                await this.transferByKey({ ...req.body, recipientId: process.env.GARBAGE });
            }
            return {
                status: 200,
                message: 'Token was successfully redeemed',
            };
        } catch (e) {
            return {
                status: e.status || 404,
                message: 'Request error: ' + e.message,
            };
        }
    }

}
