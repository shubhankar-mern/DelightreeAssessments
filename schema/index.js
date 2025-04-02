const {buildSchema} = require('graphql');
const customerSchema = require('./customerSchema');
const orderSchema = require('./orderSchema');
const productSchema = require('./productSchema');

const Database = require('../config/database');
const { v4: uuidv4 } = require('uuid');



const schema = buildSchema(`
 ${customerSchema}
 ${orderSchema}
 ${productSchema}

 type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
    getCustomerOrders(customerId: ID!,page: Int!,limit: Int!): [Order]
  }

 type Mutation {
  createOrder(input: CreateOrderInput!): Order
 } 

`)

const rootResolver = {
    getCustomerSpending: async ({customerId}) => {
        try {   
            const db =  new Database().getInstance().getDb();
            
           // console.log(customerId);
            
             const customer = await db.collection('customers').findOne({ 
                _id: customerId  
            });
           // console.log(customer);
            if (!customer) {
                return {
                    customerId: customerId,
                    totalSpent: 0,
                    averageOrderValue: 0,
                    lastOrderDate: null
                };
            }
    
            const result = await db.collection('orders').aggregate([
                {
                    $match: {
                        customerId: customerId,
                        status: 'completed'
                    }
                },
                {
                    $unwind: '$products'  
                },
                {
                    $group: {
                        _id: '$customerId',
                        totalSpent: { $sum: { $toDouble: '$totalAmount' }},
                        totalQuantity: { $sum: '$products.quantity' },
                        lastOrderDate: { $max: '$orderDate' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        customerId: '$_id',
                        totalSpent: { $round: ['$totalSpent', 2] },
                        averageOrderValue: { $round: [{ $divide: ['$totalSpent', '$totalQuantity'] }, 2] },
                        lastOrderDate: 1
                    }
                }
            ]).toArray();
            //console.log(result);

            const data = result[0] || {
                customerId: customerId,
                totalSpent: 0,
                averageOrderValue: 0,
                lastOrderDate: null
            };
           
            return data;

        } catch (error) {
            console.error('Error fetching customer:', error);
            throw new Error('Customer not found');
        }
    },
    getSalesAnalytics: async ({startDate, endDate}) => {
        try {
            const db = new Database().getInstance().getDb();
            const pipeline = [
                {
                    $match: {
                        orderDate: {
                            $gte: startDate,
                            $lte: endDate
                        },
                        status: 'completed'
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $addFields: {
                        productRevenue: {
                            $multiply: ['$products.quantity', '$products.priceAtPurchase']
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: {
                            $sum: '$productRevenue'
                        },
                        completedOrders: {
                            $addToSet: '$_id'  
                        },
                        categories: {
                            $push: {
                                category: '$productDetails.category',
                                revenue: '$productRevenue'
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalRevenue: { $round: ['$totalRevenue', 2] },
                        completedOrders: { $size: '$completedOrders' },
                        categoryBreakdown: {
                            $map: {
                                input: {
                                    $setUnion: {
                                        $map: {
                                            input: '$categories',
                                            as: 'cat',
                                            in: '$$cat.category'
                                        }
                                    }
                                },
                                as: 'category',
                                in: {
                                    category: '$$category',
                                    revenue: {
                                        $round: [{
                                            $sum: {
                                                $map: {
                                                    input: {
                                                        $filter: {
                                                            input: '$categories',
                                                            as: 'c',
                                                            cond: { $eq: ['$$c.category', '$$category'] }
                                                        }
                                                    },
                                                    as: 'filtered',
                                                    in: '$$filtered.revenue'
                                                }
                                            }
                                        }, 2]
                                    }
                                }
                            }
                        }
                    }
                }
            ];
    
            const result = await db.collection('orders').aggregate(pipeline).toArray();
    

            return result[0] || {
                totalRevenue: 0,
                completedOrders: 0,
                categoryBreakdown: []
            };
        } catch (error) {
            console.error('Error fetching sales analytics:', error);
            throw new Error('Failed to fetch sales analytics');
        }
    },
    getTopSellingProducts: async ({limit}) => {
        try {
            const db = new Database().getInstance().getDb();
            const result = await db.collection('orders').aggregate([
                {
                    $match: {
                        status: { $in: ['completed', 'pending'] }
                    }
                },
                {
                    $unwind: '$products'
                },
                {
                    $group: {
                        _id: '$products.productId',
                        totalSold: { $sum: '$products.quantity' }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $unwind: '$productDetails'
                },
                {
                    $project: {
                        _id: 0,
                        productId: '$_id',
                        name: '$productDetails.name',
                        totalSold: 1
                    }
                },
                {
                    $sort: {
                        totalSold: -1
                    }
                },
                {
                    $limit: limit
                }
            ]).toArray();
    
            return result;
        } catch (error) {
            console.error('Error fetching top selling products:', error);
            throw new Error('Failed to fetch top selling products');
        }   
    },
    getCustomerOrders: async ({customerId,page,limit}) => {
        try {
            const db = new Database().getInstance().getDb();
            const result = await db.collection('orders').aggregate([
                {
                    $match: {
                        customerId: customerId
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'products.productId',
                        foreignField: '_id',
                        as: 'productDetails'
                    }
                },
                {
                    $skip: (page - 1) * limit
                },
                {
                    $limit: limit
                }
            ]).toArray();
            return result;
        } catch (error) {
            console.error('Error fetching customer orders:', error);
            throw new Error('Failed to fetch customer orders');
        }
    },
    createOrder: async ({ input }) => {
        try {
            const db = new Database().getInstance().getDb();
            const { customerId, products } = input;

            
            const customer = await db.collection('customers').findOne({ 
                _id: customerId 
            });
            if (!customer) {
                throw new Error('Customer not found');
            }

            
            const productDetails = await Promise.all(
                products.map(async (product) => {
                    const dbProduct = await db.collection('products').findOne({ 
                        _id: product.productId 
                    });
                    if (!dbProduct) {
                        throw new Error(`Product not found: ${product.productId}`);
                    }
                    if (dbProduct.stock < product.quantity) {
                        throw new Error(`Insufficient stock for product: ${dbProduct.name}`);
                    }
                    return {
                        ...product,
                        priceAtPurchase: dbProduct.price
                    };
                })
            );

            
            const totalAmount = productDetails.reduce((sum, product) => 
                sum + (product.priceAtPurchase * product.quantity), 0
            );

            
            const order = {
                _id: uuidv4().toString(),
                customerId,
                products: productDetails,
                totalAmount,
                orderDate: new Date().toISOString(),
                status: 'pending'
            };
            //console.log(order);
            await db.collection('orders').insertOne(order);


            return order;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
}

module.exports = {schema, rootResolver};