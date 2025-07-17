import { toast } from "react-hot-toast";
import { getFile } from "@/api/app";
import { downloadFile } from "@/utils/helpers";

const useDownloadFile = () => {
  const t = useTranslations();
  const downloadFileMutation = useMutation({
    mutationFn: (data: App.DownloadFileData) => getFile(data.url),
    onSuccess: (response, variables) =>
      downloadFile(
        variables.fileName || last(split(variables.url, "/")),
        response.data
      ),
    onError: (error: App.ResponseError) =>
      toast.error(error.message || t("download_file_failed")),
  });

  return { downloadFileMutation };
};

export default useDownloadFile;
