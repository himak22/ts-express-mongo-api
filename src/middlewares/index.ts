import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Middleware function to check if a user is authenticated
  try {
    const sessionToken = req.cookies["sessionToken"]; // Get the session token from the request cookies

    if (!sessionToken) {
      return res.sendStatus(403); // Unauthorized
    }

    const existingUser = await getUserBySessionToken(sessionToken); // Check if a user with the session token exists

    if (!existingUser) {
      return res.sendStatus(403); // Unauthorized
    }

    merge(req, { identity: existingUser }); // Merge the user into the request object

    return next(); // Continue
  } catch (error) {
    console.error(error);
    return res.sendStatus(400); // Bad request
  }
};
