# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.group_name = "game_group"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        self.paddles = {"left": {"y": 200}, "right": {"y": 200}}
        self.ball = {
            "x": 500, "y": 250,
            "dx": self.random_velocity(3, 5),
            "dy": self.random_velocity(3, 5),
            "radius": 10,
        }
        
        asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        deltaY = data.get('deltaY', 0)
        client_id = data.get('clientID')
        
        if client_id is None:
            print("clientID is missing from the received message")
            return

        if client_id % 2 == 0:  # Even IDs control the right paddle
            side = 'right'
        else:  # Odd IDs control the left paddle
            side = 'left'

        self.paddles[side]['y'] += deltaY
        self.paddles[side]['y'] = max(0, min(self.paddles[side]['y'], 400))  # Ensure paddle stays within bounds

        await self.channel_layer.group_send(self.group_name, {
            'type': 'send_paddle_update',
            'paddles': self.paddles
        })

    def random_velocity(self, min_val, max_val):
        velocity = random.uniform(min_val, max_val)
        return velocity if random.random() < 0.5 else -velocity

    async def game_loop(self):
        while True:
            await asyncio.sleep(1/60)  # Run the loop at about 60 FPS
            self.update_ball_position()
            await self.channel_layer.group_send(self.group_name, {
                'type': 'send_ball_update',
                'ball': self.ball
            })

    def update_ball_position(self):
        # Your ball update logic here (similar to Node.js version)
        pass

    # Handlers for group_send events
    async def send_paddle_update(self, event):
        await self.send(json.dumps({'paddles': event['paddles']}))

    async def send_ball_update(self, event):
        await self.send(json.dumps({'ball': event['ball']}))
