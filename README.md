# cw-2022
Platform for accounting, selling and redeeming EACs (Energy Attribute Certificates) implemented with the extended UTXO model. HLF/Fiware Orion Context Broker adapter.

## Getting started

### Reguirements:

* node & npm
* docker-compose
* Go


`git clone https://github.com/Dmitrii-Kh/cw-2022.git`

Install binary files:

```
cd cw-2022

wget https://github.com/hyperledger/fabric/releases/download/v2.2.5/hyperledger-fabric-linux-amd64-2.2.5.tar.gz

tar xf hyperledger-fabric-linux-amd64-2.2.5.tar.gz 

wget https://github.com/hyperledger/fabric-ca/releases/download/v1.5.2/hyperledger-fabric-ca-linux-amd64-1.5.2.tar.gz

tar xf hyperledger-fabric-ca-linux-amd64-1.5.2.tar.gz

```

## Run network

After installing binaries, you need to deploy the fabric network:

```bash
cd test-network

./network.sh up createChannel -ca -c channel1 -s couchdb -verbose

./network.sh deployCC -c channel1 -ccn token_utxo_extended -ccp ../contracts/token-utxo-extended/chaincode-go/ -ccl go
```

## Run server

After successfully deploying the network, you can start the server in javascript-server:

```
cd ../server
```

Copy `.env.expample` file to `.env `and replace the appropriate fields

```
cp .env.example .env 
```

Install node pakages:

``` bash
npm i 
```

Then run server with comand:

```
npm start
```

## Stop cw-2022

To stop the project you need to stop the server in `server` folder and run next commands:

```
cd test-network

./network.sh down
```
