# # my_django_backend/routing.py
# from django.urls import path
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from my_app.consumers import GameConsumer

# application = ProtocolTypeRouter({
#     # (http->django views is added by default)
#     "websocket": AuthMiddlewareStack(
#         URLRouter([
#             path("ws/game/", GameConsumer.as_asgi()),
#         ])
#     ),
# })


# routing.py
from django.urls import path
from game.consumers import GameConsumer

websocket_urlpatterns = [
    path('ws/game/', GameConsumer.as_asgi()),
]
