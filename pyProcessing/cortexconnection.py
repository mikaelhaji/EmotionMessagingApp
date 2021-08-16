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
import time
        
# create the Flask app
app = Flask(__name__) # static_url_path=('/Users/anush/AppData/Local/Temp')
CORS(app)
socketio = SocketIO(app)

@app.route('/auth', methods=['POST', 'GET']) # add into another python file with different interpetor, send data to this flask server
def auth():
    if request.method == 'POST':

        request_data = request.get_json()

        user = {
                # "license" : "your emotivpro license, which could use for third party app",
                "client_id": "vZBMOf14yce3Vxe5UXzzXpZexee86PDC1Iq5nSrC",
                "client_secret": "hLyAJyTACwukQTMlpU97NKWxwoK4jkfguFa9TBJbv9ybsaWV3NLpXaZKtlwpgxVACK6QYp5XrYDOPtPDxWeBcsWCTzltK329kHsWGhBS6WcSGJkUVlnHVKFyMmdTiANZ",
                "debit" : 100
            }

        cxinstance = Cortex(user)

        # Do prepare steps
        cxinstance.do_prepare_steps()
        cxinstance.sub_request(['pow'])
        
        i = 0
        while i < 5:
            time.sleep(2)
            cxinstance.collect_newSample()
            i += 1

        preds = [1,2,3,4,5]
        
        return json.dumps(preds) # list(preds)

    return 'Classifying emotions'

# if __name__ == '__main__':
#     # run app in debug mode on port 5000
#     # app.run(debug=True, port=5000)
#     socketio.run(app, port=5001)