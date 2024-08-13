import { connection as db } from "../config/index.js";
import { createToken } from "../middleware/AuthenticateUser.js";
import { compare, hash } from "bcrypt";

class Users {
    fetchUsers(req, res) {
    try {
      const strQry = `
        select firstName, lastName, age, emailAdd, userRole, profileURL
        from Users
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
    fetchUser(req, res) {
    try {
      const strQry = `
        select userID, firstName, lastName, age, emailAdd, userRole, profileURL
        from Users 
        where userID = ${req.params.id}
        `;
      db.query(strQry, (err, results) => {
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
    }
     async registerUser(req, res) {
    try {
        let data = req.body;
        data.pwd = await hash(data.pwd, 12);
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
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message,
        });
      }
    }
    async updateUser(req, res) {
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
    }
    deleteUser(req, res) {
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
    }
    async login(req, res) {
    try {
        const { emailAdd, pwd } = req.body;
        const strQry = `
        SELECT userID, firstName, lastName, age, emailAdd, pwd, userRole, profileURL
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
    }
}
export{
    Users
}