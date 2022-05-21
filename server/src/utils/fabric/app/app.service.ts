import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path'

@Injectable()
export class AppService {

    buildCCPOrg1() {
        // load the common connection configuration file
        const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', '..',
            'test-network', 'organizations',
            'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const fileExists = fs.existsSync(ccpPath);
        if (!fileExists) {
            throw new Error(`no such file or directory: ${ccpPath}`);
        }
        const contents = fs.readFileSync(ccpPath, 'utf8');

        // build a JSON object from the file contents
        const ccp = JSON.parse(contents);

        console.log(`Loaded the network configuration located at ${ccpPath}`);
        return ccp;
    };

    buildCCPOrg2() {
        // load the common connection configuration file
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network',
            'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
        const fileExists = fs.existsSync(ccpPath);
        if (!fileExists) {
            throw new Error(`no such file or directory: ${ccpPath}`);
        }
        const contents = fs.readFileSync(ccpPath, 'utf8');

        // build a JSON object from the file contents
        const ccp = JSON.parse(contents);

        console.log(`Loaded the network configuration located at ${ccpPath}`);
        return ccp;
    };

    async buildWallet(Wallets, walletPath = 'http://admin:adminpw@127.0.0.1:5984') {
        // Create a new  wallet : Note that wallet is for managing identities.
        let wallet;
        if (walletPath) {
            wallet = await Wallets.newCouchDBWallet({
                url: walletPath
            });
        } else {
            wallet = await Wallets.newInMemoryWallet();
            console.log('Built an in memory wallet');
        }

        return wallet;
    };

    prettyJSONString(inputString) {
        if (inputString) {
            return JSON.stringify(JSON.parse(inputString), null, 2);
        }
        else {
            return inputString;
        }
    }
}
