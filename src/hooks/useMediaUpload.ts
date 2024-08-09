import { useToast } from "@/components/ui/use-toast";
import { MAX_NUM_FILES_PER_UPLOAD } from "@/lib/constants";
import type { Attachment } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { useState } from "react";

export default function useMediaUpload() {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File([file], `attachment_${crypto.randomUUID()}.${extension}`, {
          type: file.type,
        });
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((attachment) => {
          const uploadResult = res.find((result) => result.name === attachment.file.name);

          if (!uploadResult) return attachment;

          return {
            ...attachment,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        })
      );
    },
    onUploadError(error) {
      setAttachments((prev) => prev.filter((attachment) => !attachment.isUploading));
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait for the current uplaod to finish.",
      });
      return;
    }

    if (attachments.length + files.length > MAX_NUM_FILES_PER_UPLOAD) {
      toast({
        variant: "destructive",
        description: `You can only upload up to ${MAX_NUM_FILES_PER_UPLOAD} attachments per post.`,
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((attachment) => attachment.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
