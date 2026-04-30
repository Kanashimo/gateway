import { Router } from "express"

import check from "@/api/check"
import webauthn from "@/api/webauth"
import setup from "@/api/setup"
import session from "@/api/session"

const router = Router()

router.use("/check", check)
router.use("/webauthn", webauthn)
router.use("/setup", setup)
router.use("/session", session)

export default router