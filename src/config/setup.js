import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as Models from "../models/index.js";
import AdminJSFastify from '@adminjs/fastify';
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { dark, light, noSidebar } from '@adminjs/themes';

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
  resources: [
    {
      resource: Models.Customer,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"]
      },
    },
    {
      resource: Models.DeliveryPartner,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"]
      },
    },
    {
      resource: Models.Admin,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"]
      },
    },
    {
      resource: Models.Branch,
    },
    {
      resource: Models.Product,
    },
    {
      resource: Models.Category, 
    },
    {
      resource:Models.Order
    },
    {
      resource:Models.Counter
    }
  ],
  branding: {
    companyName: "marksLona Grocery",
    withMadeWithLove: false,
    favicon: "https://res.cloudinary.com/dpiqqeo8p/image/upload/v1729173925/zkz7ny7ihrnjbamug2q5.png",
    logo: "https://res.cloudinary.com/dpiqqeo8p/image/upload/v1729173925/zkz7ny7ihrnjbamug2q5.png"
  },
  defaultTheme: light.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: '/admin'
});

export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
      cookieName: "adminjs"
    },
    app,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      }
    }
  );
};
