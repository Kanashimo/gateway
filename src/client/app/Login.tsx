import { startAuthentication } from "@simplewebauthn/browser"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router"

export default function Login() {
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        // fetch("/api/setup")
        //     .then(res => res.json())
        //     .then(data => {
        //         if (data.success) navigate("/setup")
        //     })

        fetch("/api/session", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) navigate("/settings")
            })
    }, [])

    async function loginWithPasskey() {
        try {
            const options = await fetch("/api/webauthn/login/options", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) throw new Error(data.response)
                    return data.response
                })

            const assertion = await startAuthentication({ optionsJSON: options })

            await fetch("/api/webauthn/login/verify", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ response: assertion })
            })
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    if (!data.success) throw new Error(data.response)
                    window.location.href = data.response
                })
        } catch (e: any) {
            return setError(e.message || "Something went wrong")
        }
    }

    return (
        <div className="container">
            {error && <div className="error-container">
                {error}
            </div>}
            <button className="button" onClick={loginWithPasskey}>login with passkey</button>
            <div>Don't have account? <Link to="/setup">Create one.</Link></div>
        </div>
    )
}