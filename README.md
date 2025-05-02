# stable-sl

Making easy to buy and sell stable crypto for people from Sierra Leone

Prototype running in production mode on <https://stable-sl.pdJ.app> and in development mode on <https://stable-sl.pdJ.app:9001>

## Problem

In Sierra Leone few people manages a crypto wallet or an exchange and at the
moment of this writing neither FonBnk nor MiniPay support Sierra Leone. 
There are interesting saving and investment options in the web3, but this requires 
tools and education. We want to create tools and promote education about 
this in Sierra Leone.

## Solution
* Building a webapp or app that will make easy to buy/sell stable crypto to the
    people of Sierra Leone.
* Educate the people in the usage of stable cryptocoins and saving and 
    investment opportunities.
* In march 2025 we proposed to FonBnk to be their partners in Sierra Leone, but later
  they told us that they already had a team.  Anyway after some time they still
  don't support the currency,  neither payment methods of Sierra Leone not even in thier sandbox.
* So at least while FonBnk or another group offers an on-ramp/off-ramp solution
  we have started building one, operating with a local team based on the Mission Hope
  School located in Kabala (the school is lead by the pastor Zechariah Conteh who is
  in the team).
  
## Location of Impact

Sierra Leone

## Contents of this monorepo and architecture

This monorepo includes 3 applications:
1. An application for the Android phone that will be gateway for SMS and USSD, to send and receive payments with Orange Money automatically
2. A backend with a database that communicates with the user, with the API for quotes cUSD-SLE, with the database and with the CELO blockchain
3. A frontend to interact with the customers that initially can run as a web application and also as a MiniPay application

The architecutre is presented in the following diagram:
![image](https://github.com/user-attachments/assets/80ffc94c-3447-4024-881e-8c843a23b4ba)


## Sequence diagram for on-ramping

![image](https://github.com/user-attachments/assets/5d84f0e1-3154-4ee9-8c06-c9a5e90471c4)

## Running this project

1. Compile the kotlin application located in `gatewaySmsUssd`, generate APK and install in the phone
2. In a server run the coordinator backend with
```
cd packages/coordinator
yarn
yarn dev
```
3. In a server run
```
cd packages/react-app
yarn
yarn build
```
Point the webserver to the directory `out`
