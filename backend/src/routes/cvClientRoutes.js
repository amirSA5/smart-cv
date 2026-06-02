import express from "express";
import {
  cloneCvClientVersion,
  createCvClient,
  deleteCvClient,
  duplicateCvClient,
  getAllCvClients,
  getCvClientById,
  getCvClientVersion,
  updateCvClient,
  updateCvClientVersion,
} from "../controllers/cvClientController.js";

const router = express.Router();

router.route("/").get(getAllCvClients).post(createCvClient);
router
  .route("/:id/versions/:lang")
  .get(getCvClientVersion)
  .put(updateCvClientVersion);
router.post("/:id/versions/:fromLang/clone/:toLang", cloneCvClientVersion);
router.route("/:id").get(getCvClientById).put(updateCvClient).delete(deleteCvClient);
router.post("/:id/duplicate", duplicateCvClient);

export default router;
