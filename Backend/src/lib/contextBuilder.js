export function buildContext({ user, lastOrder }) {
  return `
STORE INFORMATION:
- Delivery: 3–5 business days
- Return policy: 7 days
- Payment methods: COD, UPI, Card
- Warranty: 1 year

USER INFO:
- Logged in: ${user ? "Yes" : "No"}

LAST ORDER:
${lastOrder ? `
Order ID: ${lastOrder._id}
Status: ${lastOrder.status}
Expected Delivery: ${lastOrder.deliveryDate}
` : "No recent orders"}

IMPORTANT:
Only use the above information.
If the answer is not present here, say you cannot help.
`;
}
