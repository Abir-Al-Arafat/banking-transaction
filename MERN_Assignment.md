MERN Stack Developer – Technical Assignment

# MERN Assignment: Concurrent Banking Transaction System

## Objective:
The purpose of this assignment is to evaluate your ability to design and implement a scalable backend system capable of handling high-concurrency financial transactions safely.

You will build a simplified banking transaction system where multiple users can perform transactions simultaneously while ensuring that account balances remain consistent and correct.

## Problem Statement:
In a banking environment, multiple users may perform transactions on the same account at the same time, such as:

- Deposits
- Withdrawals
- Transfers

Your system must ensure that:

- Account balances remain accurate
- Race conditions are prevented
- No inconsistent balance updates occur
- Concurrent transactions are handled safely

You should implement a mechanism such as optimistic concurrency control using version numbers or another safe concurrency strategy.

## Technical Stack

### Backend
- Node.js
- Express.js

### Frontend
- React / NextJS

### Database
- PgSQL / MySQL / MongoDB

### Real-time communication
- WebSocket (Socket.io or similar)

## Functional Requirements:

### Account Management
Each account must contain:

- Account ID
- Account Holder Name
- Current Balance
- Version Number (for concurrency control)

Example:
```json
{
  "accountId": "ACC1001",
  "holderName": "John Doe",
  "balance": 1000,
  "version": 1
}
```

The version field should be used to implement optimistic locking when updating balances.

### Supported transaction types:
- deposit
- withdraw
- transfer

## Transaction Rules

1. Deposits increase the account balance.
2. Withdrawals decrease the account balance.
3. Withdrawals must fail if the balance is insufficient.
4. The system must prevent race conditions during concurrent transactions.

Example scenario:

Initial Balance: 1000

Transaction A: withdraw 700  
Transaction B: withdraw 500  

Correct behavior:

- Transaction A succeeds
- Transaction B fails due to insufficient balance

The system must never allow the balance to become negative due to concurrent updates.

## Real-Time Updates
The system should notify clients in real time when:

- A transaction is created
- A balance changes
- A transaction fails

Use WebSockets to emit events such as:
- transaction:created
- balance:updated
- transaction:failed

## Concurrency & Load Testing Requirement:

The system must demonstrate the ability to handle at least 1000 concurrent transaction requests.

Candidates must perform load testing to validate the system behavior under concurrency.

Recommended tools:
- k6
- Artillery
- JMeter

Example load test scenario:
1000 concurrent users sending POST /api/transactions

The system must guarantee that:

- Account balances remain consistent
- No negative balances occur
- No race conditions are observed
- Transactions are processed safely

Candidates should include load testing scripts and results in the submission.

## Deliverables

Please submit the following items as part of your assignment:

1. GitHub Repository
   - The complete source code of the project must be hosted in a public GitHub repository.

2. README Documentation
   The repository must include a README file containing:
   - Setup Instructions – Steps required to install and run the project locally.
   - Architecture Explanation – Overview of the system design and key components.
   - Concurrency Control Strategy – Explanation of how concurrent transactions are handled and data consistency is maintained.

3. API Documentation
   - Provide clear documentation for all APIs, including endpoints, request parameters, and response formats.

4. Load Testing Script and Results
   - Include the load testing script used for testing concurrent transactions.
   - Provide a summary of the testing results.

5. Live URL
   - Deploy the application and provide a publicly accessible live URL.

6. Project Walkthrough Video
   - Record a video explaining the project from start to finish, including the system architecture and key functionalities.
   - Upload the video to Google Drive or YouTube and share the access link with us.
