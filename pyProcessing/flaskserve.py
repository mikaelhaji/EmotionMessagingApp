# import main Flask class and request object
from flask import Flask, request, jsonify, send_file, abort, send_from_directory
from flask_cors import CORS
import json
import tempfile
import pickle
from preprocessing import *
from tqdm import tqdm 
from emotivate import *
from flask_socketio import SocketIO
from cortex import Cortex
from model import * # quick fix, check later
        
# create the Flask app
app = Flask(__name__) # static_url_path=('/Users/anush/AppData/Local/Temp')
CORS(app)
socketio = SocketIO(app)

@app.route('/emotions', methods=['POST', 'GET'])
def pred_serve():
    if request.method == 'POST':

        request_data = request.get_json()
        # eeg = request_data["data"]
        # timestamps = request_data["timestamps"]

        # print("elapsed time: {}".format(int(int(timestamps["stop"])-int(timestamps["start"]))/1000))

        print(len(request_data))
    
        # with open('mockdata\openbci_updated5.pkl', 'rb') as f: # mockdata/museeeg.pkl
        #     data = pickle.load(f)

        fs = int(request_data["fs"])
        batch = 5*fs

        load_data = np.array(request_data["finalData"]).T
        print(load_data.shape)
        elec_count = load_data.shape[1]

        epoched = np.array(np.array_split(load_data[:int(len(load_data)/batch)*batch], int((len(load_data)/batch))))
        print(epoched.shape)

        relevant_trim = collect_batches(epoched, fs)

        outputArr = pd.DataFrame(np.array([[list(flatten(coeff)) for coeff in batch] for batch in tqdm(relevant_trim)]).reshape(len(relevant_trim), elec_count*-1))
        print(outputArr.shape)

        preds = gen_predict(outputArr, elec_count)

        # Note: when the request objects are saved, page refreshes
        # Note: file.read() returns bin, file.stream returns a spooledtempfile

        # with open(f"openbci_updated5.pkl", "wb") as outfile:
        #     pickle.dump(request_data, outfile)
        
        # with open(f"musetimestamps.pkl", "wb") as outfile:
        #     pickle.dump(timestamps, outfile)
                
        # features = [1,0,1,0]

        return json.dumps(preds) # list(preds)

    return 'Classifying emotions'

# @app.route('/auth', methods=['POST', 'GET']) # add into another python file with different interpetor, send data to this flask server
# def auth():
#     if request.method == 'POST':

#         request_data = request.get_json()

#         user = {
#                 # "license" : "your emotivpro license, which could use for third party app",
#                 "client_id": "vZBMOf14yce3Vxe5UXzzXpZexee86PDC1Iq5nSrC",
#                 "client_secret": "hLyAJyTACwukQTMlpU97NKWxwoK4jkfguFa9TBJbv9ybsaWV3NLpXaZKtlwpgxVACK6QYp5XrYDOPtPDxWeBcsWCTzltK329kHsWGhBS6WcSGJkUVlnHVKFyMmdTiANZ",
#                 "debit" : 100
#             }

#         cxinstance = Cortex(user)

#         # Do prepare steps
#         cxinstance.do_prepare_steps()
#         cxinstance.sub_request(['pow'])

#         preds = [1,2,3,4,5]
        
#         return json.dumps(preds) # list(preds)

#     return 'Classifying emotions'

@socketio.on('new_pow_data')
def handle_json(json):
    print('received json: ' + str(json))

@app.route('/p300', methods=['POST', 'GET'])
def p300():
    
    if request.method == 'POST':

        request_data = request.get_json()

        with open(f"sample_p300.pkl", "wb") as outfile:
            pickle.dump(request_data, outfile)

        print(request_data)

        # Create UI for auth stuff

        preds = [1,2,3,4,5]

        
        return json.dumps(preds) # list(preds)

    return 'p300'

# if __name__ == '__main__':
#     # run app in debug mode on port 5000
#     from model import gen_predict
#     # app.run(debug=True, port=5000)
#     socketio.run(app, port=5000)