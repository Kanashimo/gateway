import { Router } from "express"
import auth from "@/middlewares/auth"
import { Response } from "@/response"

const session = Router()

session.get("/", auth, (req, res) => {
    res.json({
        success: true,
        response: {
            id: req.session?.id,
            username: req.session?.username
        }
    } satisfies Response<{
        id: number,
        username: string
    }>)
})

export default session