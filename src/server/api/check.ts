import { Router } from "express"
import config from "@/config"
import caddy from "@/middlewares/caddy"

const check = Router()

check.get("/", caddy, (req, res) => {
    if (req.session && !req.session.id) {
        req.session.redirect_to = req.caddy.protocol + "://" + req.caddy.host + req.caddy.uri
        return res.redirect(config.domain + "/login")
    }
    return res.sendStatus(200)
})

export default check