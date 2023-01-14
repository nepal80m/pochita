#!/bin/bash
set -e

export MSYS_NO_PATHCONV=1
starttime=$(date +%s)

# Copies the msp files required by the api server. 
USER_MSP_SOURCE_PATH="../testnet/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/"
USER_MSP_DESTINATION_PATH="../restapi/"
cp ${USER_MSP_SOURCE_PATH}/cacerts/* ${USER_MSP_DESTINATION_PATH}/cacert.pem
cp ${USER_MSP_SOURCE_PATH}/keystore/*  ${USER_MSP_DESTINATION_PATH}/privatekey.pem
cp ${USER_MSP_SOURCE_PATH}/signcerts/*  ${USER_MSP_DESTINATION_PATH}/signcert.pem


cat <<EOF



Total setup execution time : $(($(date +%s) - starttime)) secs ...

Copied CA Certificate to cacert.pem 
Copied Private Key to privatekey.pem
Copied Signed Certificate to signcert.pem



EOF
