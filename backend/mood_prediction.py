import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from datetime import datetime, timedelta
import json
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MoodPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.label_encoder = LabelEncoder()
        self.days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        self.mood_categories = ['relaxed', 'happy', 'fine', 'anxious', 'sad', 'angry']
        
    def train(self, X, y):
        """
        Train the model with the prepared data
        
        Parameters:
        X (pd.DataFrame): Feature matrix with one-hot encoded days
        y (pd.Series): Target variable with encoded moods
        """
        try:
            logger.info("Training model...")
            self.model.fit(X, y)
            logger.info("Model training completed")
        except Exception as e:
            logger.error(f"Error in training: {str(e)}")
            raise

    def prepare_data(self, mood_logs):
        try:
            # Convert mood logs to DataFrame
            df = pd.DataFrame(mood_logs)

            # Convert timestamp to datetime and extract day of week
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            df['day_of_week'] = df['timestamp'].dt.day_name()

            df = df.sort_values('timestamp', ascending=False)

            # Get the most recent timestamp in the dataset
            most_recent = df['timestamp'].max()

            # Determine the start of the current week (Monday)
            current_week_start = most_recent - timedelta(days=most_recent.weekday())

            # Determine the start of the past four weeks (excluding the current week)
            four_weeks_ago = current_week_start - timedelta(days=28)

            # Filter out the current week's data
            df = df[df['timestamp'] < current_week_start]

            processed_data = []

            for day in self.days_of_week:
                day_data = df[
                    (df['day_of_week'] == day) & 
                    (df['timestamp'] >= four_weeks_ago)
                ]

                if not day_data.empty:
                    # Process moods
                    unique_moods = day_data['mood'].unique()

                    if len(unique_moods) >= 3:
                        selected_mood = day_data.iloc[0]['mood']
                    else:
                        mood_counts = day_data['mood'].value_counts()
                        selected_mood = mood_counts.index[0]

                    # Process activities
                    all_activities = []
                    for activities in day_data['activities']:
                        if isinstance(activities, list) and activities:
                            all_activities.extend(activities)

                    major_activity = None
                    if all_activities:
                        activity_counts = pd.Series(all_activities).value_counts()
                        major_activity = activity_counts.index[0] if not activity_counts.empty else None

                    processed_data.append({
                        'day_of_week': day,
                        'mood': selected_mood.lower(),
                        'major_activity': major_activity
                    })

            # Convert processed data to DataFrame
            processed_df = pd.DataFrame(processed_data)

            processed_df['mood'] = processed_df['mood'].str.lower()

            self.daily_activities = dict(zip(processed_df['day_of_week'], processed_df['major_activity']))

            # Encode mood categories
            self.label_encoder.fit(self.mood_categories)
            processed_df['mood_encoded'] = self.label_encoder.transform(processed_df['mood'])

            # Create features (one-hot encoding for days)
            X = pd.get_dummies(processed_df['day_of_week'])
            y = processed_df['mood_encoded']

            return X, y

        except Exception as e:
            logger.error(f"Error in prepare_data: {str(e)}")
            raise


    def predict_weekly_moods(self):
        try:
            # Create a test dataset with all days of the week
            test_data = pd.DataFrame([1] * len(self.days_of_week), 
                                index=self.days_of_week, 
                                columns=['dummy'])
            test_X = pd.get_dummies(test_data.index)
            
            # Predict moods
            predictions = self.model.predict(test_X)
            predicted_moods = self.label_encoder.inverse_transform(predictions)
            
            # Combine predictions with activities
            weekly_predictions = {}
            for day, mood in zip(self.days_of_week, predicted_moods):
                activity = self.daily_activities.get(day)
                weekly_predictions[day] = {
                    'mood': mood,
                    'activity': activity
                }
            
            result = {
                'daily_predictions': weekly_predictions
            }
            
            json.dumps(result)  # Test serialization
            return result
            
        except Exception as e:
            logger.error(f"Error in predict_weekly_moods: {str(e)}")
            raise

def predict_mood(mood_logs):
    try:
        predictor = MoodPredictor()
        X, y = predictor.prepare_data(mood_logs)
        predictor.train(X, y)
        predictions = predictor.predict_weekly_moods()
        return predictions
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return {'error': str(e)}

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip()
        if not input_data:
            raise ValueError("No input data received")
        
        mood_logs = json.loads(input_data)
        result = predict_mood(mood_logs)
        
        # Ensure proper JSON output
        print(json.dumps(result, ensure_ascii=False, separators=(',', ':')))
        sys.stdout.flush()
        
    except Exception as e:
        error_result = {'error': str(e)}
        print(json.dumps(error_result))
        sys.stdout.flush()