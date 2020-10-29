from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    followers = models.ManyToManyField('self', blank=True, related_name='followers')
    following = models.ManyToManyField('self', blank=True, related_name='following')

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='p_author')
    body = models.TextField(max_length=500)
    time = models.DateTimeField() #Added when creating object with the API
    likes = models.IntegerField(default=0)

class Comment(models.Model):
    post_commented = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='c_post')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='c_author')
    body = models.TextField(max_length=500)
    time = models.DateTimeField() #Added when creating object with the API
    likes = models.IntegerField(default=0)
