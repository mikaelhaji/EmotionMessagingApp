import numpy as np
# import pandas as pd
import matplotlib.pyplot as plt
import scipy 
import brainflow
import pickle 

with open("mockdata\museeeg.pkl", "rb") as infile:
    eeg = pickle.load(infile)

with open('/Users/mikaelhaji/Desktop/Github/EmotionMessagingApp/mockdata/museeeg.pkl', 'rb') as f: # Use dict.
    data = pickle.load(f)

print(data)
