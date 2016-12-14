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
from django.core.exceptions import ObjectDoesNotExist,ValidationError

from p3app.data_set.models import DataSet
from rest_framework.decorators import detail_route
from django.shortcuts import get_object_or_404
import pandas as pd


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
        return Response(
            DashBoardSerializer(dashboard,context={'request':request}).data
            , status=status.HTTP_201_CREATED)


    @detail_route(methods=['get'])
    def head(self,request,pk=None):
        queryset = DashBoard.objects.all()
        dashboard = get_object_or_404(queryset, pk=pk)
        dataframe = dashboard.dataset.data_cache.get_dataframe()



        return Response(dataframe.head().to_json())

class CellViewSet(viewsets.ModelViewSet,CSRFExemptMixin):
    queryset = Cell.objects.all()
    serializer_class = CellSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly,]
    # just for testing, remove this later
    permission_classes = [permissions.AllowAny,]

    def create(self,request):
        ''' Create a new cell
        request.data contains:
        type : one of ('TextData','Chart',)
        'TextData'
           description -  A text body
        'Chart'
           ...
        '''
        data = request.data
        dashboard_api = data.get('dashboard',None)

        if dashboard_api is None:
            return Response({'error':'Tried to create a cell on an invalid dashboard.'}, 
                             status=status.HTTP_400_BAD_REQUEST)
        # resolve the dashboard api to get the object
        # it does not contain validation to check the if the api is the correct one,
        # it just gets the id for now
        try:
            dashboard_id = resolve(urlparse(dashboard_api).path).kwargs['pk']
            if dashboard_id is None:
                raise DashBoardException("Invalid dashboard.")
            dashboard = DashBoard.objects.get(id=dashboard_id)
        except Resolver404:
            return Response({'error':'Dashboard not found'}, 
                             status=status.HTTP_400_BAD_REQUEST)
        except DashBoardException as e:
            return Response({'error':e.msg}, 
                             status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error':'Acces denied to Dashboard or it does not exist'}, 
                             status=status.HTTP_400_BAD_REQUEST)


        ModelType = Cell.get_related_model(data.get('type',None))
        if ModelType is None:
            return Response({'error':'Acces denied, invalid Cell type'}, 
                             status=status.HTTP_400_BAD_REQUEST)

        # Get relevant fields for ModelType
        fields_for_cell_model = [field.name for field in ModelType._meta.get_fields()]
        # Extract relevant parameters for the ModelType from data
        params = { name:data[name] for name in data
                      if name in fields_for_cell_model}

        try:
            cell_model = ModelType(**params)
            cell_model.full_clean()

        except ValidationError as e:
            return Response({'error':'Acces denied, invalid field. '+str(e)}, 
                             status=status.HTTP_400_BAD_REQUEST)

        # Now save the modelType
        cell_model.save()
        
        # get other params besides dashboard
        other_params = { name:data[name] for name in data
                               if name != 'dashboard'}
        # and append it to dashboard
        cell_model.append_to_dashboard(dashboard,**other_params)

        # Serialize the cell and return it
        return Response( 
            CellSerializer(cell_model.cell,context={'request':request}).data,
            status=status.HTTP_201_CREATED)

