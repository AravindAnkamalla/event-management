import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  upsertUser,
} from "../controllers/admin/user.controller";
const adminRoutes: Router = Router();

adminRoutes.post("/create-user", authenticate, authorize('ADMIN'), createUser);
adminRoutes.get("/users", authenticate, authorize('ADMIN'), getUsers);
adminRoutes.get("/users/:userId/details", authenticate, authorize('ADMIN'), getUserById);
adminRoutes.post("/users/upsert", authenticate, authorize('ADMIN'), upsertUser);
adminRoutes.delete(
  "/users/:userId/delete",
  authenticate,
  authorize,
  deleteUser
);
export default adminRoutes;
