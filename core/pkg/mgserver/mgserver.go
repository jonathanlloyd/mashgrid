package mgserver

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type JsonRPCRequest struct {
	JsonRPCVersion string      `json:"jsonrpc"`
	Method         string      `json:"method"`
	Params         interface{} `json:"params"`
	ID             string      `json:"id"`
}

func ListenAndServe(addr string) error {
	return http.ListenAndServe(addr, http.HandlerFunc(handler))
}

func handler(w http.ResponseWriter, r *http.Request) {
	bodyBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("not ok"))
		return
	}

	var rpcReq JsonRPCRequest
	err = json.Unmarshal(bodyBytes, &rpcReq)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("not ok"))
		return
	}

	fmt.Printf("%+v\n", rpcReq)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
