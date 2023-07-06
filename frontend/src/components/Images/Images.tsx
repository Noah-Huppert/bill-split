import { ChangeEvent, useContext, useEffect, useState, ReactNode, ReactElement, FunctionComponent } from "react";
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
export function Images({ images }: { readonly images: Loadable<IImage[]> }) {
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
      >Images</Typography>

      {isLoading(images) ? (
        <Loading />
      ) : (
        <ImagesContent images={images.data} />
      )}
    </Paper>
  );
}

/**
 * Content to display images inside of <Images /> container element.
 */
function ImagesContent({
  images,
}: {
  readonly images: IImage[],
}) {
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

  return (
    <>
      {uploadMenuOpen && (
        <UploadImage onClose={() => setUploadMenuOpen(false)} />
      )}

      {images.length > 0 ? (
        <IconButton onClick={() => setUploadMenuOpen(true)}>
          <AddPhotoAlternateIcon />
          <Typography>Add Photos</Typography>
        </IconButton>
      ) : (
        <UploadImage parentComponent={Box} onClose={() => setUploadMenuOpen(false)} />
      )}
      
      <ImageList>
        {images.map((image) => (
          <ImageListItem key={image._id}>
            <img src={`data:${image.mimeType};base64, ${image.base64Data}`} />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  )
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
 * Form which allows multiple images to be uploaded.
 */
function UploadImage({
  parentComponent = DefaultUploadImageParent,
  onClose,
}: {
  readonly parentComponent?: FunctionComponent<{ readonly children: ReactElement }>,
   readonly onClose: () => void,
}) {
  const toast = useContext(ToasterCtx);
  const [files, setFiles] = useState<{
    [key: string]: {
      fileReader: FileReader;
      name: string;
      done: boolean;
    };
  }>({});

  const onFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
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
      name: e.target.files[0].name,
      done: false,
    };
    reader.readAsArrayBuffer(e.target.files[0]);

    setFiles(filesCopy);
  };

  const ParentComponent = parentComponent;

  return (
    <ParentComponent>
      <form onSubmit={() => {}}>
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
          <input onChange={onFileUpload} type="file" accept="image/*" hidden />
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

        {Object.keys(files).length > 0 && (
          <Box
            sx={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
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
            <Button
              type="submit"
              variant="contained"
              disabled={
                Object.values(files).filter((file) => file.done === false)
                  .length > 0
              }
            >
              Upload
            </Button>
          </Box>
        )}
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
  readonly children: ReactNode,
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