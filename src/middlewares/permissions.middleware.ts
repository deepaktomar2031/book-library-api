import { Request, Response } from "express";
import { findUser } from "@src/adapters";
import { IUser } from "@src/interfaces";
import { HTTP_STATUS, message, LogErrorMessage } from "@src/utils";
/**
 *
 * @param accessLevel
 * @returns
 */
export const permissionsMiddleware = (accessLevel: string) => {
    return async (req: Request, res: Response, next: Function) => {
        try {
            const result = (await findUser({
                username: req.body.username,
            })) as IUser;

            if (!result) {
                return res.status(HTTP_STATUS.NOT_FOUND).send({
                    successful: true,
                    message: message.User_Not_Found,
                });
            }

            // Check if requesting user exists and has the required role & access level
            if (result.role === req.headers.role && result.role === accessLevel && result.username === req.headers.username) {
                next();
            } else {
                return res.status(HTTP_STATUS.FORBIDDEN).send({
                    successful: true,
                    message: message.User_Forbidden,
                });
            }
        } catch (error: unknown) {
            console.log(LogErrorMessage(error));
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
                successful: false,
                message: message.Something_went_wrong,
            });
        }
    };
};
