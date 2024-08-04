from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
import joblib
import task_manager_model
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load the pre-trained model and transformers
model = task_manager_model.model
bow_transformer = task_manager_model.bow_transformer
tfidf_transformer = task_manager_model.tfidf_transformer

@app.route('/api/predict', methods=['POST'])
def predict():
    # Get user input
    user_task = request.json.get('task')

    # Perform Bag of Words transformation
    bow_transform = bow_transformer.transform([user_task])

    # Perform TF-IDF transformation
    tfidf_transform = tfidf_transformer.transform(bow_transform)

    # Make prediction
    prediction = model.predict(tfidf_transform)

    # Return prediction
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True,port = 6000)
