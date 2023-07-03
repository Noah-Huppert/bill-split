import { ChangeEvent, useEffect, useState } from "react";
import { Box, Button, IconButton, ImageList, ImageListItem, LinearProgress, Paper, Typography } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ClearIcon from '@mui/icons-material/Clear';
import { v4 as uuidv4 } from "uuid";

import { IImage } from "../../../../api/src/models/bill";
import { stat } from "fs";

export function Images({
  images,
}: {
  readonly images: IImage[],
}) {
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);

  return (
    <>
      {uploadMenuOpen && (
        <UploadImage
          onClose={() => setUploadMenuOpen(false)}
        />
      )}

      <Paper>
        <Typography variant="h6">Images</Typography>
        
        <IconButton
          onClick={() => setUploadMenuOpen(true)}
        >
          <AddPhotoAlternateIcon />
          <Typography>
            Add Photos
          </Typography>
        </IconButton>
        <ImageList>
          {images.map((image) => (
            <ImageListItem key={image._id}>
              <img src={`data:${image.mimeType};base64, ${image.base64Data}`} />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>
    </>
  );
}

enum FileReadStatus {
  Pending = "pending",
  Processing = "processing",
  Done = "done",
}

function FileToUpload({
  name,
  fileReader,
  onRemove,
}: {
  readonly name: string,
  readonly fileReader: FileReader,
  readonly onRemove: () => void,
}) {
  const [status, setStatus] = useState(FileReadStatus.Pending);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    

    fileReader.onloadstart = () => setStatus(FileReadStatus.Processing);
    fileReader.onloadend = () => setStatus(FileReadStatus.Done);
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
        <Typography>
          {name}
        </Typography>

        {status !== FileReadStatus.Done && (
          <LinearProgress
            variant={status == FileReadStatus.Pending ? "determinate" : "indeterminate"}
            value={0}
          />
        )}
      </Box>
    </Box>
  );
}

function UploadImage({
  onClose,
}: {
  readonly onClose: () => void,
}) {
  const [files, setFiles] = useState<{ [key: string]: {
    fileReader: FileReader,
    name: string,
  }}>({});

  const onFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }
    
    const filesCopy = {...files};
    const uuid = uuidv4();
    const reader = new FileReader();

    filesCopy[uuid] = {
      fileReader: reader,
      name: e.target.files[0].name,
    };
    reader.readAsArrayBuffer(e.target.files[0]);
      
    setFiles(filesCopy);
  };

  return (
    <Paper
      sx={{
        display: "inline-block",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <form>
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
            <input
              onChange={onFileUpload}
              type="file"
              accept="image/*"
              hidden
            />
            <AddPhotoAlternateIcon fontSize="large" />
            <Typography
              variant="h6"
              sx={{
                marginTop: "0.5rem",
              }}
            >
              Upload Image
            </Typography>
          </Button>

          <Box>
            {Object.keys(files).map((uuid) => (
              <FileToUpload
                key={uuid}
                name={files[uuid].name}
                fileReader={files[uuid].fileReader}
                onRemove={() => {
                  const filesCopy = {...files};
                  delete filesCopy[uuid];
                  setFiles(filesCopy);
                }}
              />
            ))}
          </Box>

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
                }
              }}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              Upload
            </Button>
          </Box>
      </form>
    </Paper>
  )
}