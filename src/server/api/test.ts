import { Router } from "express";
import caddy from "@/middlewares/caddy";

const test = Router()

test.get("/", caddy, (req, res) => {
    console.log(req.caddy)
    res.send("ok")
})

export default test