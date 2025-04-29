import asyncio
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import Chat, Message
from .serializers import ChatSerializer, ChatCreateSerializer, MessageSerializer
from .services import send_realtime_message
from django.db.models import Max

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return ChatCreateSerializer
        return ChatSerializer

    def get_queryset(self):
        return (
            Chat.objects
            .filter(members=self.request.user)
            .annotate(latest_message_time=Max("messages__timestamp"))
            .order_by("-latest_message_time")  # Latest messages first
            .distinct()
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user not in instance.members.all():
            return Response(
                {"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN
            )

        instance.delete()
        return Response(
            {"detail": "Chat deleted successfully."}, status=status.HTTP_204_NO_CONTENT
        )


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        chat_id = self.request.query_params.get("chat")
        if chat_id:
            return Message.objects.filter(chat_id=chat_id).order_by("timestamp")
        return Message.objects.none()

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)

        room = f"chat_{message.chat.id}"
        type = "chat.massage"
        data = {
            "id": message.id,
            "sender": message.sender.id,
            "content": message.content,
            "timestamp": str(message.timestamp),
        }

        asyncio.run(send_realtime_message(room, type, data))
