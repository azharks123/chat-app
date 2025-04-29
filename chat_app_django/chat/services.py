from channels.layers import get_channel_layer

async def send_realtime_message(room, _, data):
    channel_layer = get_channel_layer()
    try:    
        print(room)
        await channel_layer.group_send(
            room,
            {
                "type": 'chat.message',
                "message": data,
            },
        )
        return True
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return False
