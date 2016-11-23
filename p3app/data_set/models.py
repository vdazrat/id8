from django.db import models
from p3app.pd_df_cache.models import DataFrameCache 

class DataSet(models.Model):

    '''Define a dataset instance
    '''
    name = models.CharField(max_length=2000,null=True)
    frequency = models.IntegerField(blank=True,null=True)
    # source is stored as a textfield, can add validations for REST API specification later.
    source = models.TextField(blank=True,null=True)
    # if from_csv is True, source is the file name of the csv file that was uploaded
    is_csv = models.BooleanField(default=True)
    description = models.TextField(blank=True,null=True)
    data_cache = models.ForeignKey(DataFrameCache,null=True)


    # Instance methods
    def refresh_data_set():
        pass