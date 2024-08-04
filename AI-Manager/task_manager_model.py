import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import string
import nltk
from nltk.corpus import stopwords

# Load data
df = pd.read_excel("sample_task_categorization.xlsx")
nltk.download('stopwords')

# Define text cleaning function
def text_cleaning(a):
    remove_punctuation = [char for char in a if char not in string.punctuation]
    remove_punctuation = ''.join(remove_punctuation)
    return [word for word in remove_punctuation.split() if word.lower() not in stopwords.words('english')]

# Create bag-of-words transformer
bow_transformer = CountVectorizer(analyzer=text_cleaning).fit(df['Task'])
title_bow = bow_transformer.transform(df['Task'])

# Create TF-IDF transformer
tfidf_transformer = TfidfTransformer().fit(title_bow)
title_tfidf = tfidf_transformer.transform(title_bow)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(title_tfidf, df['Category'], test_size=0.2, random_state=42)

# Train models
naive_bayes_model = MultinomialNB().fit(X_train, y_train)
svm_model = SVC(kernel='linear').fit(X_train, y_train)
decision_tree_model = DecisionTreeClassifier().fit(X_train, y_train)
random_forest_model = RandomForestClassifier().fit(X_train, y_train)
logistic_regression_model = LogisticRegression().fit(X_train, y_train)

# Evaluate models
model_accuracies = {
    'naive_bayes': accuracy_score(y_test, naive_bayes_model.predict(X_test)),
    'svm': accuracy_score(y_test, svm_model.predict(X_test)),
    'decision_tree': accuracy_score(y_test, decision_tree_model.predict(X_test)),
    'random_forest': accuracy_score(y_test, random_forest_model.predict(X_test)),
    'logistic_regression': accuracy_score(y_test, logistic_regression_model.predict(X_test))
}

# Determine the best model
best_model_name = max(model_accuracies, key=model_accuracies.get)
best_model = {
    'name': best_model_name,
    'model': globals()[f'{best_model_name}_model']
}
