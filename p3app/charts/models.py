from django.db import models
from p3app.dash_board.models import Cell,DashBoard
from p3app.data_set.models import DataSet
from p3app.charts import formulas

class TextData(models.Model):
    cell = models.OneToOneField(Cell,null=True,blank=True,related_name='textdata')
    description = models.TextField(null=True,blank=True)

    def append_to_dashboard(self,dashboard,**kwargs):
        ''' Append this object to a dashboard cell'''
        cell = dashboard.append_cell()
        self.cell = cell
        self.save()

    def get_serializer(self):
        return 'p3app.charts.serializers','TextDataSerializer'

class Chart(models.Model):
    
    CHART_TYPES = (
                      ('pie','pie'),
                       ('donut','donut'),
                       ('hist','hist'),
                       ('bar','bar'),
                       ('stackedbar','stackedbar'),
                       ('scatter','scatter'),
                       ('time','time'),
                      )

    cell = models.OneToOneField(Cell,null=True,blank=True,related_name='charts')
    title = models.TextField(null=True,blank=True)
    xlabel = models.TextField(null=True,blank=True)
    ylabel = models.TextField(null=True,blank=True)
    chart_type = models.CharField(max_length=20,
                                  choices=CHART_TYPES)

    def append_to_dashboard(self,dashboard,**kwargs):
        ''' Append this object to a dashboard cell'''

        # check if kwargs has formula
        formula = kwargs.get('formula',None)
        if formula is None:
            raise ChartException('Formula cannot be null')
            
        self.add_figure(formula)
        cell = dashboard.append_cell()
        self.cell = cell
        self.save()    

    def add_figure(self,formula):
        ''' Add a new figure tot the chart'''
        figure = Figure(formula=formula,chart=self)
        figure.save()
        return figure

    def get_serializer(self):
        return 'p3app.charts.serializers','ChartSerializer'

class Figure(models.Model):
    formula = models.TextField()
    chart = models.ForeignKey(Chart,null=True,blank=True)

    def get_figure_dataframe(self,format='json'):
        '''Apply the formula on the dataset and return the resulting dataframe
        '''
        df =  formulas.apply_formula(self.formula,
                self.chart.cell.dashboard.dataset.data_cache.get_dataframe())
        if format == 'json':
            return df.to_json()

        return df



class ChartException(Exception):
    def __init__(self,arg):
        msg = arg

