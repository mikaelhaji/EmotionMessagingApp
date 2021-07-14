# import main Flask class and request object
from flask import Flask, request, jsonify, send_file, abort, send_from_directory
from flask_cors import CORS
import json
import tempfile

# create the Flask app
app = Flask(__name__) # static_url_path=('/Users/anush/AppData/Local/Temp')
CORS(app)

@app.route('/emotions', methods=['POST', 'GET'])
def form_example():
    if request.method == 'POST':

        request_data = request.get_json()

        # print("elapsed time: {}".format(int(int(request_stamps["stop"])-int(request_stamps["startVideo"]))/1000))

        print(len(request_data))

        # Note: when the request objects are saved, page refreshes
        # Note: file.read() returns bin, file.stream returns a spooledtempfile
                
        features = [1,0,1,0]

        return json.dumps(features.tolist())

    return 'Classifying emotions'

@app.route('/sub', methods=['POST', 'GET'])
def json_example():

    return 'sub'

if __name__ == '__main__':
    # run app in debug mode on port 5000
    app.run(debug=True, port=5000)