import numpy as np

class CameraModel:
    def __init__(self):
        pass
        
    def estimate(self, t_cam, pos_cam, valid_cam, t_out):
        """
        Estimates continuous position using only camera data.
        Handles dropouts by interpolation and applies basic smoothing.
        """
        # Extract valid points
        t_valid = t_cam[valid_cam]
        pos_valid = pos_cam[valid_cam]
        
        # Interpolate to output timebase
        pos_interp = np.interp(t_out, t_valid, pos_valid)
        
        # Simple moving average smoothing (window = 5)
        window_size = 5
        window = np.ones(window_size) / window_size
        pos_smooth = np.convolve(pos_interp, window, mode='same')
        
        return pos_smooth

class IMUModel:
    def __init__(self):
        pass
        
    def estimate(self, t_imu, acc_imu, t_out):
        """
        Estimates position using only IMU data via double integration.
        Applies a basic high-pass filter or detrending to handle drift.
        """
        dt = np.mean(np.diff(t_imu))
        
        # Detrend acceleration (assume mostly standing still at start/end)
        # In a real scenario, this would be a high-pass filter or ZUPT.
        acc_detrended = acc_imu - np.mean(acc_imu[:100]) # simple bias removal
        
        # First integration: Velocity
        vel = np.cumsum(acc_detrended) * dt
        # Detrend velocity (assume starting and ending at 0 velocity)
        vel = vel - np.linspace(vel[0], vel[-1], len(vel))
        
        # Second integration: Position
        pos = np.cumsum(vel) * dt
        # Detrend position (assume starting and ending at 0 position)
        pos = pos - np.linspace(pos[0], pos[-1], len(pos))
        
        # Interpolate to output timebase
        pos_out = np.interp(t_out, t_imu, pos)
        return pos_out

class FusionModel:
    def __init__(self):
        pass
        
    def estimate(self, t_cam, pos_cam, valid_cam, t_imu, acc_imu, t_out):
        """
        Estimates position using a Kalman Filter to fuse Camera and IMU.
        State: [position, velocity]^T
        Control: IMU acceleration
        Measurement: Camera position
        """
        # We will run the filter at the IMU frequency (higher frequency)
        dt = np.mean(np.diff(t_imu))
        n = len(t_imu)
        
        # State vector [p, v]
        # Initialize with first valid camera measurement to avoid massive initial RMSE
        initial_p = pos_cam[valid_cam][0] if len(pos_cam[valid_cam]) > 0 else 0.0
        x = np.array([initial_p, 0.0])
        
        # Covariance matrix
        P = np.array([[0.1, 0.0],
                      [0.0, 0.1]])
                      
        # State transition matrix
        F = np.array([[1.0, dt],
                      [0.0, 1.0]])
                      
        # Control input matrix
        B = np.array([[0.5 * dt**2],
                      [dt]])
                      
        # Measurement matrix (we only measure position)
        H = np.array([[1.0, 0.0]])
        
        # Process noise covariance (IMU uncertainty)
        # Represents noise in the acceleration integration
        q = 0.1 # variance of acceleration noise (tighten to trust IMU prediction more during dropouts but avoid massive drift)
        Q = np.array([[0.25 * dt**4, 0.5 * dt**3],
                      [0.5 * dt**3,  dt**2]]) * q
                      
        # Measurement noise covariance (Camera uncertainty)
        R = np.array([[0.001]]) # Highly trust camera when available
        
        pos_est = np.zeros(n)
        vel_est = np.zeros(n)
        innovations = np.zeros(n)
        
        # Create a lookup for camera measurements
        # Find closest IMU index for each valid camera measurement
        cam_measurements = {}
        for i in range(len(t_cam)):
            if valid_cam[i]:
                # find closest imu index
                idx = np.argmin(np.abs(t_imu - t_cam[i]))
                cam_measurements[idx] = pos_cam[i]
        
        for i in range(n):
            # Predict step (using IMU)
            u = acc_imu[i]
            x = F @ x + B @ np.array([u])
            P = F @ P @ F.T + Q
            
            # Update step (using Camera if available)
            if i in cam_measurements:
                z = np.array([cam_measurements[i]])
                y = z - (H @ x) # Innovation (measurement residual)
                innovations[i] = y[0]
                
                S = H @ P @ H.T + R
                K = P @ H.T @ np.linalg.inv(S)
                
                x = x + K @ y
                P = (np.eye(2) - K @ H) @ P
            else:
                innovations[i] = 0.0 # No measurement
                
            pos_est[i] = x[0]
            vel_est[i] = x[1]
            
        # The innovation sequence serves as our confidence/verification signal.
        # High innovation = sensor disagreement = potential manipulation/cheat.
            
        # Interpolate to output timebase
        pos_out = np.interp(t_out, t_imu, pos_est)
        innov_out = np.interp(t_out, t_imu, innovations)
        
        return pos_out, innov_out
