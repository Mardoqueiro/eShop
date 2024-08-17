import { connection as db } from "../config/index.js";

class Products {
  fetchProducts(req, res) {
    try {
      const strQry = `
        SELECT productID, prodName, category, prodDescription, prodURL, amount
        FROM Products;
        `
      db.query(strQry, (err, results) => {
        //Results is to recieve multiple products, result is to get a singular
        if (err) throw new Error("Issue retrieving Products.");
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
  recentProducts(req, res) {
    try {
      const strQry = `
        select productID, prodName, category, prodDescription, prodURL, amount
        FROM Products
        ORDER BY productID DESC
        LIMIT 5;
        `;
      db.query(strQry, (err, results) => {
        if (err) throw new Error(`Issue retrieving recent Product.`);
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
  fetchProduct(req, res) {
    try {
      const strQry = `
          SELECT productID, prodName, category, prodDescription, prodURL, amount
          FROM Products
          where ProductID = ${req.params.id}
          `;
      db.query(strQry, (err, result) => {
        if (err) throw new Error(`Issue when retrieving a Product.`);
        res.json({
          status: res.statusCode,
          result: result[0],
        });
      });
    } catch (e) {
      res.json({
        status: 404,
        msg: e.message,
      });
    }
  }
  addProduct(req, res) {
    try {
      let strQry = `
        INSERT INTO Products
          SET ?
          `;
      db.query(strQry, [req.body], (err) => {
        if (err) throw new Error("Unable to add a new Product");{
          res.json({
            status: res.statusCode,
            msg: "Product was added successfully",
          });
        }
      });
    } catch (e) {
      res.json({
        status: 404,
        err: e.message,
      });
    }
  }
  updateProduct(req, res) {
    try {
      const strQry = `
        UPDATE Products
        SET ?
        WHERE ProductID = ${req.params.id};
        `;
      db.query(strQry, [req.body], (err) => {
        if (err) throw new Error("Unable to update a Product");
        res.json({
          status: res.statusCode,
          msg: "The Product record was updated successfully",
        });
      });
    } catch (e) {
      res.json({
        status: 404,
        err: e.message,
      });
    }
  }
  deleteProduct(req, res) {
    try {
      const strQry = `
        DELETE FROM Products
        WHERE ProductID = ${req.params.id};
        `
      db.query(strQry, (err) => {
        if (err) throw new Error("Unable to delete a Product");
        res.json({
          status: res.statusCode,
          msg: "The Product was deleted successfully",
        });
      });
    } catch (e) {
      res.json({
        status: 404,
        err: e.message,
      });
    }
  }
}
export { Products };