import { userRouter, express } from './controller/UserController.js';
import { productRouter } from './controller/ProductController.js';
import path from "path";

// Create an express app
const app = express();
const port = +process.env.PORT || 4000;

// Middleware
app.use(
  express.static("./static"),
  express.json(),
  express.urlencoded({
    extended: true,
  })
);

app.use('/users', userRouter)
app.use('products', productRouter)

//router.use(bodyParser.json()); 
// bodypaser is used to parse the body of the request
// Endpoints

app.get("^/$|/eShop", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});


app.get("*", (req, res) => {
  res.json({
    status: 404,
    msg: "Page not found",
  });
});
//listen is a function that starts the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});