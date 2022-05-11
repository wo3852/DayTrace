from django.contrib.auth.models import User
from django.shortcuts import render, redirect

from post.models import Post

def index(request):
    if not request.session.session_key:
        return redirect("login")

    # user = User.objects.get(username=request.user.get_username())
    # s = "SELECT p.post_uuid,p.content,p.content,created_date,u.last_name " \
    #     "FROM daytrace.post_post as p " \
    #     "inner join daytrace.auth_user as u" \
    #     " on p.author_id = u.id " \
    #     "where u.id = "+str(+user.id)
    #
    # data = Post.objects.raw(s)
    #
    # res = {"user_name":request.user.get_full_name(),
    #        "index":"home",
    #        "data": data,
    #        "count":len(data)}

    return render(request,'main/index.html')


def messenger(request):
    res = {"index":"messenger"}
    return render(request, 'main/messenger.html', res)

def newsfeed(request):

    user = User.objects.get(username=request.user.get_username())

    s = "SELECT p.post_uuid,p.content,p.content,created_date,u.last_name " \
        "FROM daytrace.post_post as p " \
        "inner join daytrace.auth_user as u" \
        " on p.author_id = u.id " \
        "where u.id != " + str(+user.id)

    data = Post.objects.raw(s)
    res = {"index":"newsfeed",
           "data": data}
    return render(request, 'main/newsfeed.html', res)