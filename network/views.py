import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from datetime import datetime
from .models import User, Post, Comment


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def createPost(request):
    if request.method == 'POST':
        #Getting the datetime not to show the seconds and microseconds
        time = datetime.now()
        post_time = time.strftime('%b %d, %H:%M')
        post_data = json.loads(request.body)
        post_body = post_data.get('post_content')
        post = Post(
            author=request.user,
            body=post_body,
            time=post_time
        )
        post.save()
        return JsonResponse({'message': 'Post posted successfully.'}, status=201)

    else:
        return JsonResponse({'error': 'POST request required.'}, status=400)


def getPosts(request, kind):
    if request.method != 'GET':
        return JsonResponse({'error': 'GET request required.'}, status=400)
    else:
        if kind =='all':
            posts = Post.objects.all()
            posts = posts.order_by('-time').all()
            dict_list = []
            for post in posts:
                new_post = post.serialize()
                dict_list.append(new_post)
            return JsonResponse(dict_list, safe=False)
        elif kind == 'following':
            dict_list = []   
            for user in request.user.following.all():
                posts = Post.objects.filter(author=user)
                for post in posts:
                    dic = post.serialize()
                    dict_list.append(dic)
            
            return JsonResponse(dict_list, safe=False)
        else:
            return JsonResponse({'error': 'Invalid posts kind, use /all or /following.'}, status=400)

def viewProfile(request, profile_name):
    user = User.objects.get(username=profile_name)

    objects = Post.objects.filter(author=user.id).order_by('-time')
    posts = []
    for post in objects:
        serialized_post = post.serialize()
        posts.append(serialized_post)
    
    followers = user.followers.count()
    following = user.following.count()
    return render(request, 'network/profile.html', {
        'username': user.username,
        'followers_count': followers,
        'following_count': following,
        'posts': posts,
        'followers': user.followers
    })

def getUrl(request, user):
    username = User.objects.get(username=user).username
    url = reverse('view_profile', kwargs={'profile_name': username})
    return JsonResponse({'url': url})

def follow(request, profile_name):
    user_object = User.objects.get(username=profile_name)
    
    if request.method == 'PUT':
        print(request.user)
        data = json.loads(request.body)

        if data.get('follow') == True:
            followers_set = user_object.followers
            followers_set.add(request.user)
            user_object.save()
            return JsonResponse({'status': 'success'}, status=204)
            
        if data.get('follow') == False:
            followers_set = user_object.followers
            followers_set.exclude(username=request.user.username)
            user_object.save()
            return HttpResponse(status=204)

        else:
            return JsonResponse({'error': 'Invalid body, use read=true or false'})
    else:
        return JsonResponse({'error': 'Invalid request method, use PUT'})

def unfollow(request, user):
    pass
    