const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const productsRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://lucky:lucky@cluster0.f3rcnou.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type, Accept, Authorization');
    
    if(req.method === 'OPTIONS'){
        req.header('Access-Control-Allow-Methods', 'PUT,POST, PATCH, DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


//Routes which should handle requests
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500 );
    res.json({
        error : {
            message: error.message
        }
    })
});

module.exports = app;