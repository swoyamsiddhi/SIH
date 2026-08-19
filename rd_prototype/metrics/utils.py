import numpy as np
import json
import os
import csv

def calculate_rmse(gt, est):
    return np.sqrt(np.mean((gt - est)**2))

def calculate_mae(gt, est):
    return np.mean(np.abs(gt - est))

def save_json(data, filename):
    path = os.path.join("results", filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=4)

def save_csv(data, filename, fieldnames):
    path = os.path.join("results", filename)
    with open(path, "w", newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in data:
            writer.writerow(row)
