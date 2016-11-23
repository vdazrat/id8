from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from p3app.pd_df_cache import views

urlpatterns = [
    url(r'^(?P<pk>[0-9]+)/$', views.DataFrameCacheDetailView.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)