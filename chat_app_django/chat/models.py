from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Chat(models.Model):
    is_group = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    members = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name if self.is_group else f"Chat {self.id}"

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    attachment = models.FileField(upload_to='chat_attachments/', blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:30]}"
