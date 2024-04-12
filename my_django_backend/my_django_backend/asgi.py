# my_django_backend/my_django_backend/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator, AllowedHostsOriginValidator
import my_django_backend.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'my_django_backend.settings')

# Django's ASGI application to handle traditional HTTP requests
django_asgi_app = get_asgi_application()

# Define WebSocket URL patterns from your routing module
websocket_urlpatterns = my_django_backend.routing.websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Handle HTTP requests
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            OriginValidator(
                URLRouter(
                    websocket_urlpatterns
                ),
                # Define allowed origins for WebSocket connections
                allowed_origins=[
                    'http://localhost:3000',
                    'http://10.0.2.15:3000',
                    'http://127.0.0.1:3000',
                    # Add other origins as needed
                ]
            )
        )
    ),
})
