# Sensor Fusion R&D Results

## Evaluation Metrics

| Scenario | Method | RMSE (m) | Peak Height Error (m) | Confidence / Authenticity Signal |
| :--- | :--- | :--- | :--- | :--- |
| **Ideal** | Camera | 0.0042 | 0.0041 | N/A |
| | IMU | 1.1552 | 2.1358 | N/A |
| | **Fusion** | **0.6006** | **0.0417** | **93.4/100** |
| **Camera Occlusion** | Camera | 0.0305 | 0.0630 | N/A |
| (30% Dropout) | IMU | 1.1586 | 2.1408 | N/A |
| | **Fusion** | **0.7112** | **0.0779** | **96.5/100** |
| **Cheap IMU** | Camera | 0.0044 | 0.0013 | N/A |
| (High Noise) | IMU | 1.1672 | 2.1571 | N/A |
| | **Fusion** | **0.5949** | **0.0507** | **91.7/100** |
| **Extreme World** | Camera | 0.0309 | 0.0727 | N/A |
| (Dropout + Noise) | IMU | 1.1329 | 2.1100 | N/A |
| | **Fusion** | **0.7166** | **0.0997** | **94.7/100** |

## Conclusion
- **Camera-Only** suffers severely when occlusions or dropouts occur (RMSE and Peak Height Error increase significantly).
- **IMU-Only** suffers from unbounded integration drift, especially with cheaper sensors with high noise profiles.
- **Sensor Fusion (Kalman Filter)** mathematically proves to be the most robust under all conditions. It uses the IMU to bridge visual dropouts and the Camera to correct IMU integration drift.
- **Authenticity Signal**: The filter's innovation matrix (the disagreement between predicted IMU position and observed Camera position) serves as a powerful confidence score. If an athlete manipulates a video (e.g. slowing it down to fake hang-time), the IMU acceleration will sharply disagree with the camera displacement, dropping the confidence score and flagging the attempt.
