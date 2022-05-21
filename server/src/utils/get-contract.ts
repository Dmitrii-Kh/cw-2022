export async function getContractForUser(fws, userId) {
    await fws.getGateway().connect(fws.getCCP(), {
        wallet: await fws.getWallet(),
        identity: userId.toString(),
        discovery: { enabled: true, asLocalhost: true },
    });
    const network = await fws.getGateway().getNetwork(process.env.CHANNEL_NAME);
    return network.getContract(process.env.CHAINCODE_NAME);
}