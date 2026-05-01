import { Router, Request as Req } from "express"
import { Response } from "@/response"
import { prisma } from "@/database"
import { z } from "zod"
import schema from "@/middlewares/schema"

const setup = Router()

setup.get("/", async (req, res) => {
    const user = await prisma.user.findMany()
    const key = await prisma.key.findMany()
    if (user.length && key.length) return res.json({
        success: false,
        response: false
    } satisfies Response<boolean>)
    res.json({
        success: true,
        response: true
    } satisfies Response<boolean>)
})

setup.post("/register", schema({
    body: {
        username: z.string()
    }
}), async (req: Req<any>, res) => {
    const user = await prisma.user.findMany()

    if (user.length) return res.json({
        success: false,
        response: "Setup has been finished"
    } satisfies Response)

    try {
        const user = await prisma.user.create({
            data: {
                username: req.body.username
            }
        })

        req.session!.id = user.id
        req.session!.username = user.username

        res.json({
            success: true,
            response: user
        } satisfies Response<typeof user>)
    } catch (e) {
        res.json({
            success: false,
            response: "User with this name already exists in the database"
        } satisfies Response)
    }
})

export default setup