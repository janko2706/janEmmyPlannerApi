const express = require("express");
const serverless = require("serverless-http");
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const transaction_post = async (req, res) => {
    const { title, money, date, info, transactionCategoryId } = req.body;

    try {
    await prisma.transaction.create({
        data: {
        title: title,
        money: money,
        date: DateTime.fromISO(date).toJSDate(),
        info: info,
        transactionCategoryId: transactionCategoryId,
        },
    });
    res.status(200).send("success");
    } catch (e) {
    res.status(400).json({ message: "Something went wrong" });
    }
};

const transactions_get = async (req, res) => {
    try {
    const transactions = await prisma.transaction.findMany();

    if (transactions) res.status(200).json({ transactions });
    } catch (e) {
    res.status(500).json({ message: "something went wrong" });
    }
};

const transaction_delete = async (req, res) => {
    const transactionId = req.params.transactionId;
    let tr;
    try {
    tr = await prisma.transaction.deleteMany({
        where: {
        id: transactionId,
        },
    });

    res.status(200).send("success");
    } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
    }
};

const categories_get = async (req, res) => {
    let ctgs;
    try {
    ctgs = await prisma.transactionCategory.findFirst().then(result => {
        console.log(result.name)
    }).catch(e => console.log(e)) // await prisma.transactionCategory.findMany();

    if (ctgs) res.status(200).json({ ctgs });
    } catch {
    res.status(400).json({ message: "Something Went Wrong" });
    }
};


const app = express();
const router = express.Router();

router.get("/", (req, res) => {
res.json({
    hello: "hi!"
});
});
// router.post("/category", categoriesController.categories_post);
// router.get("/categories", categories_get);
// router.get("/categories/sum", categoriesController.categories_transaction_sum);
// router.delete(
// "/category/delete/:categoryId",
// categoriesController.category_delete
// );
router.post("/transaction", transaction_post);
router.delete(
"/transaction/delete/:transactionId",
transaction_delete
);
router.get("/transactions", transactions_get);
// router.post("/wallet", walletController.wallet_post);
// router.get("/wallet", walletController.wallet_get);
// router.delete(
// "/wallet/delete/:walletId",
// walletController.wallet_delete
// );
// router.patch("/transactions", walletController.wallet_update);
app.use(`/.netlify/functions`, router);

module.exports = app;
module.exports.handler = serverless(app);

