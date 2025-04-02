module.exports = `
  type Product {
    _id: ID!
    name: String!
    category: String!
    price: Float!
    stock: Int!
  }

  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }
`;