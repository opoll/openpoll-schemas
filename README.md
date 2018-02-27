# JSON Formats

**Purpose:** This document will hold the JSON that will be passed around by different elements of the OpenPoll system. It is for reference so that every programmer can know what any HTTP route will yield and this record should be updated frequently.

**GET:** For get requests the JSON you see is what the server returns for the request

**POST:** For post requests the JSON you see is what the server receives for the request, you can decide how to respond to the request if at all

---

# **REST API (facilitator)**

# **Registration/Sign-In**

## **Creating a respondent**

    POST /v1/respondents
    {
    	"phoneNumber": "+1-443-932-0192",
    	"pin": "1234"
    }
    
    HTTP 201 CREATED
    {
    	"phoneNumber": "+31620121805",
      "respondentId": "ee21b364-9817-48d3-93e3-cde494354a40",
      "confirmed": false,
      "createdAt": "2018-02-23T19:08:13.448Z"
    }

- `phoneNumber` accepts a lot of valid phone number formats. defaults to +1 (USA) if no country code specified. Is stored in the database as [E.164](https://en.wikipedia.org/wiki/E.164).
- `pin` is stored as a string, as a number would prevent prepending it with a 0 (and everyone else needs to do string padding where necessary)
- `respondentId` is the ID that we should use for actually identifying people. It's a UUIDv4

**Possible errors**

- [ValidationError](https://www.notion.so/openpoll/Shared-acccb1062ba042db853141e5b430b1ed#15a1be2a950444b0bb86f17c0fc2531e)
- [PhoneNumberInUseError](https://www.notion.so/openpoll/Respondents-cd1b1d446deb40bf9c0d9fa86a059051#ed8be887827741d69bc98a1f4e11df4f)
- [InvalidPhoneNumberError](https://www.notion.so/openpoll/Shared-acccb1062ba042db853141e5b430b1ed#6979d72d92cf4735be5845e7541bab6b)

## Confirming a respondent

    POST /v1/respondents/confirm
    {
    	"phoneNumber": "+1-443-932-0192",
    	"token": "1234"
    }
    
    HTTP 200 OK
    {
    	"publicKey": "034f355b......f0b7758aa",
    	"privateKey": "0269314d......a5647d6af"
    }

---

## Creating a client

    POST /v1/clients
    {
    	"email": "rrutten@openpoll.io",
    	"password": "1234"
    }
    
    HTTP 201 CREATED
    {
    	"email": "rrutten@openpoll.io",
      "clientId": "ee21b364-9817-48d3-93e3-cde494354a40",
      "confirmed": false,
      "createdAt": "2018-02-23T19:08:13.448Z"
    }

- `email` should be a valid email such as `info@example.com`
- `password` has to be a minimum of 6 characters. Other than that, there are no password rules. Passwords with weird characters and rules are hard to remember for people, but no different to a computer.
- `clientId` is the ID that we should use for actually identifying people. It's a UUIDv4

**POST** /auth/respondents

`{`

`phoneNumber: 4439320192,`

`pin: 8239`

`}`

**POST** /auth/clients

`{`

`email: john@example.com,`

`password: amazingpasswordnoonecanbreak`

`}`

# **Verification**

**GET** /nodes/{address}/verify

`{`

`credentials: bronze`

`}`

# Poll Creation

**POST** /polls

`{`

`title: "2018 Midterm Questions",`

`numQuestions: 10,`

`fields: {`

`[`

`{`

`question: "Who is your favorite OpenPoll dev?",`

`choices: [`

`"Michael",`

`"Ben",`

`"Zach"`

`]`

`},`

`]`

`},`

`funding: 100,`

`minNumBronzeRequested: 10,`

`minNumSilverRequested: 10,`

`minNumGoldRequest: 0`

`}`

# **Pulling Poll Stats For Clients**

**GET /**polls/{pollId}/statistics

`{`

`title: "If Trump and Hillary both run in 2020, who will you vote for?",`

`numRespondents: 531,`

`responses:` 

`[`

`{`

`answer: "Trump",`

`timestamp: 1582069983,`

`credentialLevel: "Bronze",`

`},`

`{`

`answer: "Hillary",`

`timestamp: 1582069993,`

`credentialLevel: "Gold"`

`}`

`]`

`}`

# **Serve Poll List to Respondent**

**GET /**polls

`{`

`pollsAvailable: 3`

`polls: [`

`{`

`title: "2018 Midterm Questions",`

`numQuestions: 9,`

`estimatedReward: $0.45`

`},`

`{`

`title: "Pick The Logos You Prefer",`

`numQuestions: 5,`

`estimatedReward: $0.25`

`},`

`{`

`title: "What's your favorite restaurant?",`

`numQuestions: 3,`

`estimatedReward: $0.45`

`}`

`]`

`}`

**GET /**polls/{pollId}

`{`

`pollId: 48p159733non71262nn4s070q8974ns,`

`title: "2018 Midterm Elections Questions",`

`estimatedReward: $0.45,`

`QandA: {`

`[`

`{`

`question: "Who is your favorite OpenPoll dev?",`

`choices: [`

`"Michael",`

`"Ben",`

`"Zach"`

`]`

`}`

`]`

`}`

`}`

# Relaying Mobile Responses & Informing Miners of Available Polls

**GET** /network/shards/available

`{`

`[`

`{`

`pollId: C67A544FF3EC2FEAFB9B22899735B49CFB8E73C93E8DB77D4E53E22577C542C5,`

`networkReward: $320,`

`approxMinersActive: 8`

`},`

`{`

`pollId: F0E4C2F76C58916EC258F246851BEA091D14D4247A2FC3E18694461B1816E13B,`

`networkReward: $80,`

`approxMinersActive: 2`

`}`

`]`

`}`

**GET** /network/{pollId}/serve

`{`

`inProgress: false,`

`genesisBlock: {`

`height: 0,`

`pollId: c258f246851bea091d14d4247a,`

`timestamp: 1519023494, (epoch time genesis is distributed)`

`nonce: 0,`

`prevHash: 00000000000000,`

`hash: c2d90b159012c0053ee79fb46f6b13132027c26b4e3fc3f71a1e03d1e1cf7b2f,`

`responses: [`

`*stays empty*`

`]`

`}`

`}`

or

`{`

`inProgress: true (so node knows to ask around to initialize itself)`

`}`

**POST** /network/{pollId}/relay

`{`

`responseId: F4BF9F7FCBEDABA0392F108C59D8F4A38B3838EFB64877380171B54475C2ADE8, (SHA256 hash of all header data + data in poll response)`

`pollId: 48p159733non71262nn4s070q8974ns,`

`address: 034f355b......7040871aa,`

`timestamp: 1582069993,`

`signature: 5bfe1c3cdf7e5f70a48bdecfa67e74eae36ebfbf36e8f78575e8ba63a0d8a5c4,`

`responseData: {` 

`[`

`{`

`question: "Who is your favorite OpenPoll dev?",`

`choice: "Michael"`

`},`

`{`

`question: "Who was the first president of the United States",`

`choice: "Zachary Wynegar"`

`}`

`]`

`}`

`}`

---

# Mining Application (miner)

**Wallet**

    { // Wallet
        id: 6470352415......432bfa3c, // random id (64 bytes)
        passwordHash: 5ba9151d1c...1424be8e2c, // sha256: password
        secret: 6acb83e364...c1a04b6ee6, // pbkdf2 secret taken from password hash: sha512 (salt + passwordHash + random factor)
        addresses: [
            {
                privateKey: 6acb83e364...ee6bcdbc73,
                pubKey: dda3ce5aa5...b409bf3fdc,
    						address: mwom7Rk9KDtdgzL1j93cnxVTrbnMKAuehi
            },
            {
                privateKey: 072ab010ed...246ed16d26,
                publicKey: 4f8293356d...b53e8c5b25,
    						address: mmw1vqsxKfcCaDdQPR7jN9TkxacKfzWJdm
            }     
        ]
    }

**Note:** See [Miscellaneous](https://www.notion.so/9ffea083-a483-4a56-9737-6941dd62b92e) for address generation steps.

**Poll Response**

`{`

`responseId: F4BF9F7FCBE...71B54475C2ADE8, (SHA256 hash of all header data + data in poll response)`

`pollId: 48p159733non71262nn4s070q8974ns,`

`address: 034f355af728...bb704075871aa, (respondent address)`

`timestamp: 1582069993,`

`signature: 5bff78578b...a63a0d8a5c4,`

`responseData:  [`

`{`

`question: "Who is your favorite OpenPoll dev?",`

`choice: "Michael"`

`},`

`{`

`question: "Who was the first president of the United States",`

`choice: "Zachary Wynegar"`

`}`

`]`

`}`

**Shard Mempool**

`{`

`[`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

**Shard Block (In A Shard Blockchain)**

**Note:** Genesis block will contain the poll metadata so nodes know when to terminate a poll shard

`{`

`height: 0,`

`pollId: c258f246851bea091d14d4247a,`

`timestamp: 1519023494,`

`rewardAddress: c258f2a4...6851bea091`

`nonce: 0,`

`prevHash: 00000000000000,`

`hash: c23fc3f73...d1e1cf7b2f,`

`responses: [`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

## **Mainchain Mempool**

**Shardpool**

`{`

`[`

`{ ...shardBlockchain... },`

`{ ...shardBlockchain... },`

`{ ...shardBlockchain... },`

`{ ...shardBlockchain... }`

`]`

`}`

**Txn Pool**

`{`

`[`

`{ ...transaction... },`

`{ ...transaction... },`

`{ ...transaction... },`

`{ ...transaction... }`

`]`

`}`

**Mainchain Block (In Main Blockchain)**

`{`

`height: 0,`

`timestamp: 1519023494,`

`nonce: 0,`

`prevHash: 00000000000000,`

`hash: c2d90b1590...1e1cf7b2f,`

`shardData: [`

`{` 

`shardhash: 1jih12f...hf28qg92,`

`paymentTxns: [`

`{ ...txn... },`

`{ ...txn... },`

`{ ...txn... }`

`]`

`}`

`],`

`txns: [`

`{ ...txn... },`

`{ ...txn... },`

`{ ...txn... }`

`]`

`}`

**Note:** The Mainchain miners will clear their mempool, validate the blockchains, THEN consolidate them into hashes to lock into the shardData array. They will also credit the proper identities (respondents and miners) and lock those in the `paymentTxns` array so that wallets can know who has made what by looking at UTXOs. Escrow funds are released based on [Poll Funding Distribution](https://www.notion.so/49640758-32a7-4835-8f5b-265ad6f465c6). `txns` are separate from the `shardData`.

**Transaction**

# Node **HTTP Endpoints**

**GET** /node/peers

`{`

`[`

`{`

`ip: 223.214.161.44,`

`workingOn: [`

`*pollId*,`

`*pollId*,`

`*pollId*,`

`main (main meaning the main chain & not a shard)`

`]`

`},`

`{`

`ip: 78.27.111.43,`

`workingOn: [`

`*pollId*,`

`*pollId*`

`]`

`},`

`{`

`ip: 220.187.13.113,`

`workingOn: [`

`*pollId*`

`]`

`}`

`]`

**GET** /node/{pollId}/{responseId}/confirmations

`{`

`[`

`{`

`ip: 127.0.0.1,`

`confirmations: 3` 

`},`

`{`

`ip: 129.2.180.100,`

`confirmations: 6`

`}`

`]`

`}`

**GET** /blockchain/{pollId}/latest

`{`

`height: 431,`

`pollId: d14ddd36851kero09fk58d49f09,`

`timestamp: 1519023499,`

`nonce: 0,`

`prevHash: EE41D870E5E69CD8C4B1B84C9C0DCFC0C1E7F33D5C320AE166B38D1E4D653A6B,`

`hash:` 

`255D0D0FFD0A5D23FD2A0FD7D32204D998DBF0825141D2E62DD12D365CAD99D1,`

`responses: [`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

**GET** /blockchain/{pollId}

`{`

`[`

`{ ...genesisblock... },`

`{ ...block... },`

`{ ...block... },`

`{ ...block... },`

`{ ...block... }`

`]`

`}`

**GET** /blockchain/{pollId}/mempool

`{`

`[`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

**GET** /blockchain/{pollId}/{responseId}

`{`

`responseId: 1E8C70AFF0014B6E531D21A4BAD17D77894AAA0788FE496ABDA5C46E95778D02` 

`}`

**GET** /blockchain/{pollId}/{blockHash}

`{`

`blockHash: ED737E3471F893C69CEFBE848F7069205A1671E96D1D8EAF0E75E660D934F177`

`}`

**GET** /blockchain/{pollId}/{blockIndex}

`{`

`height: 432,`

`pollId: d14ddd36851kero09fk58d49f09,`

`timestamp: 1519023499, (epoch time genesis is distributed)`

`nonce: 0,`

`prevHash: DF199BFAB4C81A4031799A02AD358943CCD68438BD915AC1C12C87D711E634D9,`

`hash:` 

`92BDD20EB671B526C6A68FE595F992BB272514131766E4FAC32C6F0639077275,`

`responses: [`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

**GET** /respondents/{address}/credentials

`{`

`address: i0asu10...hasdghi91,`

`credentials: platinum,`

`dateExpire: 1519081918`

`}`

**POST** /node/peers

`{`

`[`

`{`

`ip: 223.214.161.44,`

`workingOn: [`

`*pollId*,`

`*pollId*,`

`*pollId*,`

`main (main meaning the main chain & not a shard)`

`]`

`},`

`{`

`ip: 127.0.0.1,`

`workingOn: [`

`*pollId*,`

`*pollId*`

`]`

`}`

`]`

`}`

**POST** /blockchain/{pollId}/mempool

`{`

`[`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

**PUT** /blockchain/{pollId}/latest

`{`

`height: 3,`

`pollId: c258f246851bea091d14d4247a,`

`timestamp: 1519023494, (epoch time genesis is distributed)`

`nonce: 0,`

`prevHash: 2DEC33371...0E20D8B64,`

`hash:` 

`681FF0FF8...4CDD9FF1,`

`responses: [`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

or

`{`

`height: 432,`

`pollId: d14ddd36851kero09fk58d49f09,`

`timestamp: 1519023499, (epoch time genesis is distributed)`

`nonce: 0,`

`prevHash: DF199BFAB4...711E634D9,`

`hash:` 

`92BDD20EB...639077275,`

`responses: [`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... },`

`{ ...pollResponse... }`

`]`

`}`

---
