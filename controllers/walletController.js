const prisma = require("../constants/config");

const wallet_get = async (req, res) => {
let ctgs;
try {
    ctgs = await prisma.wallet.findFirst();

    if (ctgs) res.status(200).json( ctgs );
} catch {
    res.status(400).json({ message: "Something Went Wrong" });
}
};

const wallet_post = async (req, res) => {
const { startOfMonthMoney } = req.body;
if (!startOfMonthMoney) return res.status(400).json({ message: "Please Enter the size of the wallet" });
try {
    const ctgs = await prisma.wallet.create({
    data: {
        startOfMonthMoney: startOfMonthMoney,
        spent: 0,
        moneyLeft: startOfMonthMoney,
    },
    });
    res.status(201).json({ ctgs }) ;
} catch (e) {
    //if error is prisma unique constraint error
    if (e.code === "P2002") {
    res.status(400).json({ message: "Wallet Already Exists" });
    } else {
    res.status(400).json({ message: "Something Went Wrong" });
    }
}
};

const wallet_delete = async (req, res) => {
const { walletId } = req.params;
if (!walletId)
    return res.status(400).json({ message: "Please Enter a Name" });
try {
    await prisma.wallet.deleteMany({
    where: {
        id: walletId,
    },
    });
    res.status(200).json({ message: `Deleted wallet with id ${walletId}` });
} catch (e) {
    res.status(400).json({ message: "Something Went Wrong" });
}
};

const wallet_update = async (req, res) => {
const { walletId, spentNow } = req.params;

try {
    const walletUpadate = await prisma.wallet.update({
        where: {
            id: walletId,
        },
        data: {
            spent: {
                increment: spentNow,
            },
            moneyLeft: {
                increment: -spentNow,
            }
        }
    });

    res.status(200).json(walletUpadate);
} catch (e) {
    res.status(400).json({ message: "Something Went Wrong" });
}
};

export {
wallet_get,
wallet_update,
wallet_post,
wallet_delete,
};
