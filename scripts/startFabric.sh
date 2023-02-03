#!/bin/bash
set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

CC_SRC_LANGUAGE="javascript"
NID_CC_SRC_PATH="../chaincode/nationalIdentity/"
CTZ_CC_SRC_PATH="../chaincode/citizenship/"
DVL_CC_SRC_PATH="../chaincode/drivingLicense/"

# clean out any old identites in the wallets
rm -rf javascript/wallet/*
rm -rf java/wallet/*
rm -rf typescript/wallet/*
rm -rf go/wallet/*

# launch network; create channel and join peer to channel
pushd ../testnet
./network.sh down
./network.sh up createChannel -ca -c digital-identity -s couchdb
./network.sh deployCC -c digital-identity -ccn nationalIdentity_chaincode -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${NID_CC_SRC_PATH}
./network.sh deployCC -c digital-identity -ccn citizenship_chaincode -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${CTZ_CC_SRC_PATH}
./network.sh deployCC -c digital-identity -ccn drivingLicense_chaincode -ccv 1 -cci initLedger -ccl ${CC_SRC_LANGUAGE} -ccp ${DVL_CC_SRC_PATH}
popd

cat <<EOF



Total setup execution time : $(($(date +%s) - starttime)) secs ...
Network setup completed successfully.

EOF
