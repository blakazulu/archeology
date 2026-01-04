/**
 * Camera-related types for the archaeology app
 */

export type CameraFacing = 'user' | 'environment';

export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'error'
  | 'denied'
  | 'not-supported';

export interface CameraError {
  type: CameraErrorType;
  message: string;
  originalError?: Error;
}

export type CameraErrorType =
  | 'not-supported'
  | 'permission-denied'
  | 'not-found'
  | 'overconstrained'
  | 'not-readable'
  | 'abort'
  | 'security'
  | 'unknown';

export interface CameraCapabilities {
  hasMultipleCameras: boolean;
  hasFrontCamera: boolean;
  hasBackCamera: boolean;
  supportsTorch: boolean;
  supportsZoom: boolean;
}

export interface CameraDevice {
  deviceId: string;
  label: string;
  facing: CameraFacing | 'unknown';
}

export interface UseCameraOptions {
  /**
   * Which camera to use initially
   * @default 'environment' (back camera)
   */
  initialFacing?: CameraFacing;

  /**
   * Video resolution constraints
   */
  resolution?: {
    width?: number;
    height?: number;
    aspectRatio?: number;
  };

  /**
   * Whether to automatically start the camera
   * @default false
   */
  autoStart?: boolean;
}

export interface UseCameraReturn {
  // Stream and refs
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;

  // Status
  status: CameraStatus;
  error: CameraError | null;
  isActive: boolean;
  isLoading: boolean;

  // Camera info
  currentFacing: CameraFacing;
  capabilities: CameraCapabilities | null;
  devices: CameraDevice[];

  // Actions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => Promise<void>;
  captureImage: () => Promise<Blob | null>;

  // Permissions
  checkPermission: () => Promise<PermissionState | null>;
  requestPermission: () => Promise<boolean>;
}
