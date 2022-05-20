import json

from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from post.models import Post

def start(request):
    if not request.session.session_key:
        return redirect("login")
    res = {"user_name":request.user.get_full_name(),
           "index":"home",
           "my_check":True}
    return redirect("/home/"+request.user.get_username(),res)

def index(request,param):
    if not request.session.session_key:
        return redirect("login")
    res = {"user_name":request.user.get_full_name(),
           "index":"home",
           "my_check":param == request.user.get_username(),
           "id" : param,}
    return render(request,'main/index.html',res)


def messenger(request):
    if not request.session.session_key:
        return redirect("login")
    res = {"index":"messenger"}
    return render(request, 'main/messenger.html', res)

def post_reply_pop(request):
    return render(request, 'main/post_reply_pop.html')

@csrf_exempt
def ajax_user_img_upload(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        file = request.FILES["file"]
        path = "static/user_img/"
        fs = FileSystemStorage(location=path, base_url=path)
        if user.first_name:
            s = user.first_name[len(path):]
            FileSystemStorage(location='static/user_img', base_url='static/user_img').delete(s)
        filename = fs.save(file.name, file)
        uploaded_file_url = fs.url(filename)
        User.objects.filter(id=user.id).update(first_name=uploaded_file_url)
        return JsonResponse({})

def newsfeed(request):
    if not request.session.session_key:
        return redirect("login")
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