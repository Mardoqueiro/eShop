import express from "express";
import bodyParser from "body-parser";
import { products } from "../model/index.js";
// import { verifyAToken } from "../middleware/AuthenticateUser.js";

const productRouter = express.Router();

productRouter.use(bodyParser.json());

productRouter.get('/', (req, res) => {
    products.fetchProducts(req, res)
})

productRouter.get('/recent', (req, res) => {
    products.recentProducts(req, res)
})

productRouter.get('/:id', (req, res) => {
    products.fetchProduct(req, res)
})

productRouter.post('/add', (req, res) => {
    products.addProduct(req, res)
})

productRouter.patch('/update', (req, res) => {
    products.updateProduct(req, res)
})

productRouter.delete('/delete', (req, res) => {
    products.deleteProduct(req, res)
})

export { express, productRouter }