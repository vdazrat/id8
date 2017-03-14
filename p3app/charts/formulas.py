''' Formulas module used for parsing of  in the Figure model
'''
import pandas as pd

def apply_formula(formula,dataframe):
    ''' Apply a formula on the dataframe and return a new dataframe
    '''
    # This is a rather simple implementation for now.
    # comma separeted columns ~ dep column

    columns = dataframe.columns
    groups = formula.split('~')
    formula_columns = groups[0].split(',')
    if len(groups)>1:
        formula_columns.append(groups[1])
    return dataframe[formula_columns]
