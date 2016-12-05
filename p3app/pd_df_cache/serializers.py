from rest_framework import serializers
from p3app.pd_df_cache.models import DataFrameCache

class DataFrameCacheSerializer(serializers.HyperlinkedModelSerializer):
    dataframe = serializers.SerializerMethodField()

    def get_dataframe(self,obj):
        return obj.get_df_json()

    class Meta:
        model = DataFrameCache
        fields = ('id','name','dataframe',)
