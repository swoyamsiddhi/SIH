import math
import numpy as np
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from metrics.utils import save_json, save_csv

# Prototype Normative Dataset (Eurofit-style)
NORMATIVE_DB = {
    "Explosive Power": {"mean": 45.0, "std_dev": 12.0, "source": "Eurofit Prototype", "population": "European Youth (15-18M)", "sample_size": 1000},
    "Speed": {"mean": 3.1, "std_dev": 0.4, "source": "Sprint 20m Benchmark Prototype", "population": "European Youth (15-18M)", "sample_size": 800, "lower_is_better": True},
    "Agility": {"mean": 18.5, "std_dev": 2.1, "source": "Illinois Agility Prototype", "population": "European Youth (15-18M)", "sample_size": 800, "lower_is_better": True},
    "Reaction": {"mean": 250.0, "std_dev": 40.0, "source": "Reaction Time Prototype", "population": "European Youth (15-18M)", "sample_size": 500, "lower_is_better": True},
    "Balance": {"mean": 30.0, "std_dev": 8.0, "source": "Stork Stand Prototype", "population": "European Youth (15-18M)", "sample_size": 500},
    "Endurance": {"mean": 30.0, "std_dev": 15.0, "source": "Pushup Prototype", "population": "European Youth (15-18M)", "sample_size": 1000},
    "Movement Quality": {"mean": 15.0, "std_dev": 3.0, "source": "FMS Prototype", "population": "European Youth (15-18M)", "sample_size": 600}
}

def calculate_z_score(val, mean, std, lower_is_better=False):
    if std == 0: return 0
    z = (val - mean) / std
    if lower_is_better:
        z = -z
    return z

def z_to_centile(z):
    # Approximation of normal CDF
    return 0.5 * (1 + math.erf(z / np.sqrt(2))) * 100

def run():
    print("[REFERENCE DATA] Running Athlete DNA & Repeatability Experiment...")
    
    # 1. Athlete DNA Benchmark for a single simulated athlete
    raw_metrics = {
        "Explosive Power": {"val": 52.0, "conf": 92.0},
        "Speed": {"val": 2.9, "conf": 95.0},
        "Agility": {"val": 17.5, "conf": 88.0},
        "Reaction": {"val": 230.0, "conf": 90.0},
        "Balance": {"val": 35.0, "conf": 85.0},
        "Endurance": {"val": 40.0, "conf": 98.0},
        "Movement Quality": {"val": 18.0, "conf": 90.0}
    }
    
    dna_results = []
    
    for dim, data in raw_metrics.items():
        norm = NORMATIVE_DB[dim]
        z = calculate_z_score(data['val'], norm['mean'], norm['std_dev'], norm.get('lower_is_better', False))
        centile = z_to_centile(z)
        
        dna_results.append({
            "dimension": dim,
            "raw_value": data['val'],
            "normalized_value": centile, # DNA 0-100 score
            "z_score": z,
            "centile": centile,
            "confidence": data['conf'],
            "source": norm['source'],
            "population": norm['population'],
            "sample_size": norm['sample_size'],
            "mean": norm['mean'],
            "std_dev": norm['std_dev']
        })
        
    save_csv(dna_results, "athlete_dna_profile.csv", ["dimension", "raw_value", "normalized_value", "z_score", "centile", "confidence", "source", "population", "sample_size", "mean", "std_dev"])

    # 2. Test-Retest Repeatability Simulation
    # Simulate 10 repeated measurements of vertical jump for the same athlete
    true_jump_height = 50.0
    measurements = np.random.normal(true_jump_height, 1.5, 10) # 1.5cm measurement noise
    
    mean_diff = np.mean(np.abs(np.diff(measurements)))
    std_dev_rep = np.std(measurements)
    cv_percent = (std_dev_rep / np.mean(measurements)) * 100
    
    # ICC approximation (assuming between-subject variance is known, say 12.0^2)
    var_between = 12.0**2
    var_within = std_dev_rep**2
    icc = var_between / (var_between + var_within)
    
    repeatability = {
        "num_trials": 10,
        "mean_diff_cm": mean_diff,
        "std_dev_cm": std_dev_rep,
        "cv_percent": cv_percent,
        "icc_approx": icc
    }
    
    save_json({"dna_profile": dna_results, "repeatability": repeatability}, "athlete_dna_results.json")
    
    import matplotlib.pyplot as plt
    
    # Radar chart for DNA Profile
    labels = [d["dimension"] for d in dna_results]
    values = [d["normalized_value"] for d in dna_results]
    
    angles = np.linspace(0, 2 * np.pi, len(labels), endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    ax.fill(angles, values, color='blue', alpha=0.25)
    ax.plot(angles, values, color='blue', linewidth=2)
    ax.set_yticklabels([])
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels)
    plt.title("[REFERENCE DATA] Athlete DNA Profile")
    plt.savefig(os.path.join("plots", "athlete_dna_profile.png"))
    plt.close()
    
    return dna_results, repeatability

if __name__ == "__main__":
    run()
