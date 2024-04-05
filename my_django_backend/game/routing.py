from django.urls import path
from .consumers import GameConsumer  # Adjust based on your actual consumer

websocket_urlpatterns = [
    path('ws/game/', GameConsumer.as_asgi()),
]
