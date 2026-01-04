import { Camera, Upload, Info } from 'lucide-react';

export function CapturePage() {
  return (
    <div className="px-4 py-6">
      {/* Info Banner */}
      <div className="mb-6 rounded-xl bg-desert-teal/10 border border-desert-teal/30 p-4">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-desert-teal shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-desert-teal">
              For best results
            </p>
            <p className="text-stone-gray mt-1">
              Capture multiple angles of your artifact on a plain background with good lighting.
            </p>
          </div>
        </div>
      </div>

      {/* Capture Options */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Choose Capture Method
        </h3>

        {/* Camera Capture */}
        <button
          className="w-full flex items-center gap-4 rounded-xl bg-terracotta p-5 text-left text-bone-white shadow-md transition-all hover:bg-clay active:scale-[0.98]"
          onClick={() => {
            // TODO: Implement camera capture
            console.log('Camera capture');
          }}
        >
          <div className="rounded-full bg-bone-white/20 p-3">
            <Camera className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">Use Camera</h4>
            <p className="text-bone-white/80 text-sm">
              Capture photos directly from your device
            </p>
          </div>
        </button>

        {/* File Upload */}
        <button
          className="w-full flex items-center gap-4 rounded-xl bg-aged-paper border-2 border-dashed border-desert-sand p-5 text-left transition-all hover:border-clay hover:bg-parchment active:scale-[0.98]"
          onClick={() => {
            // TODO: Implement file upload
            console.log('File upload');
          }}
        >
          <div className="rounded-full bg-sienna/10 p-3">
            <Upload className="h-8 w-8 text-sienna" />
          </div>
          <div>
            <h4 className="font-semibold text-lg text-charcoal">Upload Files</h4>
            <p className="text-stone-gray text-sm">
              Select existing photos from your device
            </p>
          </div>
        </button>
      </div>

      {/* Capture Mode Selector (for future) */}
      <div className="mt-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          Reconstruction Mode
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border-2 border-terracotta bg-terracotta/5 p-4">
            <h4 className="font-medium text-terracotta mb-1">Single Photo</h4>
            <p className="text-xs text-stone-gray">
              Quick 3D from one image
            </p>
          </div>
          <div className="rounded-xl border border-desert-sand bg-aged-paper p-4 opacity-75">
            <h4 className="font-medium text-charcoal mb-1">Multi-Photo</h4>
            <p className="text-xs text-stone-gray">
              Detailed 3D from multiple angles
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8">
        <h3 className="font-heading text-lg font-semibold text-charcoal mb-4">
          Capture Tips
        </h3>
        <ul className="space-y-2 text-sm text-stone-gray">
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Use even, diffused lighting
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Place artifact on a neutral background
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Avoid harsh shadows
          </li>
          <li className="flex gap-2">
            <span className="text-terracotta">•</span>
            Include a scale reference if possible
          </li>
        </ul>
      </div>
    </div>
  );
}
