''' Define models for DashBoards
DashBoards are where charts and and user content as assosited with.
Each dashboard has a cell, which is an ADT. The cell can be extended
to contain any knod of content later.
'''
from django.db import models
from p3app.data_set.models import DataSet
from rest_framework import reverse


class DashBoard(models.Model):
    title = models.TextField(blank=True,null=True)
    dataset = models.ForeignKey(DataSet)

    def get_cells(self):
        ''' Retrive the cells
        '''
        return self.cell_set.all()

    def append_cell(self):
        ''' append a cell to dashboard'''
        
        # get the max sequence
        next_seq=self.cells.all().aggregate(models.Max('sequence'))['sequence__max']
        new_cell = Cell(dashboard=self,sequence=next_seq+1)
        new_cell.save()
        return new_cell

class Cell(models.Model):
    dashboard = models.ForeignKey(DashBoard,related_name='cells')
    sequence = models.IntegerField(null=True,blank=True)

    def get_related_object(self):
        '''Get the related model instance object for this model via a onetoone relationship.
        '''
        related_models = [f.related_model for f in Cell._meta.get_fields() if(f.one_to_one)]
        related_qs = [cls.objects.filter(cell=self) for cls in related_models if len(cls.objects.filter(cell=self))>0]
        if len(related_qs) > 1:
            raise DashBoardException("Cell data with id %d assosiated with multiple Cell types" %self.id)
        if len(related_qs) < 1:
            raise DashBoardException("Cell data with id %d not assosiated with any Cell types" %self.id)
        if len(related_qs[0]) != 1:
            raise DashBoardException("Cell data with id %d assosiated with multiple instances of same type" %self.id)
        return related_qs[0][0]

    @classmethod
    def get_related_model(cls,name):
        ''' Given a name, get the related model that matches the name
        '''
        c=[ f.related_model for f in cls._meta.get_fields()
               if (f.one_to_one)
               and f.related_model.__name__ == name
          ]
        # There should be one and only one..
        if len(c) != 1:
            return None
        return c[0]


        
 
class DashBoardException(Exception):
    def __init__(self,arg):
        msg = arg



