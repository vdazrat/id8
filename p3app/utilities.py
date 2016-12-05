''' Utilitiy functions
Some utilities that is to be commonly used across the project
'''

def p3_import(module,attr):
    ''' import an object dynamically via a string for path, and attr for the attr name
    '''
    components = module.split('.')
    mod = __import__(module)
    for comp in components[1:]:
        mod = getattr(mod, comp)
    return getattr(mod,attr)