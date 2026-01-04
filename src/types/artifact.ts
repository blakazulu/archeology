/**
 * Core artifact types for the archaeology app
 */

export interface ArtifactImage {
  id: string;
  artifactId: string;
  blob: Blob;
  angle: ImageAngle;
  createdAt: Date;
  width: number;
  height: number;
}

export type ImageAngle =
  | 'front'
  | 'back'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'detail'
  | 'context';

export interface Model3D {
  id: string;
  artifactId: string;
  blob: Blob;
  format: 'glb' | 'gltf' | 'obj';
  createdAt: Date;
  source: '3d-single' | '3d-multi';
  metadata?: {
    vertices?: number;
    faces?: number;
    fileSize?: number;
  };
}

export interface InfoCard {
  id: string;
  artifactId: string;
  createdAt: Date;
  updatedAt: Date;

  // AI-generated fields
  material: string;
  estimatedAge: {
    range: string;
    confidence: 'high' | 'medium' | 'low';
    reasoning?: string;
  };
  possibleUse: string;
  culturalContext: string;
  similarArtifacts: string[];
  preservationNotes: string;

  // Metadata
  aiModel: string;
  aiConfidence: number;
  isHumanEdited: boolean;

  // Required disclaimer
  disclaimer: string;
}

export interface ColorVariant {
  id: string;
  artifactId: string;
  blob: Blob;
  createdAt: Date;

  colorScheme: ColorScheme;
  prompt: string;

  // Source tracking
  aiModel: string;
  isSpeculative: true; // Always true for AI-generated colors
}

export type ColorScheme =
  | 'roman'
  | 'greek'
  | 'egyptian'
  | 'mesopotamian'
  | 'weathered'
  | 'original'
  | 'custom';

export interface ArtifactMetadata {
  // User-provided
  name?: string;
  discoveryLocation?: string;
  excavationLayer?: string;
  siteName?: string;
  dateFound?: Date;
  notes?: string;

  // GPS coordinates (optional)
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };

  // Tags for organization
  tags?: string[];
}

export interface Artifact {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // Status
  status: ArtifactStatus;

  // Related data (stored separately, referenced by ID)
  imageIds: string[];
  model3DId?: string;
  infoCardId?: string;
  colorVariantIds: string[];

  // Inline metadata
  metadata: ArtifactMetadata;

  // Thumbnail for gallery (compressed)
  thumbnailBlob?: Blob;
}

export type ArtifactStatus =
  | 'draft'           // Just created, no processing done
  | 'images-captured' // Images uploaded
  | 'processing-3d'   // 3D reconstruction in progress
  | 'processing-info' // Info card generation in progress
  | 'complete'        // All processing done
  | 'error';          // Something failed

export interface ProcessingStatus {
  artifactId: string;
  step: ProcessingStep;
  progress: number; // 0-100
  message: string;
  error?: string;
}

export type ProcessingStep =
  | 'idle'
  | 'uploading'
  | 'reconstructing-3d'
  | 'generating-info'
  | 'colorizing'
  | 'complete'
  | 'error';
