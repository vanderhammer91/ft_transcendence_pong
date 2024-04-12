import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random

class GameConsumer(AsyncWebsocketConsumer):
    client_counter = 0  # Class variable to keep track of client count
    client_ids = {}  # Dictionary to store client IDs
    ball = {
        "x": 300,
        "y": 200,
        "dx": 0,
        "dy": 0,
        "radius": 10,
        "color": "white"
    }  # Shared ball state across instances
    paddles = {"left": {"y": 150}, "right": {"y": 150}}  # Shared paddle state

    @classmethod
    def random_velocity(cls, min_val, max_val):
        """Generate a random velocity."""
        return random.uniform(min_val, max_val) * (1 if random.random() < 0.5 else -1)

    @classmethod
    def reset_ball(cls):
        """Reset the ball to the center of the game area with random velocity."""
        cls.ball['x'] = 300
        cls.ball['y'] = 200
        cls.ball['dx'] = cls.random_velocity(3, 5)
        cls.ball['dy'] = cls.random_velocity(3, 5)
        cls.ball['color'] = "white"

    async def connect(self):
        await self.accept()
        self.group_name = "game_group"
        
        # Assign an ID and increment the counter
        self.client_id = GameConsumer.client_counter
        GameConsumer.client_counter += 1
        self.client_ids[self.channel_name] = self.client_id

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        if len(self.client_ids) == 1:  # Reset the ball when the first client connects
            self.reset_ball()

        asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        # Remove the client ID on disconnect
        if self.channel_name in self.client_ids:
            del self.client_ids[self.channel_name]
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        deltaY = data.get('deltaY', 0)
        side = data.get('side', 'left')

        self.paddles[side]['y'] = max(0, min(self.paddles[side]['y'] + deltaY, 300))
        await self.channel_layer.group_send(self.group_name, {
            'type': 'send_paddle_update',
            'paddles': self.paddles
        })

    async def game_loop(self):
        while True:
            await asyncio.sleep(1/60)
            self.update_ball_position()
            await self.channel_layer.group_send(self.group_name, {
                'type': 'send_ball_update',
                'ball': self.ball
            })

    def update_ball_position(self):
        self.ball['x'] += self.ball['dx']
        self.ball['y'] += self.ball['dy']

        # Bounce off top and bottom boundaries
        if self.ball['y'] - self.ball['radius'] <= 0 or self.ball['y'] + self.ball['radius'] >= 400:
            self.ball['dy'] *= -1

        # Check for paddle collisions
        if (self.ball['x'] - self.ball['radius'] <= 20 and 
            self.paddles['left']['y'] <= self.ball['y'] <= self.paddles['left']['y'] + 100):
            self.ball['dx'] = abs(self.ball['dx']) * 1.1  # Ensure dx is positive and increase speed slightly
        elif (self.ball['x'] + self.ball['radius'] >= 550 and 
            self.paddles['right']['y'] <= self.ball['y'] <= self.paddles['right']['y'] + 100):
            self.ball['dx'] = -abs(self.ball['dx']) * 1.1  # Ensure dx is negative and increase speed slightly

        # Reset ball if it passes beyond the paddles into the goal areas
        if self.ball['x'] < 0 or self.ball['x'] > 600:
            self.reset_ball()

    async def send_paddle_update(self, event):
        await self.send(json.dumps({'paddles': event['paddles']}))

    async def send_ball_update(self, event):
        await self.send(json.dumps({'ball': event['ball']}))
