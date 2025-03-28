// components/admin/adminRsvpTable/CreateBatchRsvpDialog.tsx
import React, { useRef, useState } from "react";
import {
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CustomButton from "../../shared/CustomButton";
import {useAdminData} from "../../../context/AdminDataContext";

interface CreateBatchRsvpDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateBatchRsvpDialog: React.FC<CreateBatchRsvpDialogProps> = ({
                                                                       open,
                                                                       onClose,
                                                                     }) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    createAllRsvps,
    createAllLoading,
    createAllError,
  } = useAdminData();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleClickDropzone = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    const success = await createAllRsvps(selectedFile);
    if (success) {
      setSelectedFile(null);
      onClose();
    }
  };

  return (
      <Dialog
          open={open}
          onClose={onClose}
          fullWidth
          maxWidth="sm"
          slotProps={{
            paper: {
              sx: {
                background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                color: theme.palette.primary.contrastText,
                p: 2,
              },
            }
          }}
      >
        <DialogTitle
            sx={{
              color: `${theme.palette.secondary.main}`,
              textAlign: "center",
              fontWeight: "bold",
              mb: 1,
            }}
        >
          Batch Upload RSVPs
        </DialogTitle>
        <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
        >
          {createAllError && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {createAllError}
              </Alert>
          )}
          <Box
              onClick={handleClickDropzone}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              sx={{
                border: `2px dashed ${isDragging ? theme.palette.secondary.main : theme.palette.secondary.light}`,
                borderRadius: 2,
                width: "100%",
                p: 4,
                textAlign: "center",
                cursor: "pointer",
                transition: "border-color 0.3s ease-in-out, background-color 0.3s ease-in-out",
                backgroundColor: isDragging ? theme.palette.action.hover : "transparent",
              }}
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 48, mb: 1 }} />
            {selectedFile ? (
                <Typography variant="body1">{selectedFile.name}</Typography>
            ) : (
                <Typography variant="body1">
                  Drag and drop a CSV file here, or click to select one
                </Typography>
            )}
          </Box>
          <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileSelect}
          />
        </DialogContent>
        <DialogActions
            sx={{
              justifyContent: "center",
              gap: 2,
              mt: 1,
            }}
        >
          <CustomButton
              text="Cancel"
              onClick={onClose}
              variant="lightOutlined"
              width="100px"
          />
          <CustomButton
              text={createAllLoading ? "Uploading..." : "Save"}
              onClick={handleSave}
              variant="dark"
              width="100px"
              disabled={!selectedFile || createAllLoading}
          />
        </DialogActions>
      </Dialog>
  );
};

export default CreateBatchRsvpDialog;
