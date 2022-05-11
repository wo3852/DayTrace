import json

from django.contrib.auth.models import User
from django.http import JsonResponse
# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from post.models import Post


@csrf_exempt
def ajax_send_reply(request):
    # POST 요청일 때
    if request.method == 'POST':
        object = request.body
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(object)
        data["user_id"] = user.id
        data["user_last_name"] = user.last_name
        return JsonResponse(data)

@csrf_exempt
def ajax_send_post(request):
    if request.method == 'POST':
        object = request.body
        print(object)
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(object)
        data["user_id"] = user.id
        data["user_last_name"] = user.last_name
        Post.objects.create(author=user,content=data["text"])
        return JsonResponse(data)

@csrf_exempt
def ajax_get_post(request):
    # POST 요청일 때
    if request.method == 'POST':
        object = request.body
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(object)
        data["user_id"] = user.id
        data["user_last_name"] = user.last_name
        s = "SELECT p.post_uuid,p.content,created_date,u.last_name,u.id "\
            +"FROM daytrace.post_post as p "\
            +"inner join daytrace.auth_user as u \n"\
            +"on p.author_id = u.id \n"\
            +"where u.id = " + str(user.id)\
            +"\norder by created_date DESC"
        post_list = []
        for i in Post.objects.raw(s):
            post_list.append({"uuid":i.post_uuid,
                              "content":i.content,
                              "created_date":i.created_date,
                              "user_id":i.id,
                              "user_last_name":i.last_name})
        data["post_list"] = post_list
        return JsonResponse(data)


@csrf_exempt
def ajax_get_post_newsfeed(request):
    # POST 요청일 때
    if request.method == 'POST':
        object = request.body
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(object)
        data["user_id"] = user.id
        data["user_last_name"] = user.last_name

        s = "SELECT p.post_uuid,p.content,created_date,u.last_name,u.id " \
            "FROM daytrace.post_post as p " \
            "inner join daytrace.auth_user as u" \
            " on p.author_id = u.id " \
            "order by created_date asc"

        post_list = []
        for i in Post.objects.raw(s):
            post_list.append({"uuid":i.post_uuid,
                              "content":i.content,
                              "created_date":i.created_date,
                              "user_id":i.id,
                              "user_last_name":i.last_name})
        data["post_list"] = post_list
        return JsonResponse(data)
