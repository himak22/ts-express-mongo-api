import express from "express";
import { getUserByEmail, createUser } from "../db/users";
import { random, authentication } from "../helpers/index";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body; // Get the email and password from the request body

    if (!email || !password) {
      return res.sendStatus(400); // Bad request
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    ); // Get the user by email

    if (!user) {
      return res.sendStatus(400); // Unauthorized
    }

    const expectedHash = authentication(user.authentication.salt, password); // Hash the password

    if (user.authentication.password !== expectedHash) {
      return res.sendStatus(403); // Unauthorized
    }

    const salt = random(); // Generate a random salt
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    ); // Generate a session token

    await user.save(); // Save the user

    res.cookie("sessionToken", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    }); // Set the session token as a cookie

    return res.status(200).json(user).end(); // OK
  } catch (error) {
    console.error(error);
    return res.sendStatus(400); // Bad request
  }
};
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body; // Get the email, password, and username from the request body

    if (!email || !password || !username) {
      return res.sendStatus(400); // Bad request
    }

    const existingUser = await getUserByEmail(email); // Check if a user with the email already exists

    if (existingUser) {
      return res.sendStatus(409); // Conflict
    }

    const salt = random(); // Generate a random salt
    const user = await createUser({
      // Create a new user
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    }); // Create a new user

    return res.status(200).json(user).end(); // Created
  } catch (error) {
    console.error(error);
    return res.sendStatus(400); // Bad request
  }
};
