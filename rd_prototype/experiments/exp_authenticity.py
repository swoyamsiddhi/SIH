import numpy as np
import matplotlib.pyplot as plt
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models.generate_jump_data import generate_perfect_jump, generate_sensor_data
from models.jump_models import FusionModel
from metrics.utils import save_json, save_csv

def generate_manipulated_data(t, pos, acc, scenario_type):
    data = generate_sensor_data(t, pos, acc, cam_dropout_prob=0.0)
    
    # Manipulate Camera data to simulate cheating
    if scenario_type == "Genuine attempt":
        pass
    elif scenario_type == "Video timing manipulation":
        # Slow down video in the air (hang time)
        # Shift camera positions up temporarily
        for i in range(len(data['cam']['pos'])):
            if data['cam']['pos'][i] > -0.2:
                data['cam']['pos'][i] *= 1.2 # Exaggerate height
    elif scenario_type == "Artificially extended hang time":
        flight_start = np.argmax(data['cam']['pos'] > -0.1)
        flight_end = len(data['cam']['pos']) - np.argmax(data['cam']['pos'][::-1] > -0.1)
        # Add artificial plateau
        if flight_start > 0 and flight_end < len(data['cam']['pos']):
            plateau_val = np.max(data['cam']['pos'])
            for i in range(flight_start, flight_end):
                data['cam']['pos'][i] = plateau_val
    elif scenario_type == "Altered visual trajectory":
        # Introduce a sudden spike
        spike_idx = len(data['cam']['pos']) // 2
        data['cam']['pos'][spike_idx:spike_idx+5] += 0.5
    elif scenario_type == "IMU/video disagreement":
        # Offset IMU completely
        data['imu']['acc'] *= -1

    return data

def run():
    print("[SIMULATION] Running Authenticity / Verification Experiment...")
    scenarios = [
        "Genuine attempt",
        "Video timing manipulation",
        "Artificially extended hang time",
        "Altered visual trajectory",
        "IMU/video disagreement"
    ]
    
    results = []
    
    for s in scenarios:
        t, pos, vel, acc = generate_perfect_jump()
        data = generate_manipulated_data(t, pos, acc, s)
        
        fusion_model = FusionModel()
        pos_fus_est, innovations = fusion_model.estimate(
            data['cam']['t'], data['cam']['pos'], data['cam']['valid'],
            data['imu']['t'], data['imu']['acc'], data['gt']['t']
        )
        
        # Calculate innovation magnitude
        flight_idx = data['gt']['pos'] > -0.1
        if np.sum(flight_idx) > 0:
            mean_innov = np.mean(np.abs(innovations[flight_idx]))
            max_innov = np.max(np.abs(innovations[flight_idx]))
        else:
            mean_innov = np.mean(np.abs(innovations))
            max_innov = np.max(np.abs(innovations))
            
        confidence = float(max(0, 100 - (mean_innov * 1000)))
        is_flagged = bool(confidence < 80.0)
        
        results.append({
            "scenario": s,
            "mean_innovation": float(mean_innov),
            "max_innovation": float(max_innov),
            "confidence_score": confidence,
            "flagged_as_manipulated": is_flagged,
            "ground_truth_manipulated": bool(s != "Genuine attempt")
        })
        
        if s == "Artificially extended hang time" or s == "Genuine attempt":
            plt.figure(figsize=(10, 4))
            plt.plot(data['gt']['t'], innovations, label="Kalman Innovation (m)")
            plt.axhline(0, color='k', linestyle='--')
            plt.title(f"[SIMULATION] Authenticity Signal - {s}")
            plt.xlabel("Time (s)")
            plt.ylabel("Innovation Magnitude")
            plt.legend()
            plt.grid(True)
            plt.savefig(os.path.join("plots", f"authenticity_signal_{s.replace(' ', '_').lower()}.png"))
            plt.close()

    # Calculate classification metrics
    tp = sum(1 for r in results if r["flagged_as_manipulated"] and r["ground_truth_manipulated"])
    tn = sum(1 for r in results if not r["flagged_as_manipulated"] and not r["ground_truth_manipulated"])
    fp = sum(1 for r in results if r["flagged_as_manipulated"] and not r["ground_truth_manipulated"])
    fn = sum(1 for r in results if not r["flagged_as_manipulated"] and r["ground_truth_manipulated"])
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

    save_csv(results, "authenticity_results.csv", ["scenario", "mean_innovation", "max_innovation", "confidence_score", "flagged_as_manipulated", "ground_truth_manipulated"])
    save_json({
        "results": results,
        "metrics": {
            "Precision": precision,
            "Recall": recall,
            "F1_Score": f1,
            "False_Positives": fp,
            "False_Negatives": fn
        }
    }, "authenticity_summary.json")

    return results

if __name__ == "__main__":
    run()
