import express from "express";
import * as walletController from "../controllers/walletController.js";

const router = express.Router();

router.post("/wallet", walletController.wallet_post);
router.get("/wallet", walletController.wallet_get);
router.delete(
  "/wallet/delete/:walletId",
  walletController.wallet_delete
);
router.patch("/transactions", walletController.wallet_update);

export default router;
