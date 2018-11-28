from keras.models import model_from_json
from keras.preprocessing.image import load_img
from keras.preprocessing.image import img_to_array
from keras.applications.inception_v3 import preprocess_input
import numpy as np
import io
import flask
from PIL import Image
from base64 import b64decode
import tensorflow as tf

app = flask.Flask(__name__)
g = tf.Graph()
model = None
categories = []


def load_all():
    global model
    with g.as_default():
        print("Loading model...")
        json_file = open('flask_server/model_architecture.json', 'r')

        loaded_model_json = json_file.read()
        json_file.close()

        model = model_from_json(loaded_model_json)
        model.load_weights('flask_server/model_weights.h5')

        load_categories()

def get_processed_image(binary):
    image = load_img(io.BytesIO(binary), target_size=(299, 299))
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    processed_image = preprocess_input(image.copy())
    return processed_image

        
def load_categories():
    global categories
    with open('flask_server/categories.txt', 'r') as f:
        for category in f:
            categories.append(category.rstrip())
    
        

@app.route("/")
def index():
    return flask.send_from_directory('.', 'index.html')


@app.route("/predict", methods=["POST"])
def predict():
    data = {"success": False, "error": None}
    # ensure an image was properly uploaded to our endpoint
    if flask.request.method == "POST":
        if flask.request.files["image"]:
            # Try reading and formating image
            try:
                binary = flask.request.files["image"].read()
                image = get_processed_image(binary)
            except Exception as e:
                image = None
                data['error'] = str(e)
            # If image valid, predict
            if image is not None:
                try:
                    n = int(flask.request.form['n'])
                except:
                    n = 5
                with g.as_default():
                    predictions = model.predict(image)
                    top_n = (-predictions).argsort(axis=1)[0][:n]
                data["predictions"] = []
                # # Get string categories and append it to predictions
                for i in top_n:
                    data["predictions"].append({"label":categories[i].replace("_", " "), "probability": predictions[0][i]/1.0})
                data["success"] = True
    return flask.jsonify(data)




if __name__ == "__main__":
    load_all()
    app.run(debug=False)

