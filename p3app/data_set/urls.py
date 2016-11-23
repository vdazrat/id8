from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from p3app.data_set import views

urlpatterns = [
    url(r'^/$', views.add_data_set),
]

urlpatterns = format_suffix_patterns(urlpatterns)