from rest_framework import serializers
from p3app.pd_df_cache.models import DataFrameCache

class DataFrameCacheSerializer(serializers.HyperlinkedModelSerializer):
    dataframe = serializers.JSONField(source='get_df_json')
    class Meta:
        model = DataFrameCache
        fields = ('id','name','dataframe',)
