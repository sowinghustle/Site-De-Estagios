import { Router } from "express";
import * as controller from "./controller";

const routes = Router();

routes.get("", controller.index);
routes.post("", controller.createUser);
routes.get("/:id", controller.getUser);
routes.put("/:id", controller.updatedUser);
routes.delete("/:id", controller.deleteUser);

export default routes;
