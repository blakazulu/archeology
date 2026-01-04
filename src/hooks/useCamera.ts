import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  CameraFacing,
  CameraStatus,
  CameraError,
  CameraErrorType,
  CameraCapabilities,
  CameraDevice,
  UseCameraOptions,
  UseCameraReturn,
} from '@/types/camera';

/**
 * Maps MediaDevices API errors to our CameraErrorType
 */
function mapErrorType(error: Error): CameraErrorType {
  const name = error.name;

  switch (name) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return 'permission-denied';
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return 'not-found';
    case 'OverconstrainedError':
    case 'ConstraintNotSatisfiedError':
      return 'overconstrained';
    case 'NotReadableError':
    case 'TrackStartError':
      return 'not-readable';
    case 'AbortError':
      return 'abort';
    case 'SecurityError':
      return 'security';
    case 'TypeError':
      return 'not-supported';
    default:
      return 'unknown';
  }
}

/**
 * Gets user-friendly error messages
 */
function getErrorMessage(type: CameraErrorType): string {
  switch (type) {
    case 'permission-denied':
      return 'Camera access was denied. Please allow camera access in your browser settings.';
    case 'not-found':
      return 'No camera found on this device.';
    case 'overconstrained':
      return 'Camera does not support the requested settings.';
    case 'not-readable':
      return 'Camera is already in use by another application.';
    case 'abort':
      return 'Camera access was interrupted.';
    case 'security':
      return 'Camera access is not allowed in this context (requires HTTPS).';
    case 'not-supported':
      return 'Camera is not supported in this browser.';
    default:
      return 'An unknown camera error occurred.';
  }
}

/**
 * Determines camera facing direction from device label or constraints
 */
function detectFacing(device: MediaDeviceInfo): CameraFacing | 'unknown' {
  const label = device.label.toLowerCase();

  if (label.includes('front') || label.includes('user') || label.includes('facetime')) {
    return 'user';
  }
  if (label.includes('back') || label.includes('rear') || label.includes('environment')) {
    return 'environment';
  }

  return 'unknown';
}

/**
 * Hook for accessing device camera with full control
 * Handles permissions, multiple cameras, and image capture
 */
export function useCamera(options: UseCameraOptions = {}): UseCameraReturn {
  const {
    initialFacing = 'environment',
    resolution,
    autoStart = false,
  } = options;

  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>('idle');
  const [error, setError] = useState<CameraError | null>(null);
  const [currentFacing, setCurrentFacing] = useState<CameraFacing>(initialFacing);
  const [capabilities, setCapabilities] = useState<CameraCapabilities | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>([]);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Check if camera is supported
  const isSupported = typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices;

  /**
   * Enumerate available camera devices
   */
  const enumerateDevices = useCallback(async (): Promise<CameraDevice[]> => {
    if (!isSupported) return [];

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.slice(0, 4)}`,
          facing: detectFacing(device),
        }));

      setDevices(videoDevices);

      // Determine capabilities
      const hasFront = videoDevices.some(d => d.facing === 'user');
      const hasBack = videoDevices.some(d => d.facing === 'environment');

      setCapabilities({
        hasMultipleCameras: videoDevices.length > 1,
        hasFrontCamera: hasFront,
        hasBackCamera: hasBack,
        supportsTorch: false, // Would need to check track capabilities
        supportsZoom: false,
      });

      return videoDevices;
    } catch {
      return [];
    }
  }, [isSupported]);

  /**
   * Stop all tracks in the current stream
   */
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus('idle');
    setError(null);
  }, [stream]);

  /**
   * Start the camera with specified facing direction
   */
  const startCamera = useCallback(async (facing: CameraFacing = currentFacing): Promise<void> => {
    if (!isSupported) {
      setStatus('not-supported');
      setError({
        type: 'not-supported',
        message: getErrorMessage('not-supported'),
      });
      return;
    }

    // Stop existing stream first
    stopCamera();
    setStatus('requesting');
    setError(null);

    try {
      // Build constraints
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          ...(resolution?.width && { width: { ideal: resolution.width } }),
          ...(resolution?.height && { height: { ideal: resolution.height } }),
          ...(resolution?.aspectRatio && { aspectRatio: { ideal: resolution.aspectRatio } }),
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);
      setCurrentFacing(facing);
      setStatus('active');

      // Attach to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              resolve();
            };
          } else {
            resolve();
          }
        });
      }

      // Enumerate devices after getting permissions
      await enumerateDevices();

    } catch (err) {
      const error = err as Error;
      const errorType = mapErrorType(error);

      setStatus(errorType === 'permission-denied' ? 'denied' : 'error');
      setError({
        type: errorType,
        message: getErrorMessage(errorType),
        originalError: error,
      });
    }
  }, [isSupported, currentFacing, resolution, stopCamera, enumerateDevices]);

  /**
   * Switch between front and back camera
   */
  const switchCamera = useCallback(async (): Promise<void> => {
    const newFacing: CameraFacing = currentFacing === 'user' ? 'environment' : 'user';
    await startCamera(newFacing);
  }, [currentFacing, startCamera]);

  /**
   * Capture current frame as image blob
   */
  const captureImage = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !stream) {
      return null;
    }

    const video = videoRef.current;

    // Create or reuse canvas
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        'image/jpeg',
        0.9
      );
    });
  }, [stream]);

  /**
   * Check camera permission status
   */
  const checkPermission = useCallback(async (): Promise<PermissionState | null> => {
    if (!isSupported) return null;

    try {
      // Note: permissions.query for camera may not be supported in all browsers
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state;
    } catch {
      // Fallback: permission query not supported
      return null;
    }
  }, [isSupported]);

  /**
   * Request camera permission without starting stream
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false;

    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Immediately stop - we just wanted permission
      tempStream.getTracks().forEach(track => track.stop());
      await enumerateDevices();
      return true;
    } catch {
      return false;
    }
  }, [isSupported, enumerateDevices]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart && isSupported) {
      startCamera();
    }

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Listen for device changes
  useEffect(() => {
    if (!isSupported) return;

    const handleDeviceChange = () => {
      enumerateDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [isSupported, enumerateDevices]);

  return {
    stream,
    videoRef,
    status,
    error,
    isActive: status === 'active',
    isLoading: status === 'requesting',
    currentFacing,
    capabilities,
    devices,
    startCamera: () => startCamera(),
    stopCamera,
    switchCamera,
    captureImage,
    checkPermission,
    requestPermission,
  };
}
