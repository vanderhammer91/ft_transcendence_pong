# my_django_backend/my_django_backend/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import my_django_backend.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_django_backend.settings')

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            my_django_backend.routing.websocket_urlpatterns
        )
    ),
})
