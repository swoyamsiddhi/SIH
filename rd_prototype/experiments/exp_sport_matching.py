import numpy as np
import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from metrics.utils import save_json, save_csv

# Prototype Sport Requirements (Z-score minimums)
SPORT_PROFILES = {
    "Sprinting": {
        "Explosive Power": {"weight": 0.4, "min_z": 1.0, "source": "[Prototype Assumption] High correlation between CMJ peak power and 10m/20m acceleration phase (Sleivert & Taing, 2004)"},
        "Speed": {"weight": 0.4, "min_z": 1.5, "source": "[Prototype Assumption] Direct maximal velocity requirement"},
        "Reaction": {"weight": 0.2, "min_z": 0.5, "source": "[Prototype Assumption] Start reaction time"}
    },
    "Football": {
        "Movement Quality": {"weight": 0.3, "min_z": 0.5, "source": "[Prototype Assumption] High biomechanical efficiency required for repetitive high-intensity COD actions (Gabbett, 2010)"},
        "Endurance": {"weight": 0.4, "min_z": 1.0, "source": "[Prototype Assumption] 9-12km total distance covered per match requiring high Yo-Yo IR1 test scores (Krustrup et al., 2003)"},
        "Agility": {"weight": 0.2, "min_z": 0.8, "source": "[Prototype Assumption] Change of direction speed"},
        "Explosive Power": {"weight": 0.1, "min_z": 0.5, "source": "[Prototype Assumption] Aerial duels and short sprints (Stolen et al., 2005)"}
    },
    "Basketball": {
        "Explosive Power": {"weight": 0.5, "min_z": 1.5, "source": "[Prototype Assumption] Vertical jump crucial for rebounding and shooting"},
        "Agility": {"weight": 0.3, "min_z": 1.0, "source": "[Prototype Assumption] Lateral movement for defense"},
        "Endurance": {"weight": 0.2, "min_z": 0.5, "source": "[Prototype Assumption] Repeated sprints"}
    }
}

def run():
    print("[REFERENCE DATA] Running Sport Potential Engine & Growth Experiment...")
    
    # 1. Sport Compatibility
    # Simulated Athlete DNA (Z-scores)
    athlete_z_scores = {
        "Explosive Power": {"z": 1.8, "conf": 92.0},
        "Speed": {"z": 1.2, "conf": 95.0},
        "Reaction": {"z": 0.8, "conf": 90.0},
        "Movement Quality": {"z": 0.2, "conf": 90.0},
        "Endurance": {"z": 0.1, "conf": 98.0},
        "Agility": {"z": 0.9, "conf": 88.0}
    }
    
    results = []
    
    for sport, reqs in SPORT_PROFILES.items():
        score = 0.0
        total_weight = 0.0
        lowest_conf = 100.0
        explanation = []
        
        for dim, req in reqs.items():
            total_weight += req["weight"]
            if dim in athlete_z_scores:
                ath_z = athlete_z_scores[dim]["z"]
                ath_conf = athlete_z_scores[dim]["conf"]
                
                lowest_conf = min(lowest_conf, ath_conf)
                
                if ath_z >= req["min_z"]:
                    score += req["weight"]
                    explanation.append(f"{dim}: Strong (z={ath_z:.1f} vs req {req['min_z']}) - {req['source']}")
                else:
                    ratio = max(0, (ath_z + 3) / (req["min_z"] + 3)) # shifted to handle negatives
                    score += req["weight"] * ratio
                    explanation.append(f"{dim}: Gap (z={ath_z:.1f} vs req {req['min_z']}) - {req['source']}")
        
        compatibility = (score / total_weight) * 100
        final_conf = (total_weight / sum(r["weight"] for r in reqs.values())) * lowest_conf
        
        results.append({
            "sport": sport,
            "compatibility_score": compatibility,
            "confidence": final_conf,
            "explanation": " | ".join(explanation)
        })
        
    results.sort(key=lambda x: x["compatibility_score"], reverse=True)
    
    save_csv(results, "sport_potential_prototype.csv", ["sport", "compatibility_score", "confidence", "explanation"])
    
    # 2. Growth / Longitudinal Analysis
    assessments = [1, 2, 3, 4]
    scores = [40.0, 42.5, 43.1, 45.0]
    
    growth_results = {
        "start_val": scores[0],
        "end_val": scores[-1],
        "abs_improvement": scores[-1] - scores[0],
        "pct_improvement": ((scores[-1] - scores[0]) / scores[0]) * 100,
        "trajectory": "improving"
    }
    
    save_json({"sport_matching": results, "growth": growth_results}, "sport_matching_growth.json")
    
    import matplotlib.pyplot as plt
    plt.figure(figsize=(8, 4))
    plt.plot(assessments, scores, marker='o', linestyle='-', color='b')
    plt.title("[SIMULATION] Performance Growth Tracking")
    plt.xlabel("Assessment Number")
    plt.ylabel("Vertical Jump (cm)")
    plt.grid(True)
    plt.savefig(os.path.join("plots", "growth_trajectory.png"))
    plt.close()
    
    # Bar chart for sport compatibility
    sports = [r["sport"] for r in results]
    comps = [r["compatibility_score"] for r in results]
    plt.figure(figsize=(8, 4))
    plt.bar(sports, comps, color='purple')
    plt.title("[REFERENCE DATA] Sport Compatibility Prototype")
    plt.ylabel("Compatibility Score (0-100)")
    plt.ylim(0, 100)
    for i, v in enumerate(comps):
        plt.text(i, v + 2, f"{v:.1f}", ha='center')
    plt.savefig(os.path.join("plots", "sport_potential.png"))
    plt.close()

if __name__ == "__main__":
    run()
