import pandas as pd
import numpy as np
from pathlib import Path
import joblib
import json
import uuid
import time
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
from xgboost import XGBRegressor

UPLOAD_DIR = Path("uploads")
MODELS_DIR = Path("models")
MODELS_DIR.mkdir(exist_ok=True)

# In-memory job store (Day 3 simplicity — no DB needed yet)
training_jobs: dict = {}


def find_file(file_id: str) -> Path:
    for ext in [".csv", ".xlsx", ".xls"]:
        p = UPLOAD_DIR / f"{file_id}{ext}"
        if p.exists():
            return p
    all_files = list(UPLOAD_DIR.iterdir())
    for f in all_files:
        if file_id in f.stem:
            return f
    raise FileNotFoundError(f"No file for file_id: {file_id}. Files: {[f.name for f in all_files]}")


def load_df(file_id: str) -> pd.DataFrame:
    p = find_file(file_id)
    return pd.read_csv(p) if p.suffix == ".csv" else pd.read_excel(p)


def suggest_target(df: pd.DataFrame) -> str:
    """Heuristic: prefer columns with 'price', 'target', 'label', 'salary', 'score' in name."""
    priority = ["price", "target", "label", "salary", "score", "value", "cost", "revenue"]
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    for keyword in priority:
        for col in numeric_cols:
            if keyword in col.lower():
                return col
    # Fallback: last numeric column
    return numeric_cols[-1] if numeric_cols else df.columns[-1]


def train_models(file_id: str, target_col: str, job_id: str):
    """Runs in the background. Updates training_jobs[job_id] with progress."""
    try:
        training_jobs[job_id]["status"] = "loading"
        df = load_df(file_id)

        if target_col not in df.columns:
            raise ValueError(f"Column '{target_col}' not found in dataset.")

        training_jobs[job_id]["status"] = "preprocessing"

        # Drop columns that are clearly IDs or would leak info
        drop_cols = []
        for col in df.columns:
            if col == target_col:
                continue
            # Drop if it's an unnamed index column
            if "unnamed" in col.lower():
                drop_cols.append(col)
            # Drop if cardinality is too high (likely an ID column)
            elif df[col].dtype == object and df[col].nunique() > 100:
                drop_cols.append(col)

        df = df.drop(columns=drop_cols)

        # Separate features and target
        X = df.drop(columns=[target_col])
        y = df[target_col]

        # Encode categorical columns
        encoders = {}
        cat_cols = X.select_dtypes(include=["object", "category"]).columns.tolist()
        for col in cat_cols:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            encoders[col] = le

        # Drop any remaining NaN
        mask = y.notna()
        X = X[mask].fillna(X.median())
        y = y[mask]

        # Train/test split — 80% train, 20% test
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        training_jobs[job_id]["status"] = "training"
        training_jobs[job_id]["features"] = X.columns.tolist()
        training_jobs[job_id]["dropped"] = drop_cols
        training_jobs[job_id]["n_train"] = len(X_train)
        training_jobs[job_id]["n_test"] = len(X_test)

        models_to_train = [
            ("Linear Regression", LinearRegression()),
            ("Ridge Regression", Ridge(alpha=1.0)),
            ("Random Forest", RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)),
            ("XGBoost", XGBRegressor(n_estimators=200, learning_rate=0.1, random_state=42,
                                      verbosity=0, n_jobs=-1)),
            ("Gradient Boosting", GradientBoostingRegressor(n_estimators=100, random_state=42)),
        ]

        results = []
        best_score = -np.inf
        best_model_name = ""
        best_model_obj = None

        for name, model in models_to_train:
            training_jobs[job_id]["current_model"] = name
            start = time.time()
            model.fit(X_train, y_train)
            elapsed = round(time.time() - start, 2)

            y_pred = model.predict(X_test)
            r2 = round(float(r2_score(y_test, y_pred)), 4)
            mae = round(float(mean_absolute_error(y_test, y_pred)), 2)
            rmse = round(float(np.sqrt(mean_squared_error(y_test, y_pred))), 2)

            # Feature importance
            if hasattr(model, "feature_importances_"):
                importances = model.feature_importances_
            elif hasattr(model, "coef_"):
                importances = np.abs(model.coef_)
            else:
                importances = np.zeros(len(X.columns))

            feat_imp = [
                {"feature": col, "importance": round(float(imp), 6)}
                for col, imp in sorted(
                    zip(X.columns.tolist(), importances),
                    key=lambda x: x[1], reverse=True
                )
            ][:15]  # top 15

            results.append({
                "model": name,
                "r2": r2,
                "mae": mae,
                "rmse": rmse,
                "train_time_sec": elapsed,
                "feature_importance": feat_imp,
            })

            if r2 > best_score:
                best_score = r2
                best_model_name = name
                best_model_obj = model

        # Save best model
        model_path = MODELS_DIR / f"{job_id}_best.joblib"
        joblib.dump(best_model_obj, model_path)

        # Actual vs predicted for best model (sample 200 points)
        y_pred_best = best_model_obj.predict(X_test)
        sample_idx = np.random.choice(len(y_test), min(200, len(y_test)), replace=False)
        actual_vs_predicted = [
            {"actual": float(y_test.iloc[i]), "predicted": round(float(y_pred_best[i]), 2)}
            for i in sample_idx
        ]

        training_jobs[job_id].update({
            "status": "done",
            "results": results,
            "best_model": best_model_name,
            "best_r2": best_score,
            "actual_vs_predicted": actual_vs_predicted,
            "target_col": target_col,
        })

    except Exception as e:
        training_jobs[job_id]["status"] = "error"
        training_jobs[job_id]["error"] = str(e)