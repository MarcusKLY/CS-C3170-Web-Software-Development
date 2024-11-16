import { Eta } from "https://deno.land/x/eta@v3.4.0/src/index.ts";
import * as scrypt from "https://deno.land/x/scrypt@v4.3.4/mod.ts";
import * as userService from "./userService.js";
import * as sessionService from "./sessionService.js";

const eta = new Eta({ views: `${Deno.cwd()}/templates/` });

const showRegistrationForm = (c) => c.html(eta.render("registration.eta"));

const registerUser = async (c) => {
  const body = await c.req.parseBody();
  if (body.password !== body.verification) {
    return c.text("The provided passwords did not match.");
  }

  const existingUser = await userService.findUserByEmail(body.email);
  if (existingUser) {
    return c.text(`A user with the email ${body.email} already exists.`);
  }

  const user = {
    id: crypto.randomUUID(),
    email: body.email,
    passwordHash: scrypt.hash(body.password),
  };

  await userService.createUser(user);
  await sessionService.createSession(c, user);
  return c.redirect("/");
};

const showLoginForm = (c) => c.html(eta.render("login.eta"));

const loginUser = async (c) => {
  try {
    const body = await c.req.parseBody();
    console.log(body);

    // Find the user by email
    const user = await userService.findUserByEmail(body.email);
    if (!user) {
      return c.text(`No user with the email ${body.email} exists.`);
    }

    // Verify the password
    const passwordsMatch = await scrypt.verify(body.password, user.passwordHash);
    if (!passwordsMatch) {
      return c.text(`Incorrect password.`);
    }

    // Create a new session for the user
    await sessionService.createSession(c, user);

    // Redirect after successful login
    return c.redirect("/");
  } catch (error) {
    console.error("Error during login:", error);
    // Handle the error and return a response to the user
    return c.text(`Internal Server Error: ${error.message}`, 500);
  }
};

const logoutUser = async (c) => {
  await sessionService.deleteSession(c);
  return c.redirect("/");
};

export { registerUser, showRegistrationForm,	showLoginForm, loginUser,	logoutUser };