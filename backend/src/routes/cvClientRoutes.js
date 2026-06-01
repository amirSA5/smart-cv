import express from "express";
import {
  createCvClient,
  deleteCvClient,
  duplicateCvClient,
  getAllCvClients,
  getCvClientById,
  updateCvClient,
} from "../controllers/cvClientController.js";

const router = express.Router();

router.route("/").get(getAllCvClients).post(createCvClient);
router.route("/:id").get(getCvClientById).put(updateCvClient).delete(deleteCvClient);
router.post("/:id/duplicate", duplicateCvClient);

export default router;
