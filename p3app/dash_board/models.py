''' Define models for DashBoards
DashBoards are where charts and and user content as assosited with.
Each dashboard has a cell, which is an ADT. The cell can be extended
to contain any knod of content later.
'''
from django.db import models
from p3app.data_set.models import DataSet

class DashBoard(models.Model):
    title = models.TextField(blank=True,null=True)
    dataset = models.ForeignKey(DataSet)

    def get_cells(self):
        ''' Retrive the cells
        '''
        return self.cell_set.all()


class Cell(models.Model):
    dashboard = models.ForeignKey(DashBoard)
    sequence = models.IntegerField(null=True,blank=True)
    class Meta:
        abstract = True


