from django.contrib import auth
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.shortcuts import render, redirect

# 회원가입
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        if User.objects.filter(username=request.POST['username']).exists():
            return render(request, 'main/signup.html', )
        if request.POST['password1'] == request.POST['password2']:
            user = User.objects.create_user(
                                            username=request.POST['username'],
                                            password=request.POST['password1'],
                                            email=request.POST['email'],last_name=request.POST['name'])
            auth.login(request, user)
            res = {"user_id":auth.get_user(request.POST['username'])}
            return redirect('/',res)
        return render(request, 'main/signup.html')
    return render(request, 'main/signup.html')

@csrf_exempt
def login(request):
    auth.logout(request)
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid() :
            # 세션 CREATE/ form.get_user는 User 객체 반환
            auth.login(request, form.get_user())
            return redirect('/')
    return render(request, 'main/login.html')