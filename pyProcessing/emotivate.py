# WSS (WS over TLS) client example, with a self-signed certificate

import asyncio
import pathlib
import ssl
import websockets
import json 

ssl_context = ssl.create_default_context()
# localhost_pem = pathlib.Path(__file__).with_name("localhost.pem")
# ssl_context.load_verify_locations(localhost_pem)

async def hello():
    uri = "wss://localhost:6868"
    async with websockets.connect(
        uri, ssl=ssl_context
    ) as websocket:
        call = json.dumps({"id":1,"jsonrpc":"2.0","method":"getCortexInfo"})

        await websocket.send(call)
        print(f"> {call}")

        response = await websocket.recv()
        print(f"< {response}")

asyncio.get_event_loop().run_until_complete(hello())