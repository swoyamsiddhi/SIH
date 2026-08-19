import numpy as np

def generate_vertical_jump(duration=4.0, dt=0.005, jump_height=0.6, noise_level=0.0):
    """
    Generates synthetic ground truth for a vertical jump.
    Returns: time, position, velocity, acceleration
    """
    t = np.arange(0, duration, dt)
    n = len(t)
    pos = np.zeros(n)
    vel = np.zeros(n)
    acc = np.zeros(n)
    
    g = 9.81
    
    # Calculate flight time based on jump height
    # h = 1/8 * g * t_flight^2 => t_flight = sqrt(8h/g)
    t_flight = np.sqrt(8 * jump_height / g)
    takeoff_v = np.sqrt(2 * g * jump_height)
    
    # Phases
    # 0.0 - 1.0: Standing still
    # 1.0 - 1.4: Countermovement (eccentric)
    # 1.4 - 1.7: Propulsion (concentric)
    # 1.7 - (1.7 + t_flight): Flight
    # (1.7 + t_flight) - (1.7 + t_flight + 0.5): Landing deceleration
    # Rest: Standing still
    
    t_start_ecc = 1.0
    t_start_con = 1.4
    t_takeoff = 1.7
    t_land = t_takeoff + t_flight
    t_end_land = t_land + 0.3
    
    for i in range(n):
        ct = t[i]
        
        if ct < t_start_ecc:
            # Standing
            acc[i] = 0
        elif t_start_ecc <= ct < t_start_con:
            # Countermovement: negative acceleration
            # Simple sine wave profile
            acc[i] = -g * 0.5 * np.sin(np.pi * (ct - t_start_ecc) / (t_start_con - t_start_ecc))
        elif t_start_con <= ct < t_takeoff:
            # Propulsion: positive acceleration
            # Needs to reach takeoff_v at t_takeoff
            # We'll iteratively fix this or just use a mathematical trick later
            # For simplicity, constant acceleration to reach takeoff_v
            # Wait, v at start of con is negative. 
            pass
        elif t_takeoff <= ct < t_land:
            # Flight phase
            acc[i] = -g
        elif t_land <= ct < t_end_land:
            # Landing impact
            pass
        else:
            acc[i] = 0

    # Let's use a simpler analytical approach for the ground truth 
    # to guarantee exact physics.
    return t, pos, vel, acc

def generate_analytical_jump(duration=4.0, dt_imu=0.005, dt_cam=0.033, dropout_prob=0.0):
    """
    Generates synchronized Ground Truth, Camera, and IMU data.
    IMU is 200Hz (dt=0.005), Camera is 30Hz (dt=0.033).
    """
    # 1. Generate high-res Ground Truth (1000 Hz)
    dt_gt = 0.001
    t_gt = np.arange(0, duration, dt_gt)
    n = len(t_gt)
    
    acc = np.zeros(n)
    vel = np.zeros(n)
    pos = np.zeros(n)
    
    g = 9.81
    jump_height = 0.6 # meters
    takeoff_vel = np.sqrt(2 * g * jump_height)
    
    t_takeoff = 1.5
    t_flight = 2 * takeoff_vel / g
    t_land = t_takeoff + t_flight
    
    # Eccentric phase (0.4s) and Concentric phase (0.3s)
    t_ecc = 0.8
    t_con = 1.2
    
    # Build acceleration
    for i, t in enumerate(t_gt):
        if t_ecc <= t < t_con:
            acc[i] = -5.0 # dropping down
        elif t_con <= t < t_takeoff:
            acc[i] = 15.0 # pushing up
        elif t_takeoff <= t < t_land:
            acc[i] = -g # free fall
        elif t_land <= t < t_land + 0.2:
            acc[i] = 30.0 # landing impact (stopping)
        else:
            acc[i] = 0.0 # standing
            
    # Integrate to get velocity and position
    for i in range(1, n):
        vel[i] = vel[i-1] + acc[i] * dt_gt
        pos[i] = pos[i-1] + vel[i] * dt_gt
        
        # Ground constraint
        if pos[i] < -0.4: # Max squat depth
            pass

    # Actually, the crude piecewise constant acceleration above leaves residual velocity.
    # Let's build a strictly physically consistent trajectory backward or using optimization.
    # A simpler way: define position first, then differentiate.
    
    return t_gt, pos, vel, acc

def generate_perfect_jump(duration=4.0):
    dt = 0.001
    t = np.arange(0, duration, dt)
    pos = np.zeros_like(t)
    
    g = 9.81
    h = 0.6
    t_flight = np.sqrt(8*h/g)
    
    # Times
    t1 = 1.0 # start squat
    t2 = 1.4 # max depth
    t3 = 1.6 # takeoff
    t4 = t3 + t_flight # land
    t5 = t4 + 0.3 # recover
    
    for i, ct in enumerate(t):
        if ct < t1:
            pos[i] = 0
        elif ct < t2:
            # smoothly go to -0.3
            phase = (ct - t1) / (t2 - t1)
            pos[i] = -0.3 * (0.5 - 0.5 * np.cos(np.pi * phase))
        elif ct < t3:
            # smoothly go from -0.3 to 0.0 (takeoff)
            phase = (ct - t2) / (t3 - t2)
            # using quadratic to ensure takeoff velocity is correct
            # wait, if it's a sine wave, v_takeoff = (pi/2) * 0.3 / (t3-t2)
            # we need v_takeoff = sqrt(2*g*h) = sqrt(2*9.81*0.6) = 3.43 m/s
            # let's just use a cubic polynomial
            v_takeoff = np.sqrt(2 * g * h)
            # p(t) = a*t^3 + b*t^2 + c*t + d
            # at t=0, p= -0.3, v=0
            # at t=(t3-t2)=0.2, p=0, v=3.43
            T = t3 - t2
            tau = ct - t2
            # d = -0.3
            # c = 0
            # a*T^3 + b*T^2 - 0.3 = 0
            # 3*a*T^2 + 2*b*T = 3.43
            a = (3.43*T - 2*(0.3)) / (T**3)
            b = (0.3 - a*T**3) / (T**2)
            pos[i] = a*(tau**3) + b*(tau**2) - 0.3
        elif ct < t4:
            # free fall
            tau = ct - t3
            v_takeoff = np.sqrt(2 * g * h)
            pos[i] = v_takeoff * tau - 0.5 * g * (tau**2)
        elif ct < t5:
            # landing absorption
            tau = ct - t4
            T = t5 - t4
            v_land = -np.sqrt(2 * g * h)
            # a*T^3 + b*T^2 + c*T + d = 0
            # d = 0
            # c = v_land
            a = -(v_land * T) / (T**3) # simple smooth
            b = - (a*T**3 + v_land*T) / (T**2)
            # Let's just use an exponential decay for simplicity or cubic
            pos[i] = a*(tau**3) + b*(tau**2) + v_land*tau
        else:
            pos[i] = 0
            
    # Differentiate to get velocity and acceleration
    vel = np.gradient(pos, dt)
    acc = np.gradient(vel, dt)
    
    return t, pos, vel, acc

def generate_sensor_data(t, pos, acc, cam_fps=30, imu_hz=200, cam_noise=0.01, imu_noise=0.5, imu_bias=0.2, cam_dropout_prob=0.1):
    # Camera Simulation (30 Hz)
    dt_cam = 1.0 / cam_fps
    t_cam = np.arange(0, t[-1], dt_cam)
    pos_cam = np.interp(t_cam, t, pos)
    
    # Add camera noise
    pos_cam += np.random.normal(0, cam_noise, len(pos_cam))
    
    # Simulate dropouts (occlusion/blur)
    valid_cam = np.ones(len(pos_cam), dtype=bool)
    
    # Random dropouts
    for i in range(len(pos_cam)):
        if np.random.rand() < cam_dropout_prob:
            valid_cam[i] = False
            
    # Contiguous occlusion during the jump peak if dropout is high
    if cam_dropout_prob > 0.1:
        # Jump peak is around t=1.8 to 2.0 (flight phase is 1.6 to 2.3)
        # We will blind the camera for 0.3 seconds at the peak
        peak_t = 1.9
        occlude_start = peak_t - 0.15
        occlude_end = peak_t + 0.15
        for i in range(len(pos_cam)):
            if occlude_start <= t_cam[i] <= occlude_end:
                valid_cam[i] = False
            
    # IMU Simulation (200 Hz)
    dt_imu = 1.0 / imu_hz
    t_imu = np.arange(0, t[-1], dt_imu)
    acc_imu = np.interp(t_imu, t, acc)
    
    # Add IMU noise and bias
    acc_imu += np.random.normal(0, imu_noise, len(acc_imu))
    acc_imu += imu_bias # integration drift source
    
    # Note: IMU measures proper acceleration (includes gravity)
    # We assume the sensor is Z-axis aligned.
    # acc_imu_measured = acc_imu + 9.81
    # For fusion, we usually subtract gravity if orientation is known.
    # We will just pass the linear acceleration `acc_imu`.
    
    return {
        'gt': {'t': t, 'pos': pos, 'acc': acc},
        'cam': {'t': t_cam, 'pos': pos_cam, 'valid': valid_cam},
        'imu': {'t': t_imu, 'acc': acc_imu}
    }

if __name__ == '__main__':
    t, pos, vel, acc = generate_perfect_jump()
    data = generate_sensor_data(t, pos, acc)
    print(f"Generated GT size: {len(t)}")
    print(f"Generated CAM size: {len(data['cam']['t'])}")
    print(f"Generated IMU size: {len(data['imu']['t'])}")
