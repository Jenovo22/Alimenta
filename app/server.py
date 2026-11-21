"""Dual-stack Uvicorn launcher (binds both IPv4 0.0.0.0 and IPv6 :: when available)."""

import os
import socket
import uvicorn


def _bind_dual_stack_sockets(port: int) -> list[socket.socket]:
    sockets: list[socket.socket] = []

    sock4 = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock4.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    sock4.bind(("0.0.0.0", port))
    sock4.listen(2048)
    sockets.append(sock4)

    if socket.has_ipv6:
        try:
            sock6 = socket.socket(socket.AF_INET6, socket.SOCK_STREAM)
            sock6.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock6.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 1)
            sock6.bind(("::", port))
            sock6.listen(2048)
            sockets.append(sock6)
        except OSError:
            pass

    return sockets


def main() -> None:
    port = int(os.getenv("PORT", "8000"))
    explicit_host = os.getenv("HOST")
    if explicit_host:
        uvicorn.run("app.main:app", host=explicit_host, port=port)
        return

    sockets = _bind_dual_stack_sockets(port)
    config = uvicorn.Config("app.main:app", host="0.0.0.0", port=port)
    server = uvicorn.Server(config)
    try:
        server.run(sockets=sockets)
    finally:
        for sock in sockets:
            sock.close()


if __name__ == "__main__":
    main()
