import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  useTheme,
  TextField,
  Button,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { tokens } from "../../theme";
import api from "../../../api"; // Adjust the import path as necessary
import { clients } from "../otherComponents/mockData";

const MemoModal = ({
  error,
  open,
  onClose,
  formData,
  setFormData,
  handleInputChange,
  clearFormData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Memo" : "Add Memo"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>

        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />
        <TextField
          label="Details"
          name="details"
          value={formData.details}
          onChange={handleInputChange}
          fullWidth
          required
          InputLabelProps={{
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />

        {/* 🔽 File Upload Input */}
        <input
          type="file"
          accept="*"
          onChange={(e) =>
            setFormData({ ...formData, file: e.target.files[0] })
          }
          style={{ marginTop: 8 }}
        />

        <Box gap={2} display="flex" justifyContent="end">
          <Button variant="contained" color="error" onClick={clearFormData}>
            Clear
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleFormSubmit}
          >
            {formData.id ? "Update" : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MemoModal;
