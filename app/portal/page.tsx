import UploadPanel from "@/components/UploadPanel";
import { MonitorPlay, CheckCircle2 } from "lucide-react";

export default function PortalPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 border-b border-border-subtle pb-4">
        <h2 className="text-2xl font-bold text-text-primary mb-2">डिजिटल न्यूज़ पोर्टल नियंत्रण (Digital Portal Panel)</h2>
        <p className="text-text-muted">Upload screenshots or PDFs from digital news portals for AI narrative extraction.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Upload */}
        <div className="space-y-6">
          <UploadPanel sourceType="portal" />
        </div>

        {/* Right Column: Instructions */}
        <div className="bg-bg-panel border border-border-subtle rounded-xl overflow-hidden shadow-lg shadow-black/5 dark:shadow-black/20 p-6">
          <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <MonitorPlay className="text-blue-500" /> Instructions
          </h3>
          <ul className="space-y-4 text-text-secondary text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16} />
              <span>Take a full-page screenshot of the news portal article or save it as a PDF.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16} />
              <span>Ensure the text is legible and not heavily compressed.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={16} />
              <span>Upload the file on the left panel. The background worker will OCR the image and extract the narrative exactly like an e-paper.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
