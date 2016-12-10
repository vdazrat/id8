from django.shortcuts import render
from .serializers import DashBoardSerializer,CellSerializer
from .models import DashBoard,Cell,DashBoardException
from rest_framework import permissions
from rest_framework import viewsets,renderers
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import status
from django.core.urlresolvers import resolve
from urllib.parse import urlparse
from django.urls.exceptions import Resolver404
from django.core.exceptions import ObjectDoesNotExist

from p3app.data_set.models import DataSet


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
    
    def create(self,request):
        '''
           Create needs to be overriden as the dataset field is obtained from a seriializer method field.
           the request here needs to have the following:
           title - the dashboard title
           dataset -  the dataset api path
        '''
        data = request.data
        title = data.get('title',None)
        dataset_api = data.get('dataset',None)
        if title is None or dataset_api is None:
            return Response({'error':'Dashboard needs a title and an existing dataset'}, 
                             status=status.HTTP_400_BAD_REQUEST)

        # Now resolve the dataset api to get the object
        # it does not contain validation to check the if the api is the correct one,
        # it just gets the id for now
        try:
            dataset_id = resolve(urlparse(dataset_api).path).kwargs['pk']
            if dataset_id is None:
                raise DashBoardException("Invalid dataset.")
            dataset = DataSet.objects.get(id=dataset_id)
        except Resolver404:
            return Response({'error':'Dataset not found'}, 
                             status=status.HTTP_400_BAD_REQUEST)
        except DashBoardException as e:
            return Response({'error':e.msg}, 
                             status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error':'Acces denied to dataset or it does not exist'}, 
                             status=status.HTTP_400_BAD_REQUEST)

        dashboard = DashBoard(title=title,dataset=dataset)
        dashboard.save()
        ser_dashboard = DashBoardSerializer(dashboard,context={'request':request}).data
        return Response(ser_dashboard, status=status.HTTP_201_CREATED)
           

class CellViewSet(viewsets.ModelViewSet,CSRFExemptMixin):
    queryset = Cell.objects.all()
    serializer_class = CellSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly,]
    # just for testing, remove this later
    permission_classes = [permissions.AllowAny,]