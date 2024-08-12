import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";
import { createToken } from "./middleware/AuthenticateUser.js";
import { compare, hash } from "bcrypt";
import bodyParser from "body-parser";

// Create an express app
const app = express();
const port = +process.env.PORT || 4000;
const router = express.Router();
// Middleware
app.use(
  router,
  express.static("./static"),
  express.json(),
  express.urlencoded({
    extended: true,
  })
);
router.use(bodyParser.json());
// Endpoints
router.get("^/$|/eShop", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});
router.get("/users", (req, res) => {
  try {
    const strQry = `
            select firstName, lastName, age, emailAdd
            from Users;
            `;
    db.query(strQry, (err, results) => {
      if (err) throw new Error(err);
      //   if (err) throw new Error(`Unable to fetch all users`);
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
});

router.get("/user/:id", (req, res) => {
  try {
    const strQry = `
              select userID, firstName, lastName, age, emailAdd
              from Users 
              where userID = ${req.params.id};
              `;
    db.query(strQry, (err, results) => {
      //   if (err) throw new Error(err);
      if (err) throw new Error(`Issue when retrieving  a user.`);
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
});

router.get("/register", async (req, res) => {
  try {
    let data = req.body;
    data.pwd = await hash(data.pwd, 10);
    // Payload
    let user = {
      emailAdd: data.emailAdd,
      pwd: data.pwd,
    };
    let strQry = `
        insert into Users
        SET ?;
        `;

    db.query(strQry, [data], (err, results) => {
      if (err) {
        res.json({
          status: res.statusCode,
          msg: "User created successfully",
        });
      } else {
        const token = createToken(user);
        res.json({
          token,
          msg: "You are now registered.",
        });
      }
    });
  } catch (e) {}
});

router.patch("/user/:id", async (req, res) => {
  try {
    let data = req.body;
    if (data.pwd) {
      data.pwd = await hash(data.pwd, 12);
    }
    const strQry = `
    update Users
    SET ?
    where userID = ${req.params.id};
    `;

    db.query(strQry, [data], (err, results) => {
      if (err) throw new Error("Unable to update user");
      res.json({
        status: res.statusCode,
        msg: "The user record was updated successfully",
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

router.delete("/user/:id", (req, res) => {
  try {
    const strQry = `
    delete from Users
    where userID = ${req.params.id}
    `;
    db.query(strQry, (err) => {
      if (err) throw new Error("Unable to delete user");
      res.json({
        status: res.statusCode,
        msg: "The user record was deleted successfully",
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

router.post("/login", (req, res) => {
  try {
    const { emailAdd, pwd } = req.body;
    const strQry = `
    SELECT userID, firstName, lastName, age, emailAdd, pwd
    from Users
    WHERE emailAdd = '${emailAdd}'
    `;
    db.query(strQry, async (err, results) => {
      if (err) throw new Error("To login, please review your query");
      if (!result?.length) {
        res.json({
          status: 401,
          msg: "User not found",
        });
      } else {
        const isValid = await compare(pwd, results[0].pwd);
        if (isValidPass) {
          const token = createToken({
            emailAdd,
            pwd,
          });
          res.json({
            status: res.statusCode,
            token,
            result: results[0],
          });
        } else {
          res.json({
            status: 401,
            msg: "Invalid password or you have not registered yet",
          });
        }
      }
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

router.get("*", (req, res) => {
  res.json({
    status: 404,
    msg: "Page not found",
  });
});
//listen is a function that starts the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});