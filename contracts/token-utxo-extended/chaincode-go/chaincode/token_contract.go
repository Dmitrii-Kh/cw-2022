package chaincode

import (
	"fmt"
	"log"
    "encoding/json"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for transferring tokens using UTXO transactions
type SmartContract struct {
	contractapi.Contract
}

type EAC struct {
    ProductionStartDate  string  `json:"prod_start_date"`
    ProductionEndDate  string  `json:"prod_end_date"`
    GeneratedEnergy float64 `json:"generated_energy"`
    StationID string `json:"station_uid"`
    StationLocation string `json:"station_location"`
    StationEnergyType string `json:"station_energy_type"`
    ManufacturerCountryId float64 `json:"manufacturer_country_id"`
    ManufactureDate string `json:"manufacture_date"`
    CommissioningDate string `json:"commissioning_date"`
    PlantPerformance float64 `json:"plant_performance"`
}

// UTXO represents an unspent transaction output
type UTXO struct {
	Key                   string               `json:"utxo_key"`
	Owner                 string               `json:"owner"`
	Amount                float64              `json:"amount"`
	EAC                   *EAC                 `json:"EAC" metadata:"EAC"`
}

// Mint creates a new unspent transaction output (UTXO) owned by the minter
func (s *SmartContract) Mint(ctx contractapi.TransactionContextInterface, amount float64, eac EAC) (*UTXO, error) {

	// Check minter authorization - this sample assumes Org1 is the central banker with privilege to mint new tokens
	clientMSPID, err := ctx.GetClientIdentity().GetMSPID()
	if err != nil {
		return nil, fmt.Errorf("failed to get MSPID: %v", err)
	}
	if clientMSPID != "Org1MSP" {
		return nil, fmt.Errorf("client is not authorized to mint new tokens")
	}

	// Get ID of submitting client identity
	minter, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client id: %v", err)
	}

	if amount <= 0 {
		return nil, fmt.Errorf("mint amount must be a positive integer")
	}

	utxo := UTXO{}
	utxo.Key = ctx.GetStub().GetTxID() + ".0"
	utxo.Owner = minter
	utxo.Amount = amount * 10000 / 10000
	utxo.EAC = &eac

	// the utxo has a composite key of owner:utxoKey, this enables ClientUTXOs() function to query for an owner's utxos.
	utxoCompositeKey, err := ctx.GetStub().CreateCompositeKey("utxo", []string{minter, utxo.Key})

	tokenJSON, err := json.Marshal(utxo)
    if err != nil {
        return nil, err
    }

	err = ctx.GetStub().PutState(utxoCompositeKey, tokenJSON)
	if err != nil {
		return nil, err
	}

	log.Printf("utxo minted: %+v", utxo)

	return &utxo, nil
}

// Transfer transfers UTXOs containing tokens from client to recipient(s)
func (s *SmartContract) Transfer(ctx contractapi.TransactionContextInterface, utxoInputKeys []string, utxoOutputs []UTXO) ([]UTXO, error) {

	// Get ID of submitting client identity
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client id: %v", err)
	}

	// Validate and summarize utxo inputs
	utxoInputs := make(map[string]*UTXO)
	var totalInputAmount float64
	for _, utxoInputKey := range utxoInputKeys {
		if utxoInputs[utxoInputKey] != nil {
			return nil, fmt.Errorf("the same utxo input can not be spend twice")
		}

		utxoInputCompositeKey, err := ctx.GetStub().CreateCompositeKey("utxo", []string{clientID, utxoInputKey})
		if err != nil {
			return nil, fmt.Errorf("failed to create composite key: %v", err)
		}

		// validate that client has a utxo matching the input key
		valueBytes, err := ctx.GetStub().GetState(utxoInputCompositeKey)
		if err != nil {
			return nil, fmt.Errorf("failed to read utxoInputCompositeKey %s from world state: %v", utxoInputCompositeKey, err)
		}

		if valueBytes == nil {
			return nil, fmt.Errorf("utxoInput %s not found for client %s", utxoInputKey, clientID)
		}

        var token UTXO
        err = json.Unmarshal(valueBytes, &token)
        if err != nil {
            return nil, err
        }

        amount := token.Amount * 10000 / 10000

		utxoInput := &UTXO{
			Key:    utxoInputKey,
			Owner:  clientID,
			Amount: amount,
            EAC: token.EAC,
		}

		totalInputAmount += amount
		utxoInputs[utxoInputKey] = utxoInput
	}

	// Validate and summarize utxo outputs
	var totalOutputAmount float64
	txID := ctx.GetStub().GetTxID()
	for i, utxoOutput := range utxoOutputs {

		if utxoOutput.Amount < 0 {
			return nil, fmt.Errorf("utxo output amount must be a positive value")
		}

		utxoOutputs[i].Key = fmt.Sprintf("%s.%d", txID, i)

		totalOutputAmount += utxoOutput.Amount * 10000
	}
	totalOutputAmount /= 10000
	// Validate total inputs equals total outputs
	if totalInputAmount != totalOutputAmount {
		return nil, fmt.Errorf("total utxoInput amount %d does not equal total utxoOutput amount %d", totalInputAmount, totalOutputAmount)
	}

	// Since the transaction is valid, now delete utxo inputs from owner's state
	for _, utxoInput := range utxoInputs {

		utxoInputCompositeKey, err := ctx.GetStub().CreateCompositeKey("utxo", []string{utxoInput.Owner, utxoInput.Key})
		if err != nil {
			return nil, fmt.Errorf("failed to create composite key: %v", err)
		}

		err = ctx.GetStub().DelState(utxoInputCompositeKey)
		if err != nil {
			return nil, err
		}
		log.Printf("utxoInput deleted: %+v", utxoInput)
	}

	// Create utxo outputs using a composite key based on the owner and utxo key
	for _, utxoOutput := range utxoOutputs {
		utxoOutputCompositeKey, err := ctx.GetStub().CreateCompositeKey("utxo", []string{utxoOutput.Owner, utxoOutput.Key})
		if err != nil {
			return nil, fmt.Errorf("failed to create composite key: %v", err)
		}

        tokenJSON, err := json.Marshal(utxoOutput)
        if err != nil {
            return nil, err
        }

		err = ctx.GetStub().PutState(utxoOutputCompositeKey, tokenJSON)	
		if err != nil {
			return nil, err
		}
		log.Printf("utxoOutput created: %+v", utxoOutput)
	}

	return utxoOutputs, nil
}

// ClientUTXOs returns all UTXOs owned by the calling client
func (s *SmartContract) ClientUTXOs(ctx contractapi.TransactionContextInterface) ([]*UTXO, error) {

	// Get ID of submitting client identity
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get client id: %v", err)
	}

	// since utxos have a composite key of owner:utxoKey, we can query for all utxos matching owner:*
	utxoResultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey("utxo", []string{clientID})
	if err != nil {
		return nil, err
	}
	defer utxoResultsIterator.Close()

	var utxos []*UTXO
	for utxoResultsIterator.HasNext() {
		utxoRecord, err := utxoResultsIterator.Next()
		if err != nil {
			return nil, err
		}

		// composite key is expected to be owner:utxoKey
		_, compositeKeyParts, err := ctx.GetStub().SplitCompositeKey(utxoRecord.Key)
		if err != nil {
			return nil, err
		}

		if len(compositeKeyParts) != 2 {
			return nil, fmt.Errorf("expected composite key with two parts (owner:utxoKey)")
		}

		utxoKey := compositeKeyParts[1] // owner is at [0], utxoKey is at[1]

		if utxoRecord.Value == nil {
			return nil, fmt.Errorf("utxo %s has no value", utxoKey)
		}

        var token UTXO
        err = json.Unmarshal(utxoRecord.Value, &token)
        if err != nil {
			return nil, err
		}

		utxo := &UTXO{
			Key:    utxoKey,
			Owner:  clientID,
			Amount: token.Amount,
			EAC: token.EAC,
		}

		utxos = append(utxos, utxo)
	}
	return utxos, nil
}

// ClientID returns the client id of the calling client
// Users can use this function to get their own client id, which they can then give to others as the payment address
func (s *SmartContract) ClientID(ctx contractapi.TransactionContextInterface) (string, error) {

	// Get ID of submitting client identity
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", fmt.Errorf("failed to get client id: %v", err)
	}

	return clientID, nil
}
