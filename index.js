import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";
import { createToken } from "./middleware/AuthenticateUser.js";
import { hash } from "bcrypt";
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
  }))
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
      }
      let strQry = `
        insert into Users
        SET ?;
        `

        db.query(strQry, [data], (err, results) => {
          if (err) {
            res.json({
              status: res.statusCode,
              msg: 'User created successfully'
            })
          } else {
            const token = createToken(user);
            res.json({
              token,
              msg: 'You are now registered.',
            })
          }
        })
  } catch (e) {

  }
});

router.patch('/user/:id', async (req, res) => {
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
      if (err) throw new Error('Unable to update user');
      res.json({
        status: res.statusCode,
        msg: 'The user record was updated successfully'
      })
    })
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message
    })
  }
})

router.get('*', (req, res) => {
    res.json ({
        status: 404,
        msg: 'Page not found'
    })
})
//listen is a function that starts the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
