from django.test import TestCase
from django.test import RequestFactory
import pandas as pd
import numpy as np
from p3app.pd_df_cache.models import *
from p3app.pd_df_cache.views import DataFrameCacheDetailView
class TestDFCache(TestCase):
    def test_models(self):
        print("Testing Models")
        df = pd.DataFrame(np.random.rand(4,3),columns=('A','B','C'))
        dfc = DataFrameCache.create_cache(df,'testcache')
        df2 = dfc.get_dataframe()
        # cleanup the files created by test
        test = [v for i,v in enumerate(df2.columns) if df2.columns[i] == df.columns[i]]
        dfc.delete()
        self.assertEqual(len(test), 3)

    def test_api_view(self):
        print("Testing api view")
        df = pd.DataFrame(np.random.rand(4,3),columns=('A','B','C'))
        dfc = DataFrameCache.create_cache(df,'testcache')
        request = RequestFactory().get('/api/dfcache/')
        view = DataFrameCacheDetailView.as_view()
        response = view(request,pk=dfc.id)
        dfc.delete()
        self.assertEqual(response.status_code, 200)

