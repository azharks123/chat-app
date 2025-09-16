from channels.layers import get_channel_layer

async def send_realtime_notification(room, type, data):
    channel_layer = get_channel_layer()
    try:    
        await channel_layer.group_send(
            room,
            {
                "type": type,
                "message": data,
            },
        )
        return True
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return False