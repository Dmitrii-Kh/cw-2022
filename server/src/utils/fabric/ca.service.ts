import { Injectable } from '@nestjs/common';

@Injectable()
export class CaService {
    private ADMIN_USER_ID = 'admin';
    private ADMIN_USER_PASSWORD = 'adminpw';

    buildCAClient = (FabricCAServices, ccp, caHostName) => {
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        console.log(`Built a CA Client named ${caInfo.caName}`);
        return caClient;
    };

    enrollAdmin = async (caClient, wallet, orgMspId) => {
        try {
            // Check to see if we've already enrolled the admin user.
            const identity = await wallet.get(this.ADMIN_USER_ID);
            if (identity) {
                return;
            }

            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = await caClient.enroll({ enrollmentID: this.ADMIN_USER_ID, enrollmentSecret: this.ADMIN_USER_PASSWORD });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: orgMspId,
                type: 'X.509',
            };
            await wallet.put(this.ADMIN_USER_ID, x509Identity);
            console.log('Successfully enrolled admin user and imported it into the wallet');
        } catch (error) {
            console.error(`Failed to enroll admin user : ${error}`);
        }
    };

    registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation) => {
        try {
            // Check to see if we've already enrolled the user
            const userIdentity = await wallet.get(userId);
            if (userIdentity) {
                throw {
                    status: 401,
                    message: `An identity for the user ${userId} already exists in the wallet`
                };
            }

            // Must use an admin to register a new user
            const adminIdentity = await wallet.get(this.ADMIN_USER_ID);
            if (!adminIdentity) {
                throw {
                    status: 401,
                    message: 'An identity for the admin user does not exist in the wallet. Enroll the admin user before retrying'
                };
            }

            // build a user object for authenticating with the CA
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            const adminUser = await provider.getUserContext(adminIdentity, this.ADMIN_USER_ID);

            // Register the user, enroll the user, and import the new identity into the wallet.
            // if affiliation is specified by client, the affiliation value must be configured in CA
            const secret = await caClient.register({
                affiliation: affiliation,
                enrollmentID: userId,
                role: 'client'
            }, adminUser);
            const enrollment = await caClient.enroll({
                enrollmentID: userId,
                enrollmentSecret: secret
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: orgMspId,
                type: 'X.509',
            };
            await wallet.put(userId, x509Identity);
            return `Successfully registered and enrolled user ${userId} and imported it into the wallet`
        } catch (error) {
            throw error;
        }
    };
}
