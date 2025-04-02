module.exports = `
  type Customer {
    _id: ID
    name: String
    email: String
    age: Int
    location: String
    gender: String
  }

  type CustomerSpending {
    customerId: ID
    totalSpent: Float
    averageOrderValue: Float
    lastOrderDate: String
    orderCount: Int
  }
`;