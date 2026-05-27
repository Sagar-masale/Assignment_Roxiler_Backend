import express from "express"

import protect from "../middleware/authMiddleware.js"
import roleMiddleware from "../middleware/roleMiddleware.js"

import {
  getDashboardData,
  getUsers,
  getStores,
  createUser,
  createStore,
  getUserDetails,
  getStoreOwners,
} from "../controllers/adminController.js"

const router = express.Router()

router.use(protect)
router.use(roleMiddleware("admin"))

router.get("/dashboard", getDashboardData)

router.get("/users", getUsers)

router.get("/stores", getStores)

router.get("/user/:id", getUserDetails)

router.get("/store-owners", getStoreOwners)

router.post("/create-user", createUser)

router.post("/create-store", createStore)

export default router