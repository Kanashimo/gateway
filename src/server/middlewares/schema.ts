import express from "express"
import { z, ZodError } from "zod"

import { Response } from "@/response"

type Schema = {
    body?: z.ZodRawShape,
    query?: z.ZodRawShape
    params?: z.ZodRawShape,
    onError?: (req: express.Request, res: express.Response, err: ZodError) => void | Promise<void>
}

function schema(schema: Schema) {

    const processedSchema = z.object({
        body: schema.body ? z.object(schema.body) : z.any(),
        query: schema.query ? z.object(schema.query) : z.any(),
        params: schema.params ? z.object(schema.params) : z.any(),
    })

    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const result = processedSchema.safeParse({
            body: req.body ?? {},
            query: req.query ?? {},
            params: req.params ?? {}
        })

        if (!result.success) return schema?.onError ? schema?.onError(req, res, result.error) : res.status(400).send({
            success: false,
            response: result.error?.issues[0]?.message ?? "Invalid input"
        } satisfies Response)

        Object.assign(req.query ?? {}, result.data.query ?? {})
        Object.assign(req.params ?? {}, result.data.params ?? {})
        Object.assign(req.body ?? {}, result.data.body ?? {})

        next();
    }
}

export default schema