import { Router } from "express";
import {
    registerMiddleware,
    loginMiddleware,
    authenticationMiddleware,
    permissionsMiddleware,
    addBookValidatorMiddleware,
    bookIsbnValidatorMiddleware,
} from "@src/middlewares";

import { healthCheck, register, login, addBook, removeBook, borrowBook, returnBook } from "@src/controllers";

import { Role } from "@src/utils";

/**
 * Handle all routes
 * @param router
 */
export const routes = (router: Router) => {
    // Health check
    router.get("/api/health", healthCheck);

    // Register new user (Librarian/Customer)
    router.post("/api/register", registerMiddleware, register);

    // Login
    router.post("/api/login", loginMiddleware, login);

    // For Librarian
    router.post("/api/add-book", authenticationMiddleware, permissionsMiddleware(Role.LIBRARIAN), addBookValidatorMiddleware, addBook);
    router.delete("/api/remove-book", authenticationMiddleware, permissionsMiddleware(Role.LIBRARIAN), bookIsbnValidatorMiddleware, removeBook);

    // For Customer
    router.patch("/api/borrow-book", authenticationMiddleware, permissionsMiddleware(Role.CUSTOMER), bookIsbnValidatorMiddleware, borrowBook);
    router.patch("/api/return-book", authenticationMiddleware, permissionsMiddleware(Role.CUSTOMER), bookIsbnValidatorMiddleware, returnBook);
};
