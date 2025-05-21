#!/bin/sh

phone=075934442
amount=25
curl -H 'Content-Type: application/json' \
  -d "{\"sender\":\"${phone}\",\"msg\":\"Transaction Id 09ABC12 Transfer Succesful from ${phone} transaction amount SLE${amount} net credit amount SLE${amount} your new balance is SLE100\"}" \
  -X POST https://stable-sl-coordinator.pdj.app/api/sms_received
