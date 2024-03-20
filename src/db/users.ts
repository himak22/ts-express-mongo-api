import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false }, // Select: false means that this field will not be returned in queries
  },
});

export const UserModel = mongoose.model("User", UserSchema); // Create a model from the schema

export const getUsers = () => UserModel.find(); // Get all users
export const getUserByEmail = (email: string) => UserModel.findOne({ email }); // Get a user by email
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  }); // Get a user by session token
export const getUserById = (id: string) => UserModel.findById(id); // Get a user by ID
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject()); // Create a user
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id); // Delete a user by ID
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true }); // Update a user by ID
