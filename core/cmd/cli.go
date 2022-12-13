package main

import (
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/sha256"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"math/big"
	"math/rand"
	"time"
)

type Group struct {
	Salt  string `json:"salt"`
	Admin string `json:"admin_id"`
	Name  string `json:"name"`
}

type Block struct {
	Data []byte
	ID   string
}

func main() {
	var seed int64 = time.Now().UnixNano()
	source := rand.NewSource(seed)
	randReader := rand.New(source)

	privKey, err := ecdsa.GenerateKey(elliptic.P256(), randReader)
	if err != nil {
		panic(err)
	}

	x509EncodedPrivKey, err := x509.MarshalECPrivateKey(privKey)
	if err != nil {
		panic(err)
	}

	x509EncodedPubKey, err := x509.MarshalPKIXPublicKey(&privKey.PublicKey)
	if err != nil {
		panic(err)
	}

	shaHashedPubKey := sha256.Sum256(x509EncodedPubKey)
	var idInt big.Int
	idInt.SetBytes(shaHashedPubKey[:])
	id := idInt.Text(62)
	fmt.Printf("ID: mgp://users/%s\n", string(id))
	fmt.Printf("Public key: %x\n", x509EncodedPubKey)
	fmt.Printf("Private key: %x\n", x509EncodedPrivKey)

	group := Group{
		Salt:  "AA",
		Admin: id,
		Name:  "My first group",
	}
	groupData, err := json.Marshal(group)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(groupData))

	groupSig, err := privKey.Sign(randReader, groupData, nil)
	if err != nil {
		panic(err)
	}

	block := Block{
		Data: groupData,
		ID:   fmt.Sprintf("%x", groupSig),
	}

	fmt.Printf("%+v\n", block)
}
