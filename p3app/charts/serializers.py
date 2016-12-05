from rest_framework import serializers
from p3app.charts.models import TextData,Chart,Figure

class TextDataSerializer(serializers.ModelSerializer):
    cell_type = serializers.SerializerMethodField()

    def get_cell_type(self,obj):
        return "TextData"

    class Meta:
        model = TextData
        fields = ('cell_type','id','description',)


class ChartSerializer(serializers.ModelSerializer):
    cell_type = serializers.SerializerMethodField()
    figures = serializers.SerializerMethodField()

    def get_cell_type(self,obj):
        return "Chart"

    def get_figures(self,obj):
        figures = Figure.objects.filter(chart=obj)
        ser_figures = [FigureSerializer(figure).data for figure in figures]
        return ser_figures

    class Meta:
        model = Chart
        fields = ('cell_type','id','title','xlabel','ylabel','chart_type','figures')


class FigureSerializer(serializers.ModelSerializer):

    dataframe = serializers.SerializerMethodField()

    def get_dataframe(self,obj):
        return obj.get_figure_dataframe(format='json')

    class Meta:
        model = Figure
        fields = ('id','dataframe')