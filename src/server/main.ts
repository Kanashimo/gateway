import express from "express"
import ViteExpress from "vite-express"
import morgan from "morgan"
import cookieSession from "cookie-session"
import crypto from "crypto"
import { parse } from "tldts";

import router from "@/router"
import jsonError from "@/middlewares/json"
import config from "@/config"

const app = express();

app.use(express.json())
app.use(jsonError)
app.use(express.static("public"))

app.set("trust proxy", 1);

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return morgan("tiny")(req, res, next)
  }
  next()
})

app.use(cookieSession({
  name: "session",
  keys: [process.env.NODE_ENV == "production" ? crypto.randomBytes(32).toString("hex") : "dev_cookie_key"],
  maxAge: config.session_duration * 60 * 1000,
  sameSite: "lax",
  domain: "*" + config.domain_cookie
}))

app.use("/api", router)

if (process.env.NODE_ENV == "production") {
  ViteExpress.config({
    verbosity: ViteExpress.Verbosity.Silent
  })
}

const server = app.listen(config.listen_port, () => {
  console.log(`Server is listening on http://127.0.0.1:${config.listen_port}/`);
})

ViteExpress.bind(app, server)
