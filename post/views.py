import json
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from post.models import Post, Like, Reply_like
from post.models import reply

@csrf_exempt
def ajax_get_reply(request):
    # POST 요청일 때
    if request.method == 'POST':
        data = json.loads(request.body)
        user = User.objects.get(username=request.user.get_username())
        post = Post.objects.get(post_uuid=data["post_uuid"])
        reply_temp = reply.objects.filter(post_uuid=post).order_by('created_date')
        reply_list = []
        data = {}
        for i in reply_temp:
            reply_user = User.objects.get(username=i.author)
            like = Reply_like.objects.filter(reply_uuid=i.reply_uuid, author=user)
            like_count = Reply_like.objects.filter(reply_uuid=i.reply_uuid).count()
            reply_list.append({"reply_uuid":i.reply_uuid,
                               "reply_text":i.reply_text,
                               "created_date":i.created_date,
                               "user_uuid":reply_user.id,
                               "user_last_name":reply_user.last_name,
                               "user_img": reply_user.first_name,
                               "user_username": reply_user.username,
                               "like_check": len(like) > 0,
                               "like_count":like_count,
                               "my_item_check": reply_user.id == user.id})
        data["reply_list"] = reply_list
        return JsonResponse(data)

@csrf_exempt
def ajax_send_reply(request):
    # POST 요청일 때
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(request.body)
        data["user_id"] = user.id
        data["user_last_name"] = user.last_name
        post = Post.objects.get(post_uuid=data["post_uuid"])
        temp = reply.objects.create(reply_text=data["text"], author=user,post_uuid=post)
        temp = {"reply_uuid": temp.reply_uuid,
                 "reply_text": temp.reply_text,
                 "created_date": temp.created_date,
                 "user_uuid": user.id,
                 "user_username": user.username,
                 "user_last_name": user.last_name,
                 "my_item_check": True}
        return JsonResponse(temp)

@csrf_exempt
def ajax_send_post(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(request.body)
        data["user_id"] = user.id
        data["user_last_name"] = user.last_name
        post = Post.objects.create(author=user,content=data["text"])
        temp = {"uuid": post.post_uuid,"content": post.content,"created_date": post.created_date,"user_id": user.id,"user_last_name": user.last_name,"user_username": user.username,"my_item_check": str(data["userid"]) == str(user.id)}
        return JsonResponse(temp)

@csrf_exempt
def ajax_get_post(request):
    # POST 요청일 때
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        temp = json.loads(request.body)
        data = {}
        url = temp["request_url"].split("/")[-2]
        if url == "newsfeed":
            data["user_id"] = user.id
            data["user_last_name"] = user.last_name
            data["user_username"] = user.username
            data["user_img"] = user.first_name
            s = "SELECT p.post_uuid,p.content,created_date,u.last_name,u.id,u.username,u.first_name " \
                "FROM daytrace.post_post as p " \
                "inner join daytrace.auth_user as u" \
                " on p.author_id = u.id " \
                "order by created_date asc"
        else:
            id = temp["param_id"]
            param_id = User.objects.get(username=id)
            data["user_id"] = param_id.id
            data["user_last_name"] = param_id.last_name
            data["user_username"] = param_id.username
            data["user_img"] = param_id.first_name
            s = "SELECT p.post_uuid,p.content,created_date,u.last_name,u.id,u.username,u.first_name " \
                + "FROM daytrace.post_post as p " \
                + "inner join daytrace.auth_user as u \n" \
                + "on p.author_id = u.id \n" \
                + "where u.id = " + str(param_id.id) \
                + "\norder by created_date asc"

        post_list = []
        for i in Post.objects.raw(s):
            postTemp = Post.objects.get(post_uuid =i.post_uuid)
            like = Like.objects.filter(post_uuid=postTemp, author=user)
            like_count = Like.objects.filter(post_uuid=postTemp).count()
            post_list.append({"uuid": i.post_uuid,
                              "content": i.content,
                              "created_date": i.created_date,
                              "user_id": i.id,
                              "user_last_name": i.last_name,
                              "user_img": i.first_name,
                              "user_username":i.username,
                              "like_check": len(like) > 0,
                              "like_count": like_count,
                              "my_item_check": str(i.id) == str(user.id)})
        data["post_list"] = post_list
    return JsonResponse(data)

@csrf_exempt
def ajax_post_delete(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(request.body)
        Post.objects.get(post_uuid=data["post_uuid"],author=user.id).delete()
        return JsonResponse({})

@csrf_exempt
def ajax_post_send_like(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(request.body)
        post = Post.objects.get(post_uuid=data["post_uuid"])
        like = Like.objects.filter(post_uuid=post, author=user)
        check = None

        if len(like):
            Like.objects.get(post_uuid=post,author=user).delete()
            check = False
        else:
            Like.objects.create(post_uuid=post, author=user)
            check = True
        return JsonResponse({"like_check":check})

@csrf_exempt
def ajax_reply_send_like(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(request.body)
        replyTemp = reply.objects.get(reply_uuid=data["reply_uuid"])
        like = Reply_like.objects.filter(reply_uuid=replyTemp, author=user)
        check = None

        if len(like):
            Reply_like.objects.get(reply_uuid=replyTemp,author=user).delete()
            check = False
        else:
            Reply_like.objects.create(reply_uuid=replyTemp, author=user)
            check = True
        return JsonResponse({"like_check":check})

@csrf_exempt
def ajax_reply_delete(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())
        data = json.loads(request.body)
        reply.objects.get(reply_uuid=data["reply_uuid"],author=user.id).delete()
        return JsonResponse({})

@csrf_exempt
def ajax_post_update(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())

        data = json.loads(request.body)
        Post.objects.filter(author=user,post_uuid=data["post_uuid"]).update(content=data["post_content"])
        return JsonResponse({})

@csrf_exempt
def ajax_reply_update(request):
    if request.method == 'POST':
        user = User.objects.get(username=request.user.get_username())

        data = json.loads(request.body)
        reply.objects.filter(author=user,reply_uuid=data["reply_uuid"]).update(reply_text=data["reply_content"])
        return JsonResponse({})

@csrf_exempt
def ajax_home_start(request):
    if request.method == 'POST':
        temp = {}
        count = 0
        data = json.loads(request.body)
        user = User.objects.get(username=data["param_id"])
        post = Post.objects.filter(author=user)
        Reply = reply.objects.filter(author=user)
        for i in post:
            count += Like.objects.filter(post_uuid=i).count()
        for i in Reply:
            count += Reply_like.objects.filter(reply_uuid=i).count()

        return JsonResponse({"post_reply_count":count})