from django.http import HttpResponse,HttpResponseRedirect
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.contrib.auth import authenticate


# Create your views here.

def banner(request):
    template = loader.get_template('p3app/banner.html')
    return HttpResponse(template.render({'test':'rest'},request))


def signin(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/home')
    template = loader.get_template('p3app/signin.html')
    if request.method == 'POST':
        print(request.POST)
        uname = request.POST.get('id_username')
        passw = request.POST.get('id_password')
        user = authenticate(username=uname,password=passw)
        if user:
           auth.login(request, user)
           return HttpResponseRedirect('/home')
    return HttpResponse(template.render({'test':'rest'},request))

@login_required(login_url='/signin/')
def home(request):
    template = loader.get_template('p3app/home.html')
    return HttpResponse(template.render({},request))

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/banner/')