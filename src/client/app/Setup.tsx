import { useState, useEffect } from "react"
import { startRegistration } from '@simplewebauthn/browser'
import { useNavigate } from "react-router"

export default function Setup() {
    const [step, setStep] = useState(0)
    const [username, setUsername] = useState("")
    const [passkeyName, setPasskeyName] = useState("")
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch("/api/setup", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) return navigate("/settings")
            })

        fetch("/api/session", {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setStep(1)
            })
    }, [])

    function registerUser(e: React.SyntheticEvent) {
        e.preventDefault()
        if (username === "") return setError("Username is empty")

        fetch("/api/setup/register", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username
            })
        })
            .then(res => res.json())
            .then(data => {
                if (!data.success) return setError(data.response)
                setStep(1)
            })
            .catch(() => setError("Something went wrong"))
    }

    async function addPasskey(e: React.SyntheticEvent) {
        e.preventDefault()
        if (passkeyName === "") return setError("Passkey's name is empty")

        try {
            const options = await fetch("/api/webauthn/register/options", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: passkeyName
                })
            })
                .then(res => {
                    if (res.status === 401) throw new Error("Session expired, you will have to reset the whole app's database to create the admin account again")
                    return res.json()
                })
                .then(data => {
                    if (!data.success) throw new Error(data.response)
                    return data.response
                })

            const attResp = await startRegistration({ optionsJSON: options })

            await fetch("/api/webauthn/register/verify", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    response: attResp
                })
            })
                .then(res => {
                    if (res.status === 401) throw new Error("Session expired, you will have to reset the whole app's database to create the admin account again")
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

    useEffect(() => {
        setError(null)
    }, [step])

    switch (step) {
        case 0: {
            return (
                <div className="container">
                    {error && <div className="error-container">
                        {error}
                    </div>}
                    <form onSubmit={registerUser}>
                        <input className="input" type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <button className="button" type="submit">register</button>
                    </form>
                </div>
            )
        }
        case 1: {
            return (
                <div className="container">
                    {error && <div className="error-container">
                        {error}
                    </div>}
                    <form onSubmit={addPasskey}>
                        <input className="input" type="text" placeholder="passkey name" value={passkeyName} onChange={(e) => setPasskeyName(e.target.value)} />
                        <button className="button" type="submit">add passkey</button>
                    </form>
                </div>
            )
        }
    }
}