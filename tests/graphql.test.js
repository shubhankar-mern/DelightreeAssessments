const request = require('supertest');
const app = require('../index.js');
const fs = require('fs');
const path = require('path');

describe('GraphQL API Tests', () => {
    test('getCustomerSpending returns correct data structure', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
                    query {
                        getCustomerSpending(customerId: "e7d22fe7-bee5-4507-bcb8-8b4b999dc9fd") {
                            customerId
                            totalSpent
                            averageOrderValue
                            lastOrderDate
                        }
                    }
                `
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getCustomerSpending).toHaveProperty('customerId');
        expect(response.body.data.getCustomerSpending).toHaveProperty('totalSpent');
        expect(response.body.data.getCustomerSpending).toHaveProperty('averageOrderValue');
        expect(response.body.data.getCustomerSpending).toHaveProperty('lastOrderDate');
    });

    
    test('getTopSellingProducts returns correct data structure', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
                    query {
                        getTopSellingProducts(limit: 1) {
                            productId
                            name
                            totalSold
                        }
                    }
                `
            });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data.getTopSellingProducts)).toBe(true);
        expect(response.body.data.getTopSellingProducts[0]).toHaveProperty('productId');
        expect(response.body.data.getTopSellingProducts[0]).toHaveProperty('name');
        expect(response.body.data.getTopSellingProducts[0]).toHaveProperty('totalSold');
    });

    
    test('getSalesAnalytics returns correct data structure', async () => {
        const response = await request(app)
            .post('/graphql')
            .send({
                query: `
                    query {
                        getSalesAnalytics(
                            startDate: "2021-12-31T10:35:58.471788",
                            endDate: "2024-12-31T10:35:58.471788"
                        ) {
                            totalRevenue
                            completedOrders
                            categoryBreakdown {
                                category
                                revenue
                            }
                        }
                    }
                `
            });

        expect(response.status).toBe(200);
        expect(response.body.data.getSalesAnalytics).toHaveProperty('totalRevenue');
        expect(response.body.data.getSalesAnalytics).toHaveProperty('completedOrders');
        expect(Array.isArray(response.body.data.getSalesAnalytics.categoryBreakdown)).toBe(true);
    });
});