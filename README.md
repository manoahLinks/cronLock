# CRONLOCK
### Smart Locker x402 🔐💰

**Pay-per-use smart lockers powered by the x402 payment protocol and blockchain payments.**

No apps. No accounts. No subscriptions. Just scan, pay, and unlock.

---

## What is this?

A proof-of-concept demonstrating autonomous IoT payments using Cronos's x402 protocol. Physical lockers that unlock when you pay with cryptocurrency—showcasing the future of machine-to-machine commerce and pay-per-use infrastructure.

## The Problem

Current shared infrastructure (gym lockers, storage units, bike locks) requires:
- Monthly subscriptions you don't fully use
- Complex account setups
- Mobile apps that track you
- Payment methods that exclude many users

## Our Solution

**Smart lockers that work like parking meters for the digital age:**

1. **Scan QR code** on the locker
2. **Pay with crypto** (USDC on Base network)
3. **Locker unlocks** automatically via HTTP 402 response
4. **Use for the time you paid** - extend anytime
5. **Auto-locks** when time expires

## How x402 Works

The x402 protocol activates HTTP's dormant 402 "Payment Required" status code:

```
GET /locker/3/unlock
← 402 Payment Required
{
  "amount": "0.05 USDC",
  "recipient": "0x...",
  "duration": "1 hour"
}

[User pays via wallet]

POST /locker/3/unlock
Headers: X-Payment-Proof: 0x...
← 200 OK - Locker Unlocked
```

The locker becomes an autonomous economic agent—earning money and providing service without human intervention.

## Architecture

```
┌─────────────┐
│   Frontend  │  React + Web3 wallet integration
│  (Scan QR)  │
└──────┬──────┘
       │
       ↓ HTTP Request
┌─────────────────┐
│    Facilitator  │  Node.js payment verification
│   (402 Handler) │  Verifies blockchain transactions
└──────┬──────────┘
       │
       ↓ WebSocket/Serial
┌─────────────────┐
│  ESP32/Arduino│  Controls servo/solenoid
│  (Physical Lock)│  Unlocks on verified payment
└─────────────────┘
       │
       ↓ Smart Contract Events
┌─────────────────┐
│   Cronos Network  │  USDC payments recorded on-chain
│ (Blockchain)    │  Immutable payment history
└─────────────────┘
```

## Tech Stack

- **Hardware**: ESP32 + Servo motors + RFID
- **Smart Contract**: Solidity on Cronos (EVM)
- **Backend**: Node.js + Express + WebSocket
- **Frontend**: React + wagmi/viem for Web3
- **Payment**: USDC stablecoin (low fees, fast confirmation)

## Use Cases

This architecture extends beyond lockers:

- 🚲 Bike/scooter sharing without apps
- ⚡ EV charging stations - pay per kWh
- 🅿️ Smart parking meters
- 🔧 Tool libraries and makerspaces  
- 📦 Package pickup lockers
- 🏢 Co-working space amenities
- 🎮 Arcade machines and entertainment

**Anywhere you want pay-per-use without subscription overhead.**

## Why This Matters

**For Users:**
- No subscription lock-in
- Pay only for what you use
- Instant access, no signup friction
- Privacy-preserving (no personal data collected)

**For Operators:**
- Automated revenue collection
- Lower operational overhead
- Global payment acceptance
- Transparent transaction history on-chain

**For the Ecosystem:**
- Enables machine-to-machine economy
- Micropayments become viable
- Physical world meets Web3
- Foundation for autonomous IoT infrastructure

## Demo

[Video demo coming soon]

**Live Demo Flow:**
1. User scans QR code → Web UI loads
2. Connect crypto wallet (MetaMask/Coinbase Wallet)
3. See locker price: 0.05 USDC per hour
4. Approve payment → Transaction confirms in ~2 seconds
5. Physical lock clicks open 🎉
6. Timer starts counting down
7. Option to extend rental or let it auto-lock

## Getting Started

[Setup instructions coming soon]

## Built With x402

This project demonstrates Coinbase's x402 open payment protocol - enabling direct, automated payments for digital content and APIs using stablecoins.

Learn more: [x402 Protocol Documentation](https://docs.cdp.coinbase.com/x402/docs/welcome)

## Team

Built for [Hackathon Name] by [Your Team Name]

## License

MIT License - Build upon this freely!

---

**The future of shared infrastructure is autonomous, permissionless, and pay-per-use.**