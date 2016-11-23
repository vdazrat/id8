from django.test import TestCase
from django.test import RequestFactory
from rest_framework import requests
import json

class TestModels(TestCase):
    def test1(self):
        '''create a dataset from datacache
        '''

class TestViews(TestCase):
    def test1(self):
        '''create a dataset from view
        Do a post request and create the dataset.
        Do a get request on the dataset and verify
        '''
        request = request.post('/api/data-set/',file={'csv_file':open('testcsv.csv','rb')},
        	                   name="TESTDATA",frequency=2,description="lorem ipsum dolor")

        self.assertEqual(request.status,200)
        resp_dict = json.loads(request.text)
        self.assertEqual(resp_dict['name'],"TESTDATA")
        # Test the data_cache attribute
        dc_name = resp_dict['data_cache']['name']
        self.assertEqual(dc_name,"TESTDATA__CACHE")       
