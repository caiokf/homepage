---
title: Event Sourcing in Practice
date: 2024-01-20
tags: [event-sourcing, architecture, backend, aws]
slug: event-sourcing-in-practice
authors: claude code
---

Event sourcing is a powerful pattern that captures all changes to application state as a sequence of events. Instead of storing just the current state, we store every event that led to that state. This approach offers unique benefits for auditability, debugging, and building reactive systems.

## Why Event Sourcing?

Traditional CRUD applications store the current state of entities. This works well for many use cases, but it loses the history of how we got there. Event sourcing flips this model: we store events and derive the current state from them.

### Key Benefits

1. **Complete Audit Trail**: Every change is recorded with full context
2. **Time Travel**: Reconstruct the state at any point in history
3. **Event-Driven Architecture**: Natural fit for reactive systems
4. **Debugging**: Replay events to understand exactly what happened

## Implementing Event Sourcing

Here's a simplified example of how events might look in a banking context:

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
    case "MoneyWithdrawn":
      return { ...state, balance: state.balance - event.amount };
  }
}
```

## Challenges to Consider

Event sourcing isn't a silver bullet. It adds complexity and requires careful consideration of:

- **Event Schema Evolution**: How do you handle changes to event structures?
- **Performance**: Replaying thousands of events can be slow
- **Eventual Consistency**: The system might not always be immediately consistent

## When to Use It

Event sourcing shines in domains where:

- Audit trails are critical (finance, healthcare)
- You need to understand the "why" behind state changes
- You're building event-driven microservices

For simpler CRUD applications, the added complexity might not be worth it.
