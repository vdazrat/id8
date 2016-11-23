"""define models for dataframe cacheing.

These are the models for pd_df_cache.
This is used for panda chaching and serializing.
This module also contains apis to create a new datacache and delivering it via REST apis via django rest pandas
dataset should be separate.
this only concerns with caching a dataframe, updating and deletion
This shall also have a get view, for getting the dataframe.
as you only need the get from dataframe and not the dataset.
"""

from django.db import models
import pandas as pd;
import numpy as np;
import os
from os.path import join
from project3 import settings
from django.dispatch import receiver


class DataFrameCache(models.Model):

    """define the model fields

    """
    
    name = models.CharField(max_length=2000,null=True)
    df_loc = models.FileField(upload_to=settings.DATAFRAME_PATH,blank=True)

    @classmethod
    def create_cache(cls,dataframe,name,file_name=None): 
        """ class method for creating a cache from a dataframe
        arguments:
        dataframe - a panda dataframe
        name - a human name for the dataframe cache
        """

        # create the dataframe model
        newdf_cache = cls(name=name)
        newdf_cache.save()
        columns = dataframe.columns
        # get the relative path
        relative_path = join(settings.DATAFRAME_PATH,file_name) if file_name else join(settings.DATAFRAME_PATH,str(newdf_cache.id) +'.pkl') 
        path = join(settings.MEDIA_ROOT, relative_path)
        dataframe.to_pickle(path)
        newdf_cache.df_loc.name = relative_path
        
        
        ''' this is probably not required
        for col in columns:
            DataFrameColumn(name=col,df_cache=newdf_cache).save()
        '''
        newdf_cache.save()
        return newdf_cache

    def get_dataframe(self):
        df = pd.read_pickle(join(settings.MEDIA_ROOT,self.df_loc.name))
        return df

    def update_dataframe(self,dataframe=None,name=None):
        if dataframe is not None:
            dataframe.to_pickle(join(settings.MEDIA_ROOT,self.df_loc.name))
        if name is not None:
            self.name = name
        self.save()

    def get_df_json(self):
        ''' Return a json representation of the cached dataframe
        '''
        return self.get_dataframe().to_json()


# Since the above class uses a file field, this needs to be deleted when the instance is deleted.
@receiver(models.signals.post_delete, sender=DataFrameCache)
def auto_delete_file(sender,instance,**kwargs):
    """Deletes file from filesystem
    when corresponding  object is deleted.
    """
    if instance.df_loc:
        if os.path.isfile(instance.df_loc.path):
            os.remove(instance.df_loc.path)

class DataFrameColumn(models.Model):
    
    name = models.CharField(max_length=2000)
    df_cache = models.ForeignKey(DataFrameCache)