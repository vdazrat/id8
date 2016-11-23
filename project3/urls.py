"""project3 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin
from rest_framework import routers
from p3app.pd_df_cache.views import DataFrameCacheViewSet
from p3app.data_set.views import DataSetViewSet
from p3app.pd_df_cache.views import DataFrameCacheDetailView
import p3app.views as p3appviews
from django.contrib.auth import views as auth_views



router = routers.SimpleRouter()
router.register(r'dfcache',DataFrameCacheViewSet)
router.register(r'dataset',DataSetViewSet)

urlpatterns = [

    url(r'^banner/',p3appviews.banner,name="banner_view"),
    url(r'^signin/$',p3appviews.signin,name='login'),
    url(r'^logout/$',p3appviews.logout, name='logout'),
    url(r'^home/$',p3appviews.home,name='home'),
    url(r'^admin/',admin.site.urls),
    #url(r'^api/dfcache/',include('p3app.pd_df_cache.urls',namespace='pd_df_cache')),
    url(r'^api/',include(router.urls,namespace='api')),
    #url(r'^api/data_set', include('p3app.data_set.urls')),
    url(r'^test/$',DataFrameCacheDetailView.as_view(),name="tests"),
]
