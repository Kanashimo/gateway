import { Router, Request as Req } from "express"
import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse, } from "@simplewebauthn/server"
import schema from "@/middlewares/schema"
import { z } from "zod"
import { prisma } from "@/database"
import auth from "@/middlewares/auth"
import config from "@/config"
import { Response } from "@/response"

const webauthn = Router()

webauthn.post("/register/options", auth, schema({
    body: {
        name: z.string()
    }
}), async (req: Req<any>, res) => {
    const options = await generateRegistrationOptions({
        rpName: "gateway",
        rpID: config.domain.split("://")[1],
        userID: req.session?.id,
        userName: req.session?.username,
        attestationType: "none",
        authenticatorSelection: {
            residentKey: "required",
            userVerification: "required"
        }
    })

    req.session!.challenge = options.challenge
    req.session!.name = req.body.name

    res.json({
        success: true,
        response: options
    } satisfies Response<typeof options>)
})

webauthn.post("/register/verify", schema({
    body: {
        response: z.object()
    }
}), auth, async (req: Req<any>, res) => {
    const verification = await verifyRegistrationResponse({
        response: req.body.response,
        expectedChallenge: req.session?.challenge,
        expectedOrigin: config.domain,
        expectedRPID: config.domain.split("://")[1]
    })

    if (!verification.verified) return res.status(400).json({
        success: false,
        response: "Verification failed"
    } satisfies Response)

    const { id, publicKey, counter } = verification.registrationInfo.credential

    await prisma.key.create({
        data: {
            userId: req.session?.id,
            name: req.session?.name,
            id: Buffer.from(id).toString("base64url"),
            publicKey: Buffer.from(publicKey).toString("base64url"),
            counter
        }
    })

    res.json({
        success: true,
        response: "ok"
    })
})

webauthn.get("/login/options", async (req, res) => {
    const options = await generateAuthenticationOptions({
        userVerification: "required",
        rpID: config.domain.split("://")[1]
    })

    req.session!.challenge = options.challenge

    res.json({
        success: true,
        response: options
    } satisfies Response<typeof options>)
})

webauthn.get("/login/verify", schema({
    body: {
        id: z.string()
    }
}), async (req: Req<any>, res) => {
    const key = await prisma.key.findUnique({
        where: {
            id: req.body.id
        },
        include: {
            user: true
        }
    })

    if (!key) return res.status(400).json({
        success: false,
        response: "Passkey not found"
    } satisfies Response)

    const verification = await verifyAuthenticationResponse({
        response: req.body,
        expectedChallenge: req.session?.challenge,
        expectedOrigin: config.domain,
        expectedRPID: config.domain.split("://")[1],
        credential: {
            id: key.id,
            publicKey: Buffer.from(key.publicKey, "base64url"),
            counter: key.counter
        }
    })

    if (!verification.verified) return res.status(400).json({
        success: false,
        response: "Verification failed"
    } satisfies Response)

    const { newCounter } = verification.authenticationInfo

    await prisma.key.update({
        where: {
            id: key.id
        },
        data: {
            counter: newCounter
        },
    })

    req.session!.id = key.user.id
    req.session!.username = key.user.username

    res.json({
        success: true,
        response: "ok"
    } satisfies Response)
})

export default webauthn