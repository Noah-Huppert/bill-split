import {
  ChangeEvent,
  useContext,
  useEffect,
  useState,
  ReactNode,
  ReactElement,
  FunctionComponent,
} from "react";
import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import { v4 as uuidv4 } from "uuid";

import { IImage } from "../../../../api/src/models/bill";
import { ToasterCtx } from "../Toaster/Toaster";
import { Loadable, isLoading } from "../../lib/loadable";
import { Loading } from "../Loading/Loading";

/**
 * Displays images for a bill.
 */
export function Images({
  images,
  onUpload,
}: {
  readonly images: Loadable<IImage[]>,
  readonly onUpload: (images: ImageUploadDetails[]) => Promise<void>,
}) {
  return (
    <Paper
      sx={{
        paddingTop: "0.5rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          marginBottom: "1rem",
        }}
      >
        Images
      </Typography>

      {isLoading(images) ? <Loading /> : <ImagesContent onUpload={onUpload} images={images.data} />}
    </Paper>
  );
}

/**
 * Content to display images inside of <Images /> container element.
 */
function ImagesContent({
  images,
  onUpload,
}: {
  readonly images: IImage[],
  readonly onUpload: (images: ImageUploadDetails[]) => Promise<void>,
}) {
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

  return (
    <>
      {uploadMenuOpen && (
        <UploadImage
          onClose={() => setUploadMenuOpen(false)}
          onUpload={onUpload}
          alwaysShowButtons={true}
        />
      )}

      {images.length > 0 ? (
        <IconButton onClick={() => setUploadMenuOpen(true)}>
          <AddPhotoAlternateIcon />
          <Typography>Add Photos</Typography>
        </IconButton>
      ) : (
        <UploadImage          
          onClose={() => setUploadMenuOpen(false)}
          onUpload={onUpload}
          parentComponent={Box}
          showCloseButton={false}
        />
      )}

      <ImageList>
        {images.map((image) => (
          <ImageListItem key={image._id}>
            <img src={`data:${image.mimeType};base64, ${image.base64Data}`} />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}

/**
 * Status of file being read.
 */
enum FileReadStatus {
  Pending = "pending",
  Processing = "processing",
  Done = "done",
}

/**
 * Shows a file which was selected for upload and who's contents are being processed.
 * Allows the file to be removed.
 */
function FileToUpload({
  name,
  fileReader,
  onRemove,
  onDone,
}: {
  readonly name: string;
  readonly fileReader: FileReader;
  readonly onRemove: () => void;
  readonly onDone: () => void;
}) {
  const [status, setStatus] = useState(FileReadStatus.Pending);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fileReader.onloadstart = () => setStatus(FileReadStatus.Processing);
    fileReader.onloadend = () => {
      setStatus(FileReadStatus.Done);
      onDone();
    };
    fileReader.onabort = () => {
      setError("Upload canceled");
    };
    fileReader.onerror = (e) => {
      setError(`Upload failed`);
      console.error(`File upload failed: ${e}`);
      onRemove();
    };
  }, [setStatus, fileReader]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",

        marginTop: "0.5rem",
      }}
    >
      <IconButton
        sx={{
          margin: 0,
          padding: 0,
        }}
        onClick={() => {
          if (status !== FileReadStatus.Done || error !== null) {
            fileReader.abort();
          }
          onRemove();
        }}
      >
        <ClearIcon />
      </IconButton>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          marginLeft: "0.5rem",
        }}
      >
        <Typography>{name}</Typography>

        {status !== FileReadStatus.Done && (
          <LinearProgress
            variant={
              status == FileReadStatus.Pending ? "determinate" : "indeterminate"
            }
            value={0}
          />
        )}
      </Box>
    </Box>
  );
}

/**
 * Details about an image to upload.
 */
export interface ImageUploadDetails {
  /**
   * MIME type of image.
   */
  readonly mimeType: string;

  /**
   * Base64 encoded data.
   */
  readonly base64Data: string;
}

/**
 * Form which allows multiple images to be uploaded.
 * @prop onClose Handler run when the close button is clicked
 * @prop onUpload Handler run which does the act of uploading the images, errors thrown will be shown as toasts. Argument is an array of base64 content with the content type at the beginning, as the <img /> element expects
 * @prop parentComponent Is the component in which the whole component's contents will be wrapped
 * @prop alwaysShowButtons If true then the buttons will always show even if no images are selected
 * @prop showCloseButton If true then the close button will be shown
 */
function UploadImage({
  onClose,
  onUpload,
  parentComponent = DefaultUploadImageParent,
  alwaysShowButtons = false,
  showCloseButton = true,
}: {
  readonly onClose: () => void;
  readonly onUpload: (images: ImageUploadDetails[]) => Promise<void>;
  readonly parentComponent?: FunctionComponent<{
    readonly children: ReactElement;
  }>;
  readonly alwaysShowButtons?: boolean;
  readonly showCloseButton?: boolean;
}) {
  const toast = useContext(ToasterCtx);
  const [files, setFiles] = useState<{
    [key: string]: {
      fileReader: FileReader;
      mimeType: string;
      name: string;
      done: boolean;
    };
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const onFileAdded = async (e: ChangeEvent<HTMLInputElement>) => {
    // Check file was selected
    if (e.target.files === null || e.target.files.length < 1) {
      return;
    }

    const targetFiles = e.target.files;

    // Check file isn't already going to be uploaded
    if (
      Object.values(files).filter((file) => file.name === targetFiles[0].name)
        .length > 0
    ) {
      toast({
        _tag: "info",
        message: `File '${targetFiles[0].name}'
         is already added for upload`,
      });
      return;
    }

    // Start reading file
    const filesCopy = { ...files };
    const uuid = uuidv4();
    const reader = new FileReader();

    filesCopy[uuid] = {
      fileReader: reader,
      mimeType: targetFiles[0].type,
      name: targetFiles[0].name,
      done: false,
    };
    reader.readAsDataURL(e.target.files[0]);

    setFiles(filesCopy);
  };

  const onFormSubmit = async () => {
    try {
      setIsUploading(true);

      // Get file contents from FileReaders
      let badFiles: {
        uuid: string,
        name: string,
        result: any,
      }[] = [];
      let uploadFiles: {
        mimeType: string,
        base64Data: string,
      }[] = [];

      for (const uuid of Object.keys(files)) {
        const file = files[uuid];

        // Check if result is as expected
        if (file.fileReader.result === null || typeof file.fileReader.result !== "string") {
          badFiles.push({
            uuid: uuid,
            name: file.name,
            result: file.fileReader.result,
          });
          continue;
        }

        // Put together file to upload
        uploadFiles.push({
          mimeType: file.mimeType,
          base64Data: file.fileReader.result,
        });
      }
      
      if (badFiles.length > 0) {
        toast({
          _tag: "error",
          error: {
            userError: `Failed to prepare file(s) for upload: ${badFiles.map((file) => file.name).join(", ")}`,
            systemError: `FileReader(s) result field was not a string: ${JSON.stringify(badFiles)}`,
          },
        });
        return;
      }

      // Call upload handler
      await onUpload(uploadFiles);
      setIsUploading(false);
    } catch (e) {
      setIsUploading(false);
      toast({
        _tag: "error",
        error: {
          userError: "Failed to upload file(s)",
          systemError: `${e}`,
        },
      });
    }
  };

  const ParentComponent = parentComponent;

  return (
    <ParentComponent>
      <form onSubmit={onFormSubmit}>
        <Button
          component="label"
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0.5rem",

            borderStyle: "dashed",
            borderWidth: "0.1rem",

            color: "text.primary",
          }}
        >
          <input onChange={onFileAdded} type="file" accept="image/*" hidden />
          <AddPhotoAlternateIcon fontSize="large" />
          <Typography
            variant="h6"
            sx={{
              marginTop: "0.5rem",
            }}
          >
            Upload Images
          </Typography>
        </Button>

        <Box>
          {Object.keys(files).map((uuid) => (
            <FileToUpload
              key={uuid}
              name={files[uuid].name}
              fileReader={files[uuid].fileReader}
              onRemove={() => {
                const filesCopy = { ...files };
                delete filesCopy[uuid];
                setFiles(filesCopy);
              }}
              onDone={() => {
                const filesCopy = { ...files };
                filesCopy[uuid].done = true;
                setFiles(filesCopy);
              }}
            />
          ))}
        </Box>

        {alwaysShowButtons ||
          (Object.keys(files).length > 0 && (
            <Box
              sx={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {showCloseButton && (
                <Button
                  variant="outlined"
                  sx={{
                    marginRight: "1rem",
                    color: "text.primary",
                    borderColor: "text.primary",
                    ":hover": {
                      borderColor: "text.primary",
                    },
                  }}
                  onClick={onClose}
                >
                  Close
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={
                  isUploading ||
                  Object.keys(files).length == 0 ||
                  Object.values(files).filter((file) => file.done === false)
                    .length > 0
                }
              >
                {isUploading && <Loading />}
                Upload
              </Button>
            </Box>
          ))}
      </form>
    </ParentComponent>
  );
}

/**
 * Default value for UploadImage parentComponent property.
 */
function DefaultUploadImageParent({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <Paper
      sx={{
        display: "inline-block",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      {children}
    </Paper>
  );
}
