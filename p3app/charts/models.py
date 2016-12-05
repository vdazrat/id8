from django.db import models
from p3app.dash_board.models import Cell
from p3app.data_set.models import DataSet
from p3app.charts import formulas

class TextData(models.Model):
    cell = models.OneToOneField(Cell,null=True,related_name='textdata')
    description = models.TextField(null=True,blank=True)

    def get_serializer(self):
        return 'p3app.charts.serializers','TextDataSerializer'

class Chart(models.Model):
    
    CHART_TYPES = (
                      ('pie','pie'),
                       ('donut','donut'),
                       ('hist','hist'),
                       ('bar','bar'),
                       ('scatter','scatter'),
                       ('time','time'),
                      )

    cell = models.OneToOneField(Cell,null=True,related_name='charts')
    title = models.TextField(null=True,blank=True)
    xlabel = models.TextField(null=True,blank=True)
    ylabel = models.TextField(null=True,blank=True)
    chart_type = models.CharField(max_length=20,
                                  choices=CHART_TYPES)

    def get_serializer(self):
        return 'p3app.charts.serializers','ChartSerializer'

class Figure(models.Model):
    formula = models.TextField()
    chart = models.ForeignKey(Chart,null=True)

    def get_figure_dataframe(self,format='json'):
        '''Apply the formula on the dataset and return the resulting dataframe
        '''
        df =  formulas.apply_formula(self.formula,
                self.chart.cell.dashboard.dataset.data_cache.get_dataframe())
        if format == 'json':
            return df.to_json()

        return df

