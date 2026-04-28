import express from "express"

type CaddyForwardHeaders = {
    host: string,
    protocol: string,
    uri: string
}

declare module "express-serve-static-core" {
    interface Request {
        caddy: CaddyForwardHeaders
    }
}

function caddy(req: express.Request, res: express.Response, next: express.NextFunction) {

    const host = req.headers["x-forwarded-host"] as string | undefined
    const protocol = req.headers["x-forwarded-proto"] as string | undefined
    const uri = req.headers["x-forwarded-uri"] as string | undefined

    if (!host || !protocol || !uri) {
        console.error("Request has been made but it doesn't containt Caddy-specific headers (x-forwarded-host, x-forwarded-proto, x-forwarded-uri). Make sure you are using Caddy and not any other server, they are not supported.")
        return res.status(400).send("Caddy-specific headers are missing (x-forwarded-host, x-forwarded-proto, x-forwarded-uri). Make sure you are using Caddy and not any other server, they are not supported.")
    }

    if (!req.caddy) req.caddy = {} as CaddyForwardHeaders

    req.caddy.host = host
    req.caddy.protocol = protocol
    req.caddy.uri = uri

    next()
}

export default caddy