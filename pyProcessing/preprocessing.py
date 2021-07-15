import numpy as np
# import pandas as pd
import matplotlib.pyplot as plt
import scipy 
# import brainflow
import pickle


with open('mockdata/openbci.pkl', 'rb') as f: # mockdata/museeeg.pkl

    data = pickle.load(f)

fs = int(data["fs"])
input_arr = np.array([x for x in data["finalData"]])
k = 5 # Frame Length of Epoch
shift = 2 # The Time that Separates the beginning and the start of two successive frames of the eeg trial

print(input_arr.shape[1]/fs)
print(int(((input_arr.shape[1]/fs-k)/shift)+1))

instF = [] 
for n in range(int(((input_arr.shape[1]/fs-k)/shift)+1)):
    instF.append((input_arr[:,n*shift*fs:(n*shift+k)*fs]))

print(np.array(instF).shape)


# print(data)










#K=5, k=2
