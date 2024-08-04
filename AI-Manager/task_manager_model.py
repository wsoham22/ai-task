import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
import string
import nltk
from nltk.corpus import stopwords
# Load data
df = pd.read_excel("task_categorization.xlsx")
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

# Train Naive Bayes model
model = MultinomialNB().fit(title_tfidf, df['Category'])

# Make predictions
all_predictions = model.predict(title_tfidf)