# stable-sl

Making easy to buy and sell stable crypto for people from Sierra Leone

Prototype running in production mode on <https://stable-sl.pdJ.app> and in 
development mode on <https://stable-sl.pdJ.app:9001>

## Problem

In Sierra Leone few people manages a crypto wallet or an exchange and at the
moment of this writing neither FonBnk nor MiniPay support Sierra Leone.

There are interesting saving and investment options in the web3, but this 
requires tools and education. We want to create tools and promote education 
about this in Sierra Leone.

## Solution

* Building a webapp or app that will make easy to buy/sell stable crypto to the
    people of Sierra Leone.
* Educate in the usage of stable cryptocoins and saving and investment 
  opportunities.
* Motivated by the Divvi (see https://docs.divvi.xyz/) offering of FonBnk
  as a possible backend protocol, in march 2025 we proposed to FonBnk to be 
  their partners in Sierra Leone. Later they told us that they already 
  had a team there, but up to now they still don't support the currency,  
  neither payment methods of Sierra Leone not even in their sandbox.
* So at least while FonBnk or another group offers an on-ramp/off-ramp solution
  we have started building one, operating with a team based on the 
  Mission Hope School located in Kabala (the school is lead by the pastor 
  Zechariah Conteh who is in the team).

## Location of Impact

Sierra Leone

## Contents of this monorepo 

This monorepo includes:
1. The frontend to interact with the customers that initially can run as a 
   web application and also as a MiniPay application
2. The APK of the Gateway application that runs in the phone.

## Running the frontend in development mode

The frontend is better served in SSL with nginx.  See detailed 
instructions in packages/react-app/README.md


## Design

### Architecture

The architecutre is presented in the following diagram:
![image](https://github.com/user-attachments/assets/80ffc94c-3447-4024-881e-8c843a23b4ba)

### Authentication

* For the customer - coordinator backend we want to use the token as a 
  randomly generated authentication token.
* For the coordinator - gateway we want to use a shared secret only between 
  them both to encrypt the messages

### Sequence diagram for on-ramping

![image](https://github.com/user-attachments/assets/5dfa4e46-2945-4feb-90f3-dec01e0b8501)


## Status of Implementation

It is a prototype that:
1. Shows how on-ramp works
2. Still doesn't use an API for quotes
3. It interacts with the gateway receiving the SMS with Orange Money
   notifications --a method that has to be improved.
4. The version in production can make payments in mainnet in USDT 
   limited to small amounts while we test and get a license. 
   The development version runs on Alfajores and makes payments of 0.1 USDC.

