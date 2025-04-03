# Sales & Revenue Analytics API

A GraphQL API built with Node.js, MongoDB, and Redis for analyzing sales and revenue data. This API provides customer spending analytics, top-selling products, and sales analytics within specified date ranges.

## Features

- **Customer Spending Analytics**
  - Total amount spent by customer
  - Average order value
  - Last purchase date

- **Top Selling Products**
  - Product rankings by quantity sold
  - Product details including name and total units sold
  - Configurable limit for results

- **Sales Analytics**
  - Total revenue calculation
  - Number of completed orders
  - Revenue breakdown by product category
  - Date range filtering

- **Additional Features**
  - Redis caching for improved performance
  - Pagination support
  - Order creation mutation
  - Comprehensive error handling

## Tech Stack

- Node.js
- Express
- GraphQL
- MongoDB
- Redis (for caching)
- Jest (for testing)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis Server
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sales-analytics-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up mongodb compass and load sample data:
```
make sure mongoDB is installed locally

uncomment the line 16 in index.js to populate with dummy data

```

4. Start the server:
```bash
npm start
```

## API Documentation

### GraphQL Queries

1. Get Customer Spending:
```graphql
query {
  getCustomerSpending(customerId: "customer-id") {
    customerId
    totalSpent
    averageOrderValue
    lastOrderDate
  }
}
```

2. Get Top Selling Products:
```graphql
query {
  getTopSellingProducts(limit: 5) {
    productId
    name
    totalSold
  }
}
```

3. Get Sales Analytics:
```graphql
query {
  getSalesAnalytics(
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-12-31T23:59:59Z"
  ) {
    totalRevenue
    completedOrders
    categoryBreakdown {
      category
      revenue
    }
  }
}
```



## Testing

Run the test suite:
```bash
npm test
```



## Error Handling

The API implements comprehensive error handling for:
- Invalid inputs
- Database connection issues
- Cache failures
- Business logic violations

## Performance Considerations

- Efficient MongoDB aggregation pipelines
- Pagination for large result sets
- Proper indexing on MongoDB collections



