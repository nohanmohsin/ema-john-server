const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(cors());
app.use(bodyParser.json());

require('dotenv').config()
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
app.get('/', (req, res) => {
    res.send('hola nino')
})



const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.hzpkp.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const products = client.db("ema-john-db").collection("product-info");
    const orders = client.db("ema-john-db").collection("order-info");
    // perform actions on the collection object
    app.post('/addProduct', (req, res) => {
        const productInfo = req.body;

        products.insertOne(productInfo)
        .then(result => {
            
            res.send(result.insertedCount);
        })
    })

    app.get('/products', (req, res) => {
        products.find({})
        .toArray( (err, documents) => {
            res.send(documents)
        })
    })

    app.get('/product/:key', (req, res) => {
        products.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0])
        })
    })
    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({key: {$in: productKeys}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })


    app.post('/addOrder', (req, res) => {
        const orderInfo = req.body;

        orders.insertOne(orderInfo)
        .then(result => {
            
            res.send(result.insertedCount > 0);
        })
    })
});


app.listen(process.env.PORT || 5000)