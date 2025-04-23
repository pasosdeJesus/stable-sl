'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {ArrowLeft, Check, Phone, PiggyBank} from "lucide-react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNext = () => {
    if (step === 1 && phoneNumber && /^\d{9}$/.test(phoneNumber)) {
      setStep(2);
    } else if (step === 2 && amount && parseFloat(amount) > 0) {
      setStep(3);
    } else {
      alert('Please enter valid values.');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfirm = () => {
    alert(`Collecting $${amount}SLE from ${phoneNumber}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Stable-SL</CardTitle>
          <CardDescription>
            <p>Buying USD in Sierra Leone</p>
            <p>Step {step} of 3</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number with Orange Money</label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Sierra Leone number e.g 075232442"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                aria-label="Phone Number"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount</label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount of SLE"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-label="Amount"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p>Please confirm the details below:</p>
              <p>Phone Number: {phoneNumber}</p>
              <p>Amount: ${amount}</p>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="mr-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            ) : (
              <Button onClick={handleConfirm} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Confirm
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
