---
title: "Event sourcing deep dive"
date: 2024-01-20
tags: [event-sourcing, architecture, backend]
slug: event-sourcing-deep-dive
---

Started implementing event sourcing for a new service. The core idea: store every event that changes state, derive current state by replaying them.

Benefits I'm seeing: complete audit trail (every change recorded with context), time travel (reconstruct state at any point), natural fit for event-driven architecture.

The implementation pattern:

```typescript
type AccountEvent =
  | { type: "AccountCreated"; accountId: string; owner: string }
  | { type: "MoneyDeposited"; accountId: string; amount: number }
  | { type: "MoneyWithdrawn"; accountId: string; amount: number };

function applyEvent(state: AccountState, event: AccountEvent): AccountState {
  switch (event.type) {
    case "AccountCreated":
      return { balance: 0, owner: event.owner };
    case "MoneyDeposited":
      return { ...state, balance: state.balance + event.amount };
    // ...
  }
}
```

Challenges to solve: event schema evolution (how to handle changes?), performance (replaying thousands of events), eventual consistency.

Good fit for: finance, healthcare, anywhere audit trails are critical. For simple CRUD, probably overkill.
