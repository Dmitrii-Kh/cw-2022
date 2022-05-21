import { Injectable } from '@nestjs/common';
import { AppService } from './app/app.service';
import { CaService } from './ca/ca.service';
import { Gateway, Wallets } from 'fabric-network';
import * as FabricCAServices from 'fabric-ca-client';

@Injectable()
export class FabricWalletService {
    private ccp: any;
    private caClient: any;
    private wallet: undefined;
    private gateway: Gateway;
    private databaseURL = 'http://' + process.env.COUCHDB_USER
        + ':' + process.env.COUCHDB_PASSWD
        + '@' + process.env.COUCHDB_HOST
        + ':' + process.env.COUCHDB_PORT;

    constructor(
        private appService: AppService,
        private caService: CaService,
    ) {
        this.ccp = appService.buildCCPOrg1();
        this.caClient = caService.buildCAClient(FabricCAServices, this.ccp, process.env.CA_HOST_NAME);
        this.wallet = undefined;
        this.gateway = new Gateway();
    }

    async createWallet() {
        this.wallet = await this.appService.buildWallet(Wallets, this.databaseURL);
        try {
            await this.caService.enrollAdmin(this.caClient, this.wallet, process.env.MSP_ORG);
            await this.caService.registerAndEnrollUser(
                this.caClient,
                this.wallet,
                process.env.MSP_ORG,
                process.env.GARBAGE,
                process.env.AFFILIATION);
        } catch {
            return;
        }
    }

    async getWallet() {
        if (this.wallet === undefined) {
            await this.createWallet();
        }
        return this.wallet;
    }

    getGateway() {
        return this.gateway;
    }

    getCCP() {
        return this.ccp;
    }

    getCaClient() {
        return this.caClient;
    }
}
