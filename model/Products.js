import { connection as db } from "../config/index.js";
import { createToken } from "../middleware/AuthenticateUser.js";
import { compare, hash } from "bcrypt";

class Products {
    fetchProducts(req, res) {
    try {
      const strQry = `
        select prodName, category, prodDescription, prodURL, amount
        from Products
        `;
      db.query(strQry, (err, results) => {
        if (err) throw new Error(err);
        res.json({
          status: res.statusCode,
          results,
        });
      });
    } catch (e) {
      res.json({
        status: 404,
        msg: e.message,
      });
    }
    }
    fetchProduct(req, res) {
    try {
      const strQry = `
        select prodName, category, prodDescription, prodURL, amount
        from Products 
        where ProductID = ${req.params.id}
        `;
      db.query(strQry, (err, results) => {
        if (err) throw new Error(`Issue when retrieving  a Product.`);
        res.json({
          status: res.statusCode,
          results: results[0],
        });
      });
    } catch (e) {
      res.json({
        status: 404,
        msg: e.message,
      });
    }
    }
    async addProduct(req, res) {
    try {
        let data = req.body;
        // Payload
        let Product = {
          prodName: data.prodName,
          category: data.category,
          prodDescription: data.prodDescription,
          prodURL: data.prodURL,
          amount: data.amount,
        };
        let strQry = `
            insert into Products
            SET ?;
            `;
        db.query(strQry, [data], (err) => {
          if (err) {
            res.json({
              status: res.statusCode,
              msg: "Product delivered successfully",
            });
          } else {
            res.json({
              token,
              msg: "Product created successfully",
            });
          }
        });
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message,
        });
      }
    }
    async updateProduct(req, res) {
    try {
        let data = req.body;
        if (data.pwd) {
          data.pwd = await hash(data.pwd, 12);
        }
        const strQry = `
        update Products
        SET ?
        where ProductID = ${req.params.id};
        `;
    
        db.query(strQry, [data], (err, results) => {
          if (err) throw new Error("Unable to update Product");
          res.json({
            status: res.statusCode,
            msg: "The Product record was updated successfully",
          });
        });
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message,
        });
      }
    }
    deleteProduct(req, res) {
    try {
        const strQry = `
        delete from Products
        where ProductID = ${req.params.id}
        `;
        db.query(strQry, (err) => {
          if (err) throw new Error("Unable to delete Product");
          res.json({
            status: res.statusCode,
            msg: "The Product record was deleted successfully",
          });
        });
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message,
        });
      }
    }
}
export{
    Products
}