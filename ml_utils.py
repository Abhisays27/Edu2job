import numpy as np

def flatten_data(X):
    """
    This function flattens a 2D array from a
    ColumnTransformer into a 1D array for a Vectorizer.
    """
    return X.ravel()