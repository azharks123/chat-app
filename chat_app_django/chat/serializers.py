from rest_framework import serializers
from .models import Chat, Message
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'chat', 'sender', 'content', 'attachment', 'timestamp']

class ChatSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True, read_only=True)
    # messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'is_group', 'name', 'members', 'created_at']
    
class ChatCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'is_group', 'name', 'members', 'created_at']

    def create(self, validated_data):
        members_data = self.initial_data.get('members', [])
        is_group = validated_data.get('is_group', False)

        if not is_group :
            existing_chats = Chat.objects.filter(
                is_group=False,
                members__id=members_data[0]
            ).distinct()

            if existing_chats.exists():
                return existing_chats.first()

        chat = Chat.objects.create(
            is_group=is_group,
            name=validated_data.get('name')
        )

        members_data.append(self.context['request'].user.id)
        chat.members.set(members_data)
        chat.save()
        return chat
