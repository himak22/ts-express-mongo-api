import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // Middleware function to check if a user is the owner of a resource
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const currentUser = get(req, "identity._id") as string; // Get the current user's ID from the request object

    if (!currentUser) {
      return res.sendStatus(403); // Unauthorized
    }

    if (currentUser.toString() !== id) {
      return res.sendStatus(403); // Unauthorized
    }

    next(); // Continue
  } catch (error) {
    console.error(error);
    return res.sendStatus(400); // Bad request
  }
};

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
