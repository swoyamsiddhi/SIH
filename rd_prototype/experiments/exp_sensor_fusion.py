import numpy as np
import matplotlib.pyplot as plt
import os
import sys

# Add root directory to path to import models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models.generate_jump_data import generate_perfect_jump, generate_sensor_data
from models.jump_models import CameraModel, IMUModel, FusionModel
from metrics.utils import calculate_rmse, calculate_mae, save_json, save_csv

def run():
    print("[SIMULATION] Running Sensor Fusion Experiment...")
    
    scenarios = [
        {"name": "Ideal", "cam_dropout": 0.0, "imu_noise": 0.1, "cam_noise": 0.005, "imu_bias": 0.0},
        {"name": "Camera Noise", "cam_dropout": 0.0, "imu_noise": 0.1, "cam_noise": 0.02, "imu_bias": 0.0},
        {"name": "Camera Occlusion", "cam_dropout": 0.3, "imu_noise": 0.1, "cam_noise": 0.005, "imu_bias": 0.0},
        {"name": "IMU Noise", "cam_dropout": 0.0, "imu_noise": 2.0, "cam_noise": 0.005, "imu_bias": 0.0},
        {"name": "IMU Drift", "cam_dropout": 0.0, "imu_noise": 0.5, "cam_noise": 0.005, "imu_bias": 0.5},
        {"name": "Combined Noise", "cam_dropout": 0.1, "imu_noise": 1.5, "cam_noise": 0.02, "imu_bias": 0.2},
        {"name": "Severe Dropout", "cam_dropout": 0.6, "imu_noise": 0.5, "cam_noise": 0.01, "imu_bias": 0.1},
        {"name": "Sync Error (Simulated via high noise)", "cam_dropout": 0.1, "imu_noise": 1.0, "cam_noise": 0.03, "imu_bias": 0.0},
    ]

    results = []
    
    for s in scenarios:
        t, pos, vel, acc = generate_perfect_jump()
        data = generate_sensor_data(t, pos, acc, 
                                    cam_dropout_prob=s["cam_dropout"],
                                    imu_noise=s["imu_noise"],
                                    imu_bias=s["imu_bias"],
                                    cam_noise=s["cam_noise"])
                                    
        gt_t = data['gt']['t']
        gt_pos = data['gt']['pos']
        
        cam_model = CameraModel()
        imu_model = IMUModel()
        fusion_model = FusionModel()
        
        pos_cam_est = cam_model.estimate(data['cam']['t'], data['cam']['pos'], data['cam']['valid'], gt_t)
        pos_imu_est = imu_model.estimate(data['imu']['t'], data['imu']['acc'], gt_t)
        pos_fus_est, innovations = fusion_model.estimate(data['cam']['t'], data['cam']['pos'], data['cam']['valid'],
                                                        data['imu']['t'], data['imu']['acc'], gt_t)
        
        gt_peak = np.max(gt_pos)
        cam_peak_err = np.abs(gt_peak - np.max(pos_cam_est))
        imu_peak_err = np.abs(gt_peak - np.max(pos_imu_est))
        fus_peak_err = np.abs(gt_peak - np.max(pos_fus_est))
        
        results.append({
            "scenario": s["name"],
            "cam_rmse": calculate_rmse(gt_pos, pos_cam_est),
            "imu_rmse": calculate_rmse(gt_pos, pos_imu_est),
            "fus_rmse": calculate_rmse(gt_pos, pos_fus_est),
            "cam_peak_err": cam_peak_err,
            "imu_peak_err": imu_peak_err,
            "fus_peak_err": fus_peak_err
        })
        
        # Plot only the Severe Dropout case as an example
        if s["name"] == "Severe Dropout":
            plt.figure(figsize=(10, 5))
            plt.plot(gt_t, gt_pos, 'k--', label="Ground Truth", linewidth=2)
            plt.plot(gt_t, pos_cam_est, 'b-', label="Camera (Interpolated)", alpha=0.7)
            plt.plot(gt_t, pos_imu_est, 'r-', label="IMU (Double Integration)", alpha=0.7)
            plt.plot(gt_t, pos_fus_est, 'g-', label="Fusion (Kalman)", linewidth=2)
            plt.title(f"Simulation: {s['name']}")
            plt.xlabel("Time (s)")
            plt.ylabel("Position (m)")
            plt.legend()
            plt.grid(True)
            plt.savefig(os.path.join("plots", "sensor_fusion_severe_dropout.png"))
            plt.close()

    save_csv(results, "sensor_fusion_results.csv", ["scenario", "cam_rmse", "imu_rmse", "fus_rmse", "cam_peak_err", "imu_peak_err", "fus_peak_err"])
    save_json(results, "sensor_fusion_results.json")
    
    # Generate bar chart for RMSE
    scenarios_names = [r["scenario"] for r in results]
    cam_rmses = [r["cam_rmse"] for r in results]
    fus_rmses = [r["fus_rmse"] for r in results]
    
    x = np.arange(len(scenarios_names))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.bar(x - width/2, cam_rmses, width, label='Camera RMSE')
    ax.bar(x + width/2, fus_rmses, width, label='Fusion RMSE')
    ax.set_ylabel('RMSE (m)')
    ax.set_title('[SIMULATION] RMSE Comparison Across Conditions')
    ax.set_xticks(x)
    ax.set_xticklabels(scenarios_names, rotation=45, ha='right')
    ax.legend()
    plt.tight_layout()
    plt.savefig(os.path.join("plots", "sensor_fusion_rmse.png"))
    plt.close()

    return results

if __name__ == "__main__":
    run()
