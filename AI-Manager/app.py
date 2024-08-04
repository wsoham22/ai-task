from flask import Flask, request, jsonify
from flask_cors import CORS
import task_manager_model

app = Flask(__name__)
CORS(app)

# Load the pre-trained transformers and models from task_manager_model
bow_transformer = task_manager_model.bow_transformer
tfidf_transformer = task_manager_model.tfidf_transformer
best_model_name = task_manager_model.best_model['name']
best_model = task_manager_model.best_model['model']

# Define the models dictionary
models = {
    'naive_bayes': task_manager_model.naive_bayes_model,
    'svm': task_manager_model.svm_model,
    'decision_tree': task_manager_model.decision_tree_model,
    'random_forest': task_manager_model.random_forest_model,
    'logistic_regression': task_manager_model.logistic_regression_model
}

@app.route('/api/predict', methods=['POST'])
def predict():
    # Get user input
    user_task = request.json.get('task')
    model_name = request.json.get('model', best_model_name)  # Default to best model if not specified

    # Perform Bag of Words transformation
    bow_transform = bow_transformer.transform([user_task])

    # Perform TF-IDF transformation
    tfidf_transform = tfidf_transformer.transform(bow_transform)

    # Select the model and make prediction
    model = models.get(model_name, best_model)
    prediction = model.predict(tfidf_transform)

    # Return prediction
    return jsonify({'prediction': prediction.tolist(), 'model_used': model_name})

if __name__ == '__main__':
    app.run(debug=True, port=6000)
