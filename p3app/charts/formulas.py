''' Formulas module used for parsing of  in the Figure model
'''
import pandas as pd

def apply_formula(formula,dataframe):
    ''' Apply a formula on the dataframe and return a new dataframe
    '''
    # This is a rather simple implementation for now.
    columns = dataframe.columns
    formula_columns = formula.split(',')
    return dataframe[formula_columns]
