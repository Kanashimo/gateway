import { Response } from "@/response"
import express from "express"

function jsonError(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (err instanceof SyntaxError && "body" in err) {
        return res.status(400).json({
            success: false,
            response: "Invalid request body format or syntax, must be JSON"
        } satisfies Response)
    }
    next(err)
}

export default jsonError