# AI Assistant Architecture

## Purpose

The AI Assistant is an internal tool for workshop operators.

It supports:

- Operational queries
- Workshop analytics
- Vehicle history analysis
- Mechanical knowledge assistance
- Diagnostic suggestions

---

## Knowledge Sources

The assistant has three sources of knowledge:

### 1. Workshop SQL Data

Source of truth for:

- Work Orders
- Vehicles
- Customers
- Companies
- Parts
- Suppliers
- Costs
- Metrics

Always preferred when available.

---

### 2. OpenAI General Knowledge

Used for:

- Mechanical explanations
- Troubleshooting suggestions
- Diagnostic reasoning
- General automotive knowledge

---

### 3. OpenAI Vector Store

Used only for:

- Internal manuals
- Procedures
- Supplier documentation
- Internal policies
- Technical documents

---

## SQL First Rule

For mixed questions:

1. Query workshop data first.
2. Retrieve relevant records.
3. Pass context to the model.
4. Generate the response.

Example:

User:
"How did we solve similar Citroen air filter failures before?"

Process:

- Query previous work orders.
- Query suppliers.
- Query part costs.
- Provide context to OpenAI.
- Generate answer.

---

## Forbidden Patterns

Do NOT:

- Store work orders in Vector Store.
- Store workshop history in embeddings.
- Use File Search as primary operational memory.
- Bypass SQL tools for workshop data.