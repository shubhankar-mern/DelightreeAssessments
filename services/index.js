//prepopulate db with data

const fs = require('fs');
const csv = require('csv-parse/sync');
const path = require('path');

async function populateDatabase(db) {
    try {
        
        // Read and parse CSV files
        const customersData = csv.parse(fs.readFileSync(path.join(__dirname, '../sampledata/customers.csv')), {
            columns: true,
            skip_empty_lines: true
        });

        const productsData = csv.parse(fs.readFileSync(path.join(__dirname, '../sampledata/products.csv')), {
            columns: true,
            skip_empty_lines: true
        });

        const ordersData = csv.parse(fs.readFileSync(path.join(__dirname, '../sampledata/orders.csv')), {
            columns: true,
            skip_empty_lines: true
        });

        
        await db.collection('customers').insertMany(customersData);
        console.log('Customers inserted successfully');

        
        await db.collection('products').insertMany(productsData);
        console.log('Products inserted successfully');

        
        const processedOrders = ordersData.map(order => ({
            ...order,
            products: JSON.parse(order.products.replace(/'/g, '"')) 
        }));

        
        await db.collection('orders').insertMany(processedOrders);
        console.log('Orders inserted successfully');

        console.log('Database populated successfully');
    } catch (error) {
        console.error('Error populating database:', error);
        throw error;
    }
}

module.exports = { populateDatabase };
