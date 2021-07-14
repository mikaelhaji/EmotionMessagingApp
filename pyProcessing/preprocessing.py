import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy 
import brainflow
import pickle 

with open("mockdata\museeeg.pkl", "rb") as infile:
    eeg = pickle.load(infile)

# order of array [af7, af8, tp9, tp10]
fs = int(eeg["fs"])
input_arr = np.array([x for x in eeg["finalData"]])

print(input_arr.shape)
print("hello world")