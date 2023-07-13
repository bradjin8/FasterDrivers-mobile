from fancy_cherry_36842 import routing as your_app_routing

from .wsgi import *  # add this line to top of your code
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            your_app_routing.websocket_urlpatterns
        )
    ),
})