import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        # Your initial states
        self.paddles = {
            "left": {"y": 200},
            "right": {"y": 200},
        }
        
        self.ball = {
            "x": 500,
            "y": 250,
            "dx": self.random_velocity(3, 5),
            "dy": self.random_velocity(3, 5),
            "radius": 10,
        }

        # Start the game loop
        asyncio.get_event_loop().create_task(self.game_loop())

    async def disconnect(self, close_code):
        # Handle disconnect
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        deltaY = text_data_json['deltaY']

        # Update paddle position based on message
        # You'll need to adjust this to handle identifying which paddle to move
        # This is a simplified example
        self.paddles["left"]["y"] += deltaY
        # Emit paddle update to client
        await self.send(text_data=json.dumps({"paddles": self.paddles}))

    def random_velocity(self, min, max):
        velocity = random.uniform(min, max)
        return velocity if random.random() < 0.5 else -velocity

    async def game_loop(self):
        while True:
            # Your game logic here, similar to `updateBallPosition`
            # Remember to `await asyncio.sleep(1/60)` to control the loop timing
            await asyncio.sleep(1/60)  # This simulates your game's frame rate

            # Example: emit ball position update
            await self.send(text_data=json.dumps({"ball": self.ball}))
