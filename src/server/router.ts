import { Router } from "express"

import test from "@/api/test"

const router = Router()

router.use("/test", test)

export default router