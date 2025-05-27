import pickle
import numpy as np
import pandas as pd
import os
from typing import Dict, List, Union, Tuple

class CybersecurityThreatDetector:
    """
    A class for detecting and classifying cybersecurity threats using trained ML models
    """
    
    def __init__(self, models_dir: str = 'models'):
        """
        Initialize the threat detector by loading the trained models
        
        Args:
            models_dir: Directory containing the saved models
        """
        print("Loading cybersecurity threat detection models...")
        
        # Load models and preprocessing tools
        try:
            with open(os.path.join(models_dir, 'classification_model.pkl'), 'rb') as f:
                self.classification_model = pickle.load(f)
                
            with open(os.path.join(models_dir, 'anomaly_detector.pkl'), 'rb') as f:
                self.anomaly_detector = pickle.load(f)
                
            with open(os.path.join(models_dir, 'scaler.pkl'), 'rb') as f:
                self.scaler = pickle.load(f)
                
            with open(os.path.join(models_dir, 'label_encoder.pkl'), 'rb') as f:
                self.label_encoder = pickle.load(f)
                
            with open(os.path.join(models_dir, 'feature_columns.pkl'), 'rb') as f:
                self.feature_columns = pickle.load(f)
                
            print("Models loaded successfully!")
            
            # Define categorical columns that were used during training
            self.categorical_columns = ['protocol_type', 'service', 'flag']
            
            # Get all possible categorical values from the training data
            # In a real implementation, you would save these during training
            self.categorical_values = {
                'protocol_type': ['tcp', 'udp', 'icmp'],
                'service': ['http', 'ftp', 'smtp', 'ssh', 'dns'],
                'flag': ['SF', 'S0', 'REJ', 'RSTO']
            }
            
        except Exception as e:
            print(f"Error loading models: {str(e)}")
            raise
    
    def preprocess_data(self, data: Dict) -> np.ndarray:
        """
        Preprocess input data for prediction
        
        Args:
            data: Dictionary containing feature values
            
        Returns:
            Preprocessed data as numpy array
        """
        try:
            # Convert input dictionary to DataFrame
            df = pd.DataFrame([data])
            
            # Handle categorical features with one-hot encoding
            df_categorical = pd.get_dummies(df[self.categorical_columns], drop_first=True)
            
            # Make sure all expected columns are present
            for col in self.categorical_columns:
                expected_cols = [f"{col}_{val}" for val in self.categorical_values[col][1:]]
                for exp_col in expected_cols:
                    if exp_col not in df_categorical.columns:
                        df_categorical[exp_col] = 0
            
            # Combine numerical and categorical features
            X = pd.concat([df.drop(self.categorical_columns, axis=1), df_categorical], axis=1)
            X = X.reindex(columns=self.feature_columns, fill_value=0)

            # Apply scaling
            X_scaled = self.scaler.transform(X)
            
            return X_scaled
            
        except Exception as e:
            print(f"Error preprocessing data: {str(e)}")
            raise
    
    def predict(self, data: Dict) -> Dict:
        """
        Predict threat type and anomaly score for input data
        
        Args:
            data: Dictionary containing feature values
            
        Returns:
            Dictionary with prediction results
        """
        try:
            # Preprocess the data
            X = self.preprocess_data(data)
            
            # Get classification prediction
            class_pred_encoded = self.classification_model.predict(X)[0]
            class_pred = self.label_encoder.inverse_transform([class_pred_encoded])[0]
            
            # Get classification probabilities
            class_probs = self.classification_model.predict_proba(X)[0]
            class_names = self.label_encoder.classes_
            class_probabilities = {name: float(prob) for name, prob in zip(class_names, class_probs)}
            
            # Get anomaly score
            anomaly_score = float(self.anomaly_detector.decision_function(X)[0])
            is_anomaly = self.anomaly_detector.predict(X)[0] == -1
            
            # Determine threat level based on classification and anomaly score
            if class_pred == 'normal' and not is_anomaly:
                threat_level = 'low'
            elif class_pred == 'normal' and is_anomaly:
                threat_level = 'medium'
            elif class_pred in ['probe', 'dos']:
                threat_level = 'high'
            elif class_pred in ['r2l', 'u2r']:
                threat_level = 'critical'
            else:
                threat_level = 'unknown'
            
            # Get feature importances for explanation
            if hasattr(self.classification_model, 'feature_importances_'):
                # For models like Random Forest that have feature_importances_
                feature_importances = self.classification_model.feature_importances_
                
                # Get feature names (this would need to match your training data)
                # In a real implementation, you would save these during training
                feature_names = [f"feature_{i}" for i in range(len(feature_importances))]
                
                # Get top 5 most important features
                top_indices = np.argsort(feature_importances)[-5:]
                top_features = [feature_names[i] for i in top_indices]
                top_importances = [float(feature_importances[i]) for i in top_indices]
                
                explanation = {
                    "top_features": top_features,
                    "importance_values": top_importances
                }
            else:
                explanation = {"message": "Feature importance not available for this model"}
            
            # Prepare response
            result = {
                "prediction": class_pred,
                "threat_level": threat_level,
                "class_probabilities": class_probabilities,
                "anomaly_score": anomaly_score,
                "is_anomaly": bool(is_anomaly),
                "explanation": explanation,
                "timestamp": pd.Timestamp.now().isoformat()
            }
            
            return result
            
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return {"error": str(e)}

# Example usage
if __name__ == "__main__":
    # Create a mock input data point
    sample_data = {
        'duration': 0,
        'protocol_type': 'tcp',
        'service': 'http',
        'flag': 'SF',
        'src_bytes': 181,
        'dst_bytes': 5450,
        'land': 0,
        'wrong_fragment': 0,
        'urgent': 0,
        'hot': 0,
        'num_failed_logins': 0,
        'logged_in': 1,
        'num_compromised': 0,
        'root_shell': 0,
        'su_attempted': 0,
        'num_root': 0,
        'num_file_creations': 0,
        'num_shells': 0,
        'num_access_files': 0,
        'num_outbound_cmds': 0,
        'is_host_login': 0,
        'is_guest_login': 0,
        'count': 8,
        'srv_count': 8,
        'serror_rate': 0,
        'srv_serror_rate': 0,
        'rerror_rate': 0,
        'srv_rerror_rate': 0,
        'same_srv_rate': 1.0,
        'diff_srv_rate': 0,
        'srv_diff_host_rate': 0,
        'dst_host_count': 9,
        'dst_host_srv_count': 9,
        'dst_host_same_srv_rate': 1.0,
        'dst_host_diff_srv_rate': 0,
        'dst_host_same_src_port_rate': 0.11,
        'dst_host_srv_diff_host_rate': 0,
        'dst_host_serror_rate': 0,
        'dst_host_srv_serror_rate': 0,
        'dst_host_rerror_rate': 0,
        'dst_host_srv_rerror_rate': 0
    }
    
    # Initialize the detector
    try:
        detector = CybersecurityThreatDetector()
        
        # Make prediction
        prediction = detector.predict(sample_data)
        
        # Print results
        print("\nPrediction Results:")
        print(f"Predicted class: {prediction['prediction']}")
        print(f"Threat level: {prediction['threat_level']}")
        print(f"Is anomaly: {prediction['is_anomaly']}")
        print(f"Anomaly score: {prediction['anomaly_score']:.4f}")
        print("\nClass probabilities:")
        for cls, prob in prediction['class_probabilities'].items():
            print(f"  {cls}: {prob:.4f}")
    except Exception as e:
        print(f"Error running example: {str(e)}")