import express from "express";
import fs from "fs";
import { promisify } from "util";

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

//new account
router.post("/create/:name/:balance", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    let account = {
      id: data.nextId++,
      name: req.params.name,
      balance: parseFloat(req.params.balance),
    };
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`POST /account/create/:name/:balance - ${JSON.stringify(account)}`);

  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//deposit
router.put("/deposit/:id/:deposit", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));

    let accountId = req.params.id - 1;
    let deposit = req.params.deposit;
    let newBalance =
      parseFloat(deposit) + parseFloat(data.accounts[accountId].balance);

    let account = {
      id: data.accounts[accountId].id,
      name: data.accounts[accountId].name,
      balance: newBalance,
    };

    data.accounts[accountId] = account;
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`PUT /account/deposit/:id/:deposit- " ${JSON.stringify(grade)}`);

  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//account booty 
router.put("/withdraw/:id/:withdraw", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));

    let accountId = req.params.id - 1;
    let withdraw = req.params.withdraw;
    let newBalance =
      parseFloat(data.accounts[accountId].balance) - parseFloat(withdraw);

    if (newBalance >= 0) {
      let account = {
        id: data.accounts[accountId].id,
        name: data.accounts[accountId].name,
        balance: newBalance,
      };

      data.accounts[accountId] = account;
      await writeFile(global.fileName, JSON.stringify(data));

      res.end();
    } else {
      res
        .status(401)
        .send({ error: "valor de saque maior que o valor da conta!" });
    }

    logger.info(`PUT /account/withdraw/:id/:withdraw - " ${JSON.stringify(grade)}`);

  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//account balance
router.get("/consult/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    data.accounts = data.accounts.filter(
      (account) => account.id === parseInt(req.params.id, 10)
    );
    delete data.nextId;

    console.log(data);
    res.send(data);

    logger.info(`GET /account/consult/:id - " ${req.params.id}`);
    
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//delete account
router.delete("/delete/:id", async (req, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    data.accounts = data.accounts.filter(
      (account) => account.id !== parseInt(req.params.id, 10)
    );
    await writeFile(global.fileName, JSON.stringify(data));

    res.end();

    logger.info(`DELETE /account/delete/:id - " ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

//display account
router.get("/", async (_, res) => {
  try {
    const data = JSON.parse(await readFile(global.fileName, "utf8"));
    delete data.nextId;

    console.log(data);
    res.send(data);

    logger.info("GET /account");
    
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
