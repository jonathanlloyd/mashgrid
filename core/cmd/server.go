package main

import "github.com/jonathanlloyd/mashgrid/core/pkg/mgserver"

func main() {
	mgserver.ListenAndServe(":8000")
}
