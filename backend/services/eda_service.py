import pandas as pd
import numpy as np
import json
from pathlib import Path

UPLOAD_DIR = Path("uploads")


def load_dataframe(file_id: str) -> pd.DataFrame:
    path = UPLOAD_DIR / f"{file_id}.csv"
    if not path.exists():
        # try xlsx
        path = UPLOAD_DIR / f"{file_id}.xlsx"
    if not path.exists():
        raise FileNotFoundError(f"No file found for file_id: {file_id}")
    if path.suffix == ".csv":
        return pd.read_csv(path)
    return pd.read_excel(path)


def run_eda(file_id: str) -> dict:
    df = load_dataframe(file_id)

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
    datetime_cols = df.select_dtypes(include=["datetime64"]).columns.tolist()

    # ── Overview ──────────────────────────────────────────────────────────────
    overview = {
        "rows": int(df.shape[0]),
        "columns": int(df.shape[1]),
        "numeric_columns": len(numeric_cols),
        "categorical_columns": len(categorical_cols),
        "datetime_columns": len(datetime_cols),
        "total_missing": int(df.isnull().sum().sum()),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_usage_kb": round(df.memory_usage(deep=True).sum() / 1024, 2),
        "column_names": df.columns.tolist(),
    }

    # ── Missing values ────────────────────────────────────────────────────────
    missing = []
    for col in df.columns:
        n_missing = int(df[col].isnull().sum())
        pct = round(n_missing / len(df) * 100, 2) if len(df) > 0 else 0
        missing.append({
            "column": col,
            "missing": n_missing,
            "pct": pct,
            "dtype": str(df[col].dtype),
        })
    missing.sort(key=lambda x: x["missing"], reverse=True)

    # ── Numeric stats ─────────────────────────────────────────────────────────
    numeric_stats = []
    for col in numeric_cols:
        s = df[col].dropna()
        if len(s) == 0:
            continue
        q1 = float(s.quantile(0.25))
        q3 = float(s.quantile(0.75))
        iqr = q3 - q1
        outliers = int(((s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)).sum())

        # histogram bins (20 bins)
        counts, bin_edges = np.histogram(s, bins=20)
        histogram = [
            {"x": round(float(bin_edges[i]), 4), "count": int(counts[i])}
            for i in range(len(counts))
        ]

        numeric_stats.append({
            "column": col,
            "count": int(s.count()),
            "mean": round(float(s.mean()), 4),
            "median": round(float(s.median()), 4),
            "std": round(float(s.std()), 4),
            "min": round(float(s.min()), 4),
            "max": round(float(s.max()), 4),
            "q1": round(q1, 4),
            "q3": round(q3, 4),
            "skewness": round(float(s.skew()), 4),
            "kurtosis": round(float(s.kurtosis()), 4),
            "outliers": outliers,
            "histogram": histogram,
        })

    # ── Categorical stats ─────────────────────────────────────────────────────
    categorical_stats = []
    for col in categorical_cols:
        s = df[col].dropna()
        vc = s.value_counts()
        top_values = [
            {"value": str(k), "count": int(v), "pct": round(int(v) / len(s) * 100, 2)}
            for k, v in vc.head(10).items()
        ]
        categorical_stats.append({
            "column": col,
            "unique": int(s.nunique()),
            "top_value": str(vc.index[0]) if len(vc) > 0 else None,
            "top_count": int(vc.iloc[0]) if len(vc) > 0 else 0,
            "top_values": top_values,
        })

    # ── Correlation matrix ────────────────────────────────────────────────────
    correlation = []
    if len(numeric_cols) >= 2:
        corr_df = df[numeric_cols].corr()
        # Replace NaN with 0
        corr_df = corr_df.fillna(0)
        for col_a in corr_df.columns:
            for col_b in corr_df.columns:
                correlation.append({
                    "x": col_a,
                    "y": col_b,
                    "value": round(float(corr_df.loc[col_a, col_b]), 3),
                })

    # ── Sample rows ───────────────────────────────────────────────────────────
    sample = df.head(5).fillna("").astype(str).to_dict(orient="records")

    return {
        "file_id": file_id,
        "overview": overview,
        "missing": missing,
        "numeric_stats": numeric_stats,
        "categorical_stats": categorical_stats,
        "correlation": correlation,
        "sample": sample,
    }