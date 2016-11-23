from django.shortcuts import render
from p3app.pd_df_cache.models import DataFrameCache 
from p3app.data_set.models import DataSet
import pandas as pd
import numpy as np
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.http import HttpResponse
from rest_framework import permissions
from rest_framework import viewsets,renderers
from rest_framework import status
from p3app.data_set.serializers import DataSetSerializer
from django.core.exceptions import ValidationError
import json

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


# simple view for now, that accepts a csv file and creates a dataset
@csrf_exempt
def add_data_set(request):
    dfjson = '{a:1}'
    if request.method == 'POST':
        csvfile = request.FILES['csv_file']
        df = pd.read_csv(csvfile)
        dfjson = df.to_json()
    return JSONResponse(dfjson,status=200)


class CSRFExemptMixin(object):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super(CSRFExemptMixin, self).dispatch(*args, **kwargs)



class DataSetViewSet(viewsets.ModelViewSet,CSRFExemptMixin):
    queryset = DataSet.objects.all()
    serializer_class = DataSetSerializer
    #permission_classes = [permissions.IsAuthenticatedOrReadOnly,]
    # just for testing, remove this later
    permission_classes = [permissions.AllowAny,]

    # Override the create method to accept file and create a new dataframe cache

    def create(self,request):
        ''' create a new dataset instance
        '''
        csv_file = request.data['csv_file']
        # create a serieliazer from the request.data, which contains
        # name, description, source
        data = request.data
        # create a dataframe cache object
        success = False
        df = None
        if csv_file:
            df = pd.read_csv(csv_file)
        if df is not None:
            dfcache = DataFrameCache.create_cache(df,data.get('name',None) + "__CACHE__NORM__")
            dataset = DataSet(name=data.get('name',None),frequency=data.get('frequency',None),description=data.get('description',None),
            	              is_csv=(csv_file is not None), source=("api" if csv_file is None else "csv"), data_cache=dfcache)
            try:
                dataset.full_clean()
                dataset.save()
                success = True
            except ValidationError as e:
                dfache.delete()
                success = False
            
            ser_dataset = DataSetSerializer(dataset,context={'request':request}).data
        if success:
            return Response(ser_dataset, status=status.HTTP_201_CREATED)
        #ser_dataset.is_valid()
        return Response({'error':'failed to create dataset','msg':e}, status=status.HTTP_400_BAD_REQUEST)


