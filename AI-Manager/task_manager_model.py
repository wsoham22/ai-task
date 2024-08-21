import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import string
import nltk
from nltk.corpus import stopwords

# Load dataset
df = pd.read_excel("sample_task_categorization.xlsx")
nltk.download('stopwords')

# Define text cleaning function
def text_cleaning(a):
    remove_punctuation = [char for char in a if char not in string.punctuation]
    remove_punctuation = ''.join(remove_punctuation)
    return [word for word in remove_punctuation.split() if word.lower() not in stopwords.words('english')]

# Vectorize the text data
bow_transformer = CountVectorizer(analyzer=text_cleaning).fit(df['Task'])
title_bow = bow_transformer.transform(df['Task'])

# Transform to TF-IDF
tfidf_transformer = TfidfTransformer().fit(title_bow)
title_tfidf = tfidf_transformer.transform(title_bow)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(title_tfidf, df['Category'], test_size=0.2, random_state=42)

# Train the Multinomial Naive Bayes model
naive_bayes_model = MultinomialNB().fit(X_train, y_train)

# Evaluate the model
accuracy = accuracy_score(y_test, naive_bayes_model.predict(X_test))

# Output the accuracy
print(f'Accuracy of Multinomial Naive Bayes model: {accuracy:.4f}')
