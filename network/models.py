from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self', blank=True, related_name='u_followers', symmetrical=False)
    following = models.ManyToManyField('self', blank=True, related_name='u_following', symmetrical=False)

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='p_author')
    body = models.TextField(max_length=500)
    time = models.TextField() #Added when creating object with the API
    likes = models.ManyToManyField(User, blank=True, related_name='p_likes')

    def serialize(self):
        return {
            'id': self.id,
            'author': self.author.username,
            'body': self.body,
            'time': self.time,
            'likes': self.likes.count()
        }
