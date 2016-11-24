from rest_framework import serializers,reverse
from .models import DashBoard

class DashBoardSerializer(serializers.HyperlinkedModelSerializer):
    '''define class attributes from DataSetSerializer
    hyperlinked serielaizer for the DashBoard model.
    The data_set object is translated to a fully qualified url

    Need a way to get the cells as well here. Since Cell is an abstract class,
    one way to do it is to have a method in this serializer that determines the inherited model
    and requires a serialiser attribute to defined for the implementing class.
    '''
    dataset = serializers.SerializerMethodField('get_data_set_url')

    def get_data_set_url(self,obj):
        return reverse.reverse('api:dataset-detail',args=[obj.dataset.id],request=self.context['request'])


    class Meta:
        model = DashBoard
        fields = ('id','title','dataset')


