const morgan = require("morgan");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

app.use(express.json());

const users = [
  {
    name: "John",
    password: "black@cat",
  },
];

app.use(morgan("dev"));

// sign up
app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = {name: req.body.name, password: hashedPassword};
    users.push(user);
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// login
app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user === null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send("Login success");
    } else {
      res.status(401).send("Password incorrect");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// get all users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
