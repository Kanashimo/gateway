import express from "express"
import { Response } from "@/response"

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.session?.id) return res.status(401).json({
        success: false,
        response: "Expired session or unauthorized"
    } satisfies Response)
    next()
}

export default auth