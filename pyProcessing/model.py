from fastai.tabular.all import *
import pathlib
from statistics import mode

def gen_predict(outputArr, elec_count):

    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

    if elec_count == 4:
        learner = load_learner("pyProcessing\musegoatedbabes.pkl")

    elif elec_count == 8:
        learner = load_learner("pyProcessing\openbcigoatedbabes.pkl")

    dl = learner.dls.test_dl(outputArr)
    onehotencoded, _, preds = learner.get_preds(dl=dl, with_decoded=True)
    pathlib.PosixPath = temp
    if type(preds) == Tensor:
        preds = mode(preds.tolist())

    return preds 
