module.exports = `
  type OrderProduct {
    productId: ID!
    quantity: Int!
    priceAtPurchase: Float!
  }

  type Order {
    _id: ID!
    customerId: ID!
    products: [OrderProduct!]!
    totalAmount: Float!
    orderDate: String!
    status: String!
  }
  
  input OrderProductInput {
    productId: String!
    quantity: Int!
  }

  input CreateOrderInput {
    customerId: String!
    products: [OrderProductInput!]!
  }
    
  type CategoryRevenue {
    category: String!
    revenue: Float!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryRevenue!]!
  }
`;