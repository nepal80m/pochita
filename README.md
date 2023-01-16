
## Install the required binaries and configurations for the blockchain network.

Run the following command from project root directory(pochita/).
```
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh && ./install-fabric.sh d b && rm install-fabric.sh
```

## Install the required packages for rest api server

Run following command from the project root directory.
```
cd restapi/
npm install
cd ..
```

## Start the blockchain network.

Run following command from the project root directory.
```
cd scripts/
./wakeup.sh
cd ..
```

## Run the rest api server.

Run following command from the project root directory.
```
cd restapi/
npm run dev
cd ..
```

Make a get request to [localhost:3000](http://localhost:3000) to check if the api is working..