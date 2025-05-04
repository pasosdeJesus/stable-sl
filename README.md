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

## Contents of this monorepo 

This monorepo includes 3 applications:
1. An application for the Android phone that will be gateway for SMS and 
   USSD, to send and receive payments with Orange Money automatically
2. A backend with a database that communicates with the user, with the 
   API for quotes of the price cUSD-SLE, with the database and with the \
   CELO blockchain
3. A frontend to interact with the customers that initially can run as a 
   web application and also as a MiniPay application

## Running in development mode

1. Compile the kotlin application located in `gatewaySmsUssd`, generate APK 
   and install in the phone.  See detailed instructions in
   gatewaySmsUssd/README.md
2. To run the coordinator it is better to use a proxy with nginx to have SSL,
   even in development mode. Follow the instructions of 
   packages/coordinator/README.md
3. The frontend is also better server in SSL with an nginx proxy.  See
   detailed instructions in packages/react-app/README.md


## Design

### Architecture

The architecutre is presented in the following diagram:
![image](https://github.com/user-attachments/assets/80ffc94c-3447-4024-881e-8c843a23b4ba)

### Authentication

* For the customer - coordinator backend we want to use the quoteId as a 
  randomly generated auth token.
* For the coordinator - gatewa we want to use a shared secret only between 
  them both to encrypt the messages


### Sequence diagram for on-ramping

![image](https://github.com/user-attachments/assets/47ee74e5-a307-43b8-9a24-412ebb7b0fa9)



## Status of Implementation

It is a prototype that:
1. Shows how on-ramp works
2. Still doesn't use an API for quotes
3. Still doesn't receive messages from the gateway --so no interaction with
   Orange Money
4. Has minimal information in the database
5. Can make payment of 0.1 USDC in Alfajores network --we wanted to use 
   cUSD but app.mento.org is not working for Alfajores at the moment
   of this writing.



