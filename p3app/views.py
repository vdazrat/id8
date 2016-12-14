from django.http import HttpResponse,HttpResponseRedirect
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.contrib import auth
from django.contrib.auth import authenticate
from p3app.dash_board.models import DashBoard
from p3app.data_set.models import DataSet

from rest_framework import reverse
import json

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
    ''' Main view for the app
    Renders template home.html. The initial state is defined in base.html
    '''

    '''subItems for the ui state: 
    subItems:[{title:'',api:''},{title:'',api:''}]
    '''

    # get data for dashboards
    dbs = [{"title":dashboard.title,
            "api":reverse.reverse('api:dashboard-detail',args=[dashboard.id],request=request) }
            for dashboard in DashBoard.objects.all() ]

    # get the data for datasets
    datasets = [{"title":dataset.name,
            "api":reverse.reverse('api:dataset-detail',args=[dataset.id],request=request) }
            for dataset in DataSet.objects.all() ]

    dashboard_urls = json.dumps(dbs)
    dataset_urls = json.dumps(datasets)
    template = loader.get_template('p3app/home.html')
    return HttpResponse(template.render({"dashboards":dashboard_urls,"datasets":dataset_urls},request))

def logout(request):
    auth.logout(request)
    return HttpResponseRedirect('/banner/')