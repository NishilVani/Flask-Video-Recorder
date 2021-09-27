from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
app.secret_key = 'Top_Secret'

UPLOAD_VID = 'mysite/vid/'
app.config["UPLOAD_VID"] = UPLOAD_VID

CORS(app)

file = open("text.txt",'w')

@app.route('/', methods = ["GET", "POST"])
def main():
    return  render_template("index.html")

@app.route('/video', methods = ["POST"])
def video():
    length = request.form['Time']
    fps = int(len(request.files)/int(length))
    if request.files:
        if 'frame0' in request.files:
            frame = request.files['frame0']

            frame = np.fromfile(frame, np.uint8)
            frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)

            height, width, channels = frame.shape
            size = (width, height)
            result = cv2.VideoWriter('filename.mp4',
                                     cv2.VideoWriter_fourcc(*'XVID'),
                                     fps, size)
            result.write(frame)
            for frame_no in range(1, len(request.files)):
                frame = request.files['frame'+str(frame_no)]
                frame = np.fromfile(frame, np.uint8)
                frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)
                result.write(frame)
            result.release()
            return jsonify('Video Saved')
    return jsonify('Something went Wrong!')


if "__main__" == __name__:
    app.run(debug=True)