import json
from django.contrib.gis.geos import GEOSGeometry

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class DriverLocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = f'driver_location_{self.scope["url_route"]["kwargs"]["driver_id"]}'
        self.room_group_name = f'driver_location_{self.scope["url_route"]["kwargs"]["driver_id"]}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']
        message = text_data_json['message']

        if action == 'update_location':
            # Update driver's location
            await self.update_location(message)
        elif action == 'broadcast_location':
            # Send location update to room group
            await self.broadcast_location(message)

    async def update_location(self, message):
        driver_id = self.scope["url_route"]["kwargs"]["driver_id"]
        new_location = GEOSGeometry(message)

        success = await self.update_driver_location(driver_id, new_location)

        if success:
            await self.broadcast_location(message)
            await self.send(text_data=json.dumps({
                'status': 'success',
                'message': 'Location updated and broadcasted'
            }))
        else:
            await self.send(text_data=json.dumps({
                'status': 'error',
                'message': 'Failed to update location'
            }))

    async def broadcast_location(self, message):
        # Send location update to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'location_update',
                'message': message
            }
        )

    # Receive message from room group
    async def location_update(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @database_sync_to_async
    def update_driver_location(self, driver_id, new_location):
        from users.models import User
        try:
            user = User.objects.get(id=driver_id)
            user.driver.location = new_location
            user.driver.save()
            return True
        except User.DoesNotExist:
            return False