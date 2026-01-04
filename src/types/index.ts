export * from './artifact';
export * from './camera';

// Re-export commonly used types
export type {
  Artifact,
  ArtifactImage,
  ArtifactMetadata,
  ArtifactStatus,
  Model3D,
  InfoCard,
  ColorVariant,
  ColorScheme,
  ProcessingStatus,
  ProcessingStep,
  ImageAngle,
} from './artifact';

export type {
  CameraFacing,
  CameraStatus,
  CameraError,
  CameraErrorType,
  CameraCapabilities,
  CameraDevice,
  UseCameraOptions,
  UseCameraReturn,
} from './camera';
