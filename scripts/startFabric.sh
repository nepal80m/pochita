#!/bin/bash
set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

CC_SRC_LANGUAGE="javascript"
CC_SRC_PATH="../chaincode/"

# clean out any old identites in the wallets
rm -rf javascript/wallet/*
rm -rf java/wallet/*
rm -rf typescript/wallet/*
rm -rf go/wallet/*

# launch network; create channel and join peer to channel
pushd ../testnet
./network.sh down
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn parichaya -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CC_SRC_PATH}
popd

cat <<EOF



Total setup execution time : $(($(date +%s) - starttime)) secs ...
Network setup completed successfully.

EOF
