import Dexie, { type Table } from 'dexie';
import type {
  Artifact,
  ArtifactImage,
  Model3D,
  InfoCard,
  ColorVariant,
} from '@/types';

/**
 * Archaeology App IndexedDB Database
 *
 * Uses Dexie.js for type-safe IndexedDB access.
 * All data is stored locally for offline-first operation.
 */
export class ArchaeologyDB extends Dexie {
  // Tables
  artifacts!: Table<Artifact, string>;
  images!: Table<ArtifactImage, string>;
  models!: Table<Model3D, string>;
  infoCards!: Table<InfoCard, string>;
  colorVariants!: Table<ColorVariant, string>;

  constructor() {
    super('ArchaeologyDB');

    // Define schema
    // Note: Only indexed fields need to be listed
    this.version(1).stores({
      artifacts: 'id, createdAt, updatedAt, status, [metadata.siteName]',
      images: 'id, artifactId, angle, createdAt',
      models: 'id, artifactId, createdAt',
      infoCards: 'id, artifactId, createdAt',
      colorVariants: 'id, artifactId, colorScheme, createdAt',
    });
  }
}

// Singleton database instance
export const db = new ArchaeologyDB();

/**
 * Database helper functions
 */

// Artifacts
export async function createArtifact(artifact: Artifact): Promise<string> {
  return await db.artifacts.add(artifact);
}

export async function getArtifact(id: string): Promise<Artifact | undefined> {
  return await db.artifacts.get(id);
}

export async function getAllArtifacts(): Promise<Artifact[]> {
  return await db.artifacts.orderBy('createdAt').reverse().toArray();
}

export async function updateArtifact(
  id: string,
  updates: Partial<Artifact>
): Promise<void> {
  await db.artifacts.update(id, { ...updates, updatedAt: new Date() });
}

export async function deleteArtifact(id: string): Promise<void> {
  // Delete all related data
  await db.transaction('rw', [db.artifacts, db.images, db.models, db.infoCards, db.colorVariants], async () => {
    await db.images.where('artifactId').equals(id).delete();
    await db.models.where('artifactId').equals(id).delete();
    await db.infoCards.where('artifactId').equals(id).delete();
    await db.colorVariants.where('artifactId').equals(id).delete();
    await db.artifacts.delete(id);
  });
}

// Images
export async function addImage(image: ArtifactImage): Promise<string> {
  const id = await db.images.add(image);
  // Update artifact's imageIds
  const artifact = await db.artifacts.get(image.artifactId);
  if (artifact) {
    await db.artifacts.update(image.artifactId, {
      imageIds: [...artifact.imageIds, image.id],
      updatedAt: new Date(),
    });
  }
  return id;
}

export async function getImagesForArtifact(artifactId: string): Promise<ArtifactImage[]> {
  return await db.images.where('artifactId').equals(artifactId).toArray();
}

export async function deleteImage(id: string): Promise<void> {
  const image = await db.images.get(id);
  if (image) {
    // Remove from artifact's imageIds
    const artifact = await db.artifacts.get(image.artifactId);
    if (artifact) {
      await db.artifacts.update(image.artifactId, {
        imageIds: artifact.imageIds.filter((imgId) => imgId !== id),
        updatedAt: new Date(),
      });
    }
    await db.images.delete(id);
  }
}

// 3D Models
export async function saveModel(model: Model3D): Promise<string> {
  const id = await db.models.add(model);
  // Update artifact's model3DId
  await db.artifacts.update(model.artifactId, {
    model3DId: model.id,
    updatedAt: new Date(),
  });
  return id;
}

export async function getModelForArtifact(artifactId: string): Promise<Model3D | undefined> {
  return await db.models.where('artifactId').equals(artifactId).first();
}

// Info Cards
export async function saveInfoCard(infoCard: InfoCard): Promise<string> {
  const id = await db.infoCards.add(infoCard);
  // Update artifact's infoCardId
  await db.artifacts.update(infoCard.artifactId, {
    infoCardId: infoCard.id,
    updatedAt: new Date(),
  });
  return id;
}

export async function getInfoCardForArtifact(artifactId: string): Promise<InfoCard | undefined> {
  return await db.infoCards.where('artifactId').equals(artifactId).first();
}

export async function updateInfoCard(
  id: string,
  updates: Partial<InfoCard>
): Promise<void> {
  await db.infoCards.update(id, { ...updates, updatedAt: new Date() });
}

// Color Variants
export async function addColorVariant(variant: ColorVariant): Promise<string> {
  const id = await db.colorVariants.add(variant);
  // Update artifact's colorVariantIds
  const artifact = await db.artifacts.get(variant.artifactId);
  if (artifact) {
    await db.artifacts.update(variant.artifactId, {
      colorVariantIds: [...artifact.colorVariantIds, variant.id],
      updatedAt: new Date(),
    });
  }
  return id;
}

export async function getColorVariantsForArtifact(artifactId: string): Promise<ColorVariant[]> {
  return await db.colorVariants.where('artifactId').equals(artifactId).toArray();
}

export async function deleteColorVariant(id: string): Promise<void> {
  const variant = await db.colorVariants.get(id);
  if (variant) {
    // Remove from artifact's colorVariantIds
    const artifact = await db.artifacts.get(variant.artifactId);
    if (artifact) {
      await db.artifacts.update(variant.artifactId, {
        colorVariantIds: artifact.colorVariantIds.filter((vId) => vId !== id),
        updatedAt: new Date(),
      });
    }
    await db.colorVariants.delete(id);
  }
}

// Export/Import
export async function exportAllData(): Promise<{
  artifacts: Artifact[];
  images: ArtifactImage[];
  models: Model3D[];
  infoCards: InfoCard[];
  colorVariants: ColorVariant[];
}> {
  return {
    artifacts: await db.artifacts.toArray(),
    images: await db.images.toArray(),
    models: await db.models.toArray(),
    infoCards: await db.infoCards.toArray(),
    colorVariants: await db.colorVariants.toArray(),
  };
}

export async function clearAllData(): Promise<void> {
  await db.transaction('rw', [db.artifacts, db.images, db.models, db.infoCards, db.colorVariants], async () => {
    await db.artifacts.clear();
    await db.images.clear();
    await db.models.clear();
    await db.infoCards.clear();
    await db.colorVariants.clear();
  });
}
