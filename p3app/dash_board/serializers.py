from rest_framework import serializers,reverse
from .models import DashBoard,Cell
from p3app.utilities import p3_import

class DashBoardSerializer(serializers.HyperlinkedModelSerializer):
    '''define class attributes from DataSetSerializer
    hyperlinked serielaizer for the DashBoard model.
    The data_set object is translated to a fully qualified url

    Need a way to get the cells as well here. Since Cell is an abstract class,
    one way to do it is to have a method in this serializer that determines the inherited model
    and requires a serialiser attribute to defined for the implementing class.
    '''
    dataset = serializers.SerializerMethodField('get_data_set_url')
    cells = serializers.HyperlinkedRelatedField(view_name='api:cell-detail',many=True,read_only=True)
    api = serializers.SerializerMethodField()

    def get_data_set_url(self,obj):
        return reverse.reverse('api:dataset-detail',args=[obj.dataset.id],request=self.context['request'])

    def get_api(self,obj):
        return reverse.reverse('api:dashboard-detail',args=[obj.id],request=self.context['request'])


    class Meta:
        model = DashBoard
        fields = ('id','title','dataset','cells','api')

class CellSerializer(serializers.ModelSerializer):

    
    payload = serializers.SerializerMethodField()

    def get_payload(self,obj):
        ''' Dymaically return a serializer relation
        '''
        cell_obj = obj.get_related_object()
        d_serializer = p3_import(*cell_obj.get_serializer())
        return d_serializer(cell_obj).data


    class Meta:
        model = Cell
        fields = ('id','payload')



