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
k = 5
shift = 2

print(input_arr.shape[1]/fs)
print(int(((input_arr.shape[1]/fs-k)/shift)+1))

instF = []
for n in range(int(((input_arr.shape[1]/fs-k)/shift)+1)):
    instF.append(input_arr[:, n*shift*fs:(n*shift+k)*fs])

print(np.array(instF).shape)