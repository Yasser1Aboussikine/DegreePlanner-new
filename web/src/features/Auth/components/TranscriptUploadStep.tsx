import type { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import type { SignUpFormData } from "@/schemas/auth.schema";
import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";

interface TranscriptUploadStepProps {
  form: UseFormReturn<SignUpFormData>;
}

export const TranscriptUploadStep = ({ form }: TranscriptUploadStepProps) => {
  const {
    setValue,
    formState: { errors },
  } = form;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("transcriptFile", file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValue("transcriptFile", undefined);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Transcript (Optional)</Label>
        <p className="text-sm text-muted-foreground">
          Upload your academic transcript (PDF, JPEG, or PNG, max 5MB)
        </p>

        {!selectedFile ? (
          <label
            htmlFor="transcript"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-accent transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPEG, or PNG (max 5MB)
              </p>
            </div>
            <input
              id="transcript"
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        )}

        {errors.transcriptFile && (
          <p className="text-sm text-destructive">
            {errors.transcriptFile.message as string}
          </p>
        )}
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
        <h4 className="text-sm font-semibold text-foreground">
          Review Your Information
        </h4>
        <p className="text-xs text-muted-foreground">
          Before submitting, please review all the information you've entered.
          Make sure your email address is correct as we'll use it to verify your
          account.
        </p>
      </div>
    </div>
  );
};
