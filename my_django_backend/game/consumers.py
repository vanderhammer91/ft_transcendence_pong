import json
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
import random

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.group_name = "game_group"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        
        self.paddles = {"left": {"y": 150}, "right": {"y": 150}}
        self.ball = self.reset_ball()  # Initialize ball with a reset function
        
        asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
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

    def random_velocity(self, min_val, max_val):
        return random.uniform(min_val, max_val) * (1 if random.random() < 0.5 else -1)

    def reset_ball(self):
        """Reset ball to the center of the game area with random velocity."""
        return {
            "x": 300,
            "y": 200,
            "dx": self.random_velocity(3, 5),
            "dy": self.random_velocity(3, 5),
            "radius": 10,
            "color": "white"
        }

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
            self.ball['color'] = "blue"
        elif (self.ball['x'] + self.ball['radius'] >= 580 and 
            self.paddles['right']['y'] <= self.ball['y'] <= self.paddles['right']['y'] + 100):
            self.ball['dx'] = -abs(self.ball['dx']) * 1.1  # Ensure dx is negative and increase speed slightly
            self.ball['color'] = "red"

        # Reset ball if it passes beyond the paddles into the goal areas
        if self.ball['x'] - self.ball['radius'] < 0 or self.ball['x'] + self.ball['radius'] > 600:
            self.reset_ball_position()


    def reset_ball_position(self):
        """Resets the ball to the center of the game area with a new random velocity."""
        self.ball['x'] = 300
        self.ball['y'] = 200
        self.ball['dx'] = self.random_velocity(3, 5)
        self.ball['dy'] = self.random_velocity(3, 5)
        self.ball['color'] = "white"


    async def send_paddle_update(self, event):
        await self.send(json.dumps({'paddles': event['paddles']}))

    async def send_ball_update(self, event):
        await self.send(json.dumps({'ball': event['ball']}))
