from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from typing import List, Dict, Any

router = APIRouter()

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: Dict[str, Any]) -> None:
        data = json.dumps(message)
        for connection in self.active_connections:
            await connection.send_text(data)

manager = ConnectionManager()

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive; ignore any client messages
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Helper used by other services to push events
async def send_event(event: str, payload: Dict[str, Any]) -> None:
    await manager.broadcast({"event": event, "data": payload})
