from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from p3app.pd_df_cache.serializers import DataFrameCacheSerializer
from p3app.pd_df_cache.models import DataFrameCache
from django.http import Http404
from rest_framework import permissions
from rest_framework import viewsets,renderers


class DataFrameCacheDetailView(APIView):

    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    queryset = DataFrameCache.objects.all()

    def get_object(self,pk):
        try:
            return DataFrameCache.objects.get(pk=pk)
        except DataFrameCache.DoesNotExist:
            raise Http404

    def get(self,request,pk,format=None):
        dfcache = self.get_object(pk)
        serializer = DataFrameCacheSerializer(dfcache)
        return Response(serializer.data)


 # lets create a viewset


class DataFrameCacheViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    """
    queryset = DataFrameCache.objects.all()
    serializer_class = DataFrameCacheSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
