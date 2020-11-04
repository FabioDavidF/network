
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('create', views.createPost, name='create_post'),
    path('posts/<kind>', views.getPosts, name='get_posts'),
    path('get-url/<user>', views.getUrl, name='get_url'),
    path('user/<profile_name>', views.viewProfile, name='view_profile')
]
