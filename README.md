# 𓆝 𓆟 𓆞 𓆝 𓆟

Self-hosted FIDO2/WebAuthn and authentication gateway for Caddy. 

## About
That's my last project for Flavortown, shipped just right before the end. I wanted to make something like that for the last year, but I couldn't find the right time and mood. But now, here I am. Because I was speedrunning this project before Flavortown ends, a lot of things aren't implemented yet, but I'm planning to add them in future:
- multiple users
- invites
- TOTP-based passwordless authentication
- GitHub and (maybe) Discord for authentication
- Support for nginx and traefik

For now basic setup and WebAuthn authentication is implemented

If you want to register, go to `/setup` and to login use `/login`

## Running
The recommended way of running **gateway** is via **Docker container**
```yml
services:
  gateway:
    image: ghcr.io/kanashimo/gateway:latest
    restart: always
    volumes:
      - ./gateway-data:/app/data
    ports:
      - 3000:3000
networks: {}
```

## Caddyfile
Use `forward_auth` directive with `uri /api/check` and `copy_headers Cookies`
```caddyfile
super-secret-app.example.com {
    forward_auth localhost:3000 {
        uri /api/check
        copy_headers Cookies
    }
    
    reverse_proxy localhost:1234
}

gateway.example.com {
    reverse_proxy localhost:3000
}
```

## Configuration
| Variable               | Default                   | Description                                                               |
|------------------------|---------------------------|---------------------------------------------------------------------------|
| `LISTEN_PORT`          | `3000`                    | Server's listen port                                                      |
| `SESSION_DURATION`     | `60`                      | Session duration in minutes.                                              |
| `DOMAIN`               | `http://localhost:3000`   | Domain on which application is served on                                  |
| `DOMAIN_COOKIE`        | `localhost`               | Domain on which application is served on, but without protocol, port etc. |

## License
Released under the MIT license.
