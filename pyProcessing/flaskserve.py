# import main Flask class and request object
from flask import Flask, request, jsonify, send_file, abort, send_from_directory
from flask_cors import CORS
import json
import tempfile
import pickle

# create the Flask app
app = Flask(__name__) # static_url_path=('/Users/anush/AppData/Local/Temp')
CORS(app)

@app.route('/emotions', methods=['POST', 'GET'])
def form_example():
    if request.method == 'POST':

        request_data = request.get_json()
        eeg = request_data["data"]
        timestamps = request_data["timestamps"]

        print("elapsed time: {}".format(int(int(timestamps["stop"])-int(timestamps["start"]))/1000))

        # Note: when the request objects are saved, page refreshes
        # Note: file.read() returns bin, file.stream returns a spooledtempfile

        with open(f"museeeg.pkl", "wb") as outfile:
            pickle.dump(eeg, outfile)
        
        with open(f"musetimestamps.pkl", "wb") as outfile:
            pickle.dump(timestamps, outfile)
                
        features = [1,0,1,0]

        return json.dumps(features)

    return 'Classifying emotions'

@app.route('/sub', methods=['POST', 'GET'])
def json_example():

    return 'sub'

if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)