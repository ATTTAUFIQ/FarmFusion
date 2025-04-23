import { NextFunction, Response, Request } from "express";
import asyncHandler from "./AsyncHandler";
import { _402 } from "../customErrors";

/**🔑  Authorized Route
 * @description This middleware is used to authorize the member
 * @overview - this will check for the role of the member and will check if the role is authorized to access the route or not
 * @param roles - array of roles authorized to access the route
 * @returns - next function if the role is authorized to access the route
 * @throws - Unauthorized error if the role is not authorized to access the route
 *
 */

export const routeAuthorized = (roles: string[]) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const permissions = req.permissions;
    const authenticate = hasPermission(roles, permissions);
    if (!authenticate) {
      return res.status(_402).send({ message: "Unauthorized" });
    }
    next();
  });

/**🔑  Has Permissio
 * @return - boolean
 * check from req.permissions if the role is authorized to access the route or not
 */
export const hasPermission = (roles: string[], permissions: string[]) => {
  let authenticate = false;
  roles.forEach((role) => {
    if (permissions.includes(role)) {
      authenticate = true;
      return;
    }
  });
  return authenticate;
};
