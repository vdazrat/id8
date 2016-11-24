from django.shortcuts import render
from .serializers import DashBoardSerializer
from .models import DashBoard
from rest_framework import permissions
from rest_framework import viewsets,renderers

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class CSRFExemptMixin(object):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CSRFExemptMixin, self).dispatch(*args, **kwargs)

class DashBoardViewSet(viewsets.ModelViewSet,CSRFExemptMixin):
    queryset = DashBoard.objects.all()
    serializer_class = DashBoardSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly,]
    # just for testing, remove this later
    permission_classes = [permissions.AllowAny,]
