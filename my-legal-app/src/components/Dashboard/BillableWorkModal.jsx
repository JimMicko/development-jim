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

const BillableWorkModal = ({
  error,
  open,
  onClose,
  formData,
  clientsData,
  handleInputChange,
  clearFormData,
  handleFormSubmit,
  errorMessage,
  showErrorMessage,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [clientCases, setClientCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClientSelect = async (newValue) => {
    if (!newValue || !newValue.client_id) {
      setClientCases([]);
      // Also update formData.client_id to empty if needed
      handleInputChange({
        target: { name: "client_id", value: "" },
      });
      return;
    }

    try {
      setLoading(true);

      // Remove extra } in URL and no need for Promise.all with one call
      const clientCasesResponse = await api.post(`/userdashboard/getallcases`, {
        client_id: newValue.client_id,
      });

      const clientCasesData = clientCasesResponse.data;

      setClientCases(clientCasesData);

      // Update the client_id in formData
      handleInputChange({
        target: {
          name: "client_id",
          value: newValue.client_id,
        },
      });
    } catch (error) {
      console.error("Error fetching client cases:", error);
    } finally {
      setLoading(false);
    }
  };

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
          {formData.id ? "Update Billable Work" : "Add Billable Work"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <TextField
          label="Date of Service"
          name="date_of_service"
          value={formData.date_of_service}
          onChange={handleInputChange}
          fullWidth
          type="date"
          required
          InputLabelProps={{
            shrink: true,
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
        />
        <Autocomplete
          options={clientsData}
          getOptionLabel={(option) =>
            option.employeeId === ""
              ? ""
              : `${option.first_name} ${option.last_name}`
          }
          value={
            clientsData.find((emp) => emp.client_id === formData.client_id) ||
            null
          }
          onChange={(event, newValue) => {
            handleClientSelect(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Client"
              name="client_id"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              error={!!error}
              helperText={error}
            />
          )}
        />
        <Autocomplete
          options={clientCases}
          getOptionLabel={(option) => option.case_title || ""}
          value={
            clientCases.find((c) => c.case_id === formData.case_id) || null
          }
          onChange={(event, newValue) => {
            handleInputChange({
              target: {
                name: "case_id",
                value: newValue ? newValue.case_id : "",
              },
            });
          }}
          disabled={!formData.client_id} // <-- disable if no client selected
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Case"
              name="case_id"
              fullWidth
              required
              InputLabelProps={{
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
              error={!!error}
              helperText={error}
            />
          )}
        />

        <TextField
          label="Job Performed"
          name="job_performed"
          value={formData.job_performed}
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
        <FormControl fullWidth>
          <InputLabel
            id="billing_type_select_label"
            style={{ color: colors.grey[100] }}
            required
          >
            Billing Type
          </InputLabel>
          <Select
            labelId="billing_type_select_label"
            name="billing_type"
            value={formData.billing_type}
            onChange={handleInputChange}
            label="typeOfCertificate"
            fullWidth
          >
            <MenuItem value={"Fixed Rate"}>Fixed Rate</MenuItem>
            <MenuItem value={"Hourly Rate"}>Hourly Rate</MenuItem>
          </Select>
        </FormControl>
        {formData.billing_type === "Fixed Rate" && (
          <TextField
            label="Rate"
            name="fixed_rate"
            value={formData.fixed_rate}
            onChange={handleInputChange}
            type="number"
            InputProps={{
              inputProps: { min: 0 }, // Prevent negative values
            }}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
              style: {
                color: colors.grey[100],
              },
            }}
            autoComplete="off"
          />
        )}
        {formData.billing_type === "Hourly Rate" && (
          <Box sx={{ display: "flex", gap: "20px" }}>
            <TextField
              label="From"
              name="hourly_rate_from"
              value={formData.hourly_rate_from}
              onChange={handleInputChange}
              fullWidth
              type="date"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
            <TextField
              label="To"
              name="hourly_rate_to"
              value={formData.hourly_rate_to}
              onChange={handleInputChange}
              fullWidth
              type="date"
              required
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Box>
        )}
        <TextField
          label="Additional Notes"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            style: {
              color: colors.grey[100],
            },
          }}
          autoComplete="off"
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

export default BillableWorkModal;
