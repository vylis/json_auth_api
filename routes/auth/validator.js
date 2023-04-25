import fs from "fs";

export function validator(req, res, next) {
  const db = JSON.parse(fs.readFileSync("./config/db.json"));

  let username = req.body.username;
  let password = req.body.password;
  let searchUser = db.find((user) => user.username === username);
  if (username === "" || password === "" || username === null || password === null) {
    let err = new Error(JSON.stringify({ msg: "Username or password is empty" }));
    err.statusCode = 400;
    res.status(400).json({ msg: "Username or password is empty" });
    return next(err);
  }

  if (searchUser) {
    let err = new Error(JSON.stringify({ msg: "User already exists" }));
    err.statusCode = 400;
    res.status(400).json({ msg: "User already exists" });
    return next(err);
  }

  next();
}

export function validatorLogin(req, res, next) {
  const db = JSON.parse(fs.readFileSync("./config/db.json"));

  let username = req.body.username;
  let password = req.body.password;
  let searchUser = db.find((user) => user.username === username);

  if (username === "" || password === "" || username === null || password === null) {
    let err = new Error(JSON.stringify({ msg: "Username or password is empty" }));
    err.statusCode = 400;
    res.status(400).json({ msg: "Username or password is empty" });
    return next(err);
  }

  if (!searchUser) {
    let err = new Error(JSON.stringify({ msg: "Credentials not matching DB" }));
    err.statusCode = 400;
    res.status(400).json({ msg: "Credentials not matching DB" });
    return next(err);
  }

  next();
}
export default validator;
