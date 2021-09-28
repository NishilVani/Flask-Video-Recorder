# Flask-Video-Recorder
## #Requirement
Flask, 
flask-cors,
opencv-python

## #What it does 
It Records webcam feed then send it to server and save it to server

## #How to use
Open app.py in your favourite Python IDE, install all the dependencies then run app.py(make sure .html is in templates folder and .js file in static folder). Run app.py then go to browser and open http://127.0.0.1:5000/. It will ask for camera permission allow it. Then click on start recording button, recording will be stopped automatically after 60 seconds or you can do it manualy by clicking Stop Recording button(if you want to stop recording before 60 seconds). Then Click on Send Video button it will send video to server(it take some seconds) and if video is saved successfully to server you will get an alert or if it fails try again
