import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy 
import brainflow
import pickle 

with open("mockdata\museeeg.pkl", "rb") as infile:
    eeg = pickle.load(infile)

print(len(eeg["finalData"]))