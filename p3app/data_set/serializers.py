from rest_framework import serializers,reverse
from p3app.data_set.models import DataSet

class DataSetSerializer(serializers.HyperlinkedModelSerializer):
    '''define class attributes from DataSetSerializer
    hyperlinked serielaizer for the DataSet model.
    The data_cache object is translated to a fully qualified url
    '''
    data_cache = serializers.SerializerMethodField('get_data_cache_url')
    api = serializers.SerializerMethodField()


    def get_api(self,obj):
        return reverse.reverse('api:dataset-detail',args=[obj.id],request=self.context['request'])

    def get_data_cache_url(self,obj):
        return reverse.reverse('api:dataframecache-detail',args=[obj.data_cache.id],request=self.context['request'])

    class Meta:
        model = DataSet
        fields = ('id','name','description','frequency','is_csv','source','data_cache','api')