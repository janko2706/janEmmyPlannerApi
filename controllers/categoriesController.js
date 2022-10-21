const prisma = require("../constants/config");
import { DateTime } from "luxon";


const categories_get = async (req, res) => {
  let ctgs;
  try {
    ctgs = await prisma.transactionCategory.findMany();

    if (ctgs) res.status(200).json({ ctgs });
  } catch {
    res.status(400).json({ message: "Something Went Wrong" });
  }
};

const categories_post = async (req, res) => {
  const { name, originalValue } = req.body;
  if (!name) return res.status(400).json({ message: "Please Enter a Name" });
  if (!originalValue) return res.status(400).json({ message: "Please Enter a Budget" });


  try {
    const ctgs = await prisma.transactionCategory.create({
      data: {
        name: name,
        originalValue: originalValue,
        spent: 0,
        leftInBudget: originalValue,
      },
    });
    res.status(201).send( "success" ) ;
  } catch (e) {
    //if error is prisma unique constraint error
    if (e.code === "P2002") {
      res.status(400).json({ message: "Category Already Exists" });
    } else {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  }
};

const category_delete = async (req, res) => {
  const { categoryId } = req.params;
  if (!categoryId)
    return res.status(400).json({ message: "Please Enter a Name" });
  try {
    await prisma.transactionCategory.deleteMany({
      where: {
        id: categoryId,
      },
    });
    res.status(200).json({ message: `Deleted Category with id ${categoryId}` });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something Went Wrong" });
  }
};

const categories_transaction_sum = async (req, res) => {
  let firstDate = req.query.first;
  let lastDate = DateTime.now().toISO();

  if (!firstDate) {
    firstDate = DateTime.now().minus({ month: 1 }).toISO();
  }

  try {
    const transactions = await prisma.transaction.groupBy({
      by: ["transactionCategoryId"],
      _sum: {
        money: true,
      },
      where: {
        date: {
          gte: firstDate,
          lt: lastDate,
        },
      },
    });

    const categories = await prisma.transactionCategory.findMany();

    const categoriesWithSum = categories.map((category) => {
      const transaction = transactions.find(
        (transaction) => transaction.transactionCategoryId === category.id
      );

      return {
        ...category,
        sum: transaction ? transaction._sum.money : 0,
      };
    });

    res.status(200).json(categoriesWithSum);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something Went Wrong" });
  }
};

export {
  categories_get,
  categories_transaction_sum,
  categories_post,
  category_delete,
};
