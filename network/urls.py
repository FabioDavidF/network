
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('create', views.createPost, name='create_post'),
    path('posts/<kind>/<int:page>', views.getPosts, name='get_posts'),
    path('get-url/<user>', views.getUrl, name='get_url'),
    path('user/<profile_name>', views.viewProfile, name='view_profile'),
    path('user/<profile_name>/follow', views.follow, name='follow'),
    path('user/is-following/<profile_name>', views.isFollowing, name='is_following'),
    path('user/follow-info/<profile_name>', views.followInfo, name='follow_info'),
    path('user/<profile_name>/posts/<int:page>', views.userPosts, name='user_posts'),
    path('user/get-url/<user>', views.getUrl, name='user_get_url'),
    path('get-user', views.getUser, name='get-user'),
    path('user/get-user', views.getUser, name='user-get-user'),
    path('edit/<int:post_id>', views.editPost, name='edit-post'),
    path('user/edit/<int:post_id>', views.editPost, name='edit-post'),
    path('like/<int:post_id>', views.like, name='like'),
    path('user/like/<int:post_id>', views.like, name='user-like'),
    path('has-liked/<int:post_id>', views.hasLiked, name='has-liked'),
    path('user/has-liked/<int:post_id>', views.hasLiked, name='user-has-liked'),
    path('like-info/<int:post_id>', views.likeInfo, name='like-info'),
    path('user/like-info/<int:post_id>', views.likeInfo, name='like-info')
]
