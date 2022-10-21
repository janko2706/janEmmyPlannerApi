const prisma = require("../constants/config");
import { DateTime } from "luxon";

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
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const transactions_get = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany();

    if (transactions) res.status(200).json({ transactions });
  } catch (e) {
    res.status(500).json({ message: {e} });
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
    console.log(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export { transaction_post, transactions_get, transaction_delete };
