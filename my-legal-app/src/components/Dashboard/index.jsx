import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBalanceScale,
  faHandshake,
  faSackDollar,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import EventNoteIcon from "@mui/icons-material/EventNote";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Swal from "sweetalert2";
import Header from "../otherComponents/Header";
import { tokens } from "../../theme";
import LoadingSpinnerComponent from "../otherComponents/LoadingSpinnerComponent";
import LineChart from "../otherComponents/LineChart";
import PieChart from "../otherComponents/PieChart";
import BarChart from "../otherComponents/BarChart";
import StatBox from "../otherComponents/StatBox";
import BillableWorkModal from "./BillableWorkModal";
import api from "../../../api";
import { Validation } from "./BillableWorkValidation";
import axios from "axios";
import { lawFirmMemos } from "../otherComponents/mockData";
import MemoModal from "./MemoModal";

const ipAddress = import.meta.env.VITE_IP_ADDRESS;
const contextRoot = import.meta.env.VITE_CONTEXT_ROOT;

const initialFormData = {
  id: "",
  date_of_service: "",
  user_id: "",
  client_id: "",
  case_id: "",
  job_performed: "",
  billing_type: "",
  fixed_rate: null,
  hourly_rate_from: null,
  hourly_rate_to: null,
  notes: "",
  created_by: "",
};

const initialFormData2 = {
  id: "",
  title: "",
  details: "",
  created_by: "",
};

const Dashboard = ({ user }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formData2, setFormData2] = useState(initialFormData2);
  const [loading, setLoading] = useState(true); // Loading state for data fetching
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  console.log(user);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log("pass");
  //       const response = await axios.get(
  //         `${ipAddress}${contextRoot}/auth/validate`,
  //         {
  //           // withCredentials: true, // ⚠️ send cookies
  //         }
  //       );

  //       console.log(response.data);

  //       setLoading(false); // Set loading to false once data is fetched
  //     } catch (error) {
  //       console.error("Error fetching employeeData:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3000 milliseconds = 5 seconds

    // Cleanup the timer if the component unmounts before timeout
    return () => clearTimeout(timer);
  }, []);

  const handleOpenModal = () => {
    setFormData({
      id: "",
      user_id: user?.user_id,
      date_of_service: "",
      client_id: "",
      case_id: "",
      job_performed: "",
      billing_type: "",
      fixed_rate: null,
      hourly_rate_from: null,
      hourly_rate_to: null,
      notes: "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage("");
    clearFormData();
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      if (name === "billing_type") {
        if (value === "Fixed Rate") {
          // Clear Hourly Rate fields
          updatedData.hourly_rate_from = null;
          updatedData.hourly_rate_to = null;
        } else if (value === "Hourly Rate") {
          // Clear Fixed Rate field
          updatedData.fixed_rate = null;
        }
      }

      return updatedData;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const validationErrors = Validation(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    setShowErrorMessage(false);
    setErrorMessage("");

    try {
      setLoading(true);
      if (formData.id) {
        // await api.put(`/userdashboard/getallcases/${formData.id}`, formData);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Billable Work Updated Successfully!",
        });
      } else {
        // http://localhost:8080/enwcore/userdashboard/getallcases
        // await api.post(`/userdashboard/getallcases`, formData);

        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Billable Work Submitted Successfully!",
        });
      }

      // fetchData();

      // setShowSuccessMessage(true);
      // setOpenTransactionModal(false);
      handleCloseModal();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the form.",
      });
    }
  };

  const handleOpenModal2 = () => {
    setFormData2({
      id: "",
      title: "",
      details: "",
      created_by: user?.user_id,
    });
    setOpenModal2(true);
  };

  const handleCloseModal2 = () => {
    setOpenModal2(false);
    setErrorMessage("");
    clearFormData2();
  };

  const clearFormData2 = () => {
    setFormData2(initialFormData);
  };

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;

    setFormData2((prev) => {
      let updatedData = { ...prev, [name]: value };

      if (name === "billing_type") {
        if (value === "Fixed Rate") {
          // Clear Hourly Rate fields
          updatedData.hourly_rate_from = null;
          updatedData.hourly_rate_to = null;
        } else if (value === "Hourly Rate") {
          // Clear Fixed Rate field
          updatedData.fixed_rate = null;
        }
      }

      return updatedData;
    });
  };

  const handleFormSubmit2 = async (e) => {
    e.preventDefault();

    // Perform client-side validation
    const validationErrors = Validation(formData);

    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      setShowErrorMessage(true);
      return;
    }

    setShowErrorMessage(false);
    setErrorMessage("");

    try {
      setLoading(true);
      if (formData.id) {
        // await api.put(`/userdashboard/getallcases/${formData.id}`, formData);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Billable Work Updated Successfully!",
        });
      } else {
        // http://localhost:8080/enwcore/userdashboard/getallcases
        // await api.post(`/userdashboard/getallcases`, formData);

        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Billable Work Submitted Successfully!",
        });
      }

      // fetchData();

      // setShowSuccessMessage(true);
      // setOpenTransactionModal(false);
      handleCloseModal2();
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "An error occurred while submitting the form.",
      });
    }
  };

  return (
    <Box m="20px">
      {/* The rest of the dashboard that doesn't depend on data */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            sx={{
              backgroundColor: colors.goldAccent[600],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              ml: "10px", // Optional: spacing if next to another button
            }}
          >
            <NotificationsActiveIcon sx={{ mr: "10px" }} />
            Notifications
          </Button>
          <Button
            sx={{
              backgroundColor: colors.goldAccent[600],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleOpenModal}
          >
            <EventNoteIcon sx={{ mr: "10px" }} />
            Log Work
          </Button>
          <Button
            sx={{
              backgroundColor: colors.goldAccent[600],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
            onClick={handleOpenModal2}
          >
            <NoteAddIcon sx={{ mr: "10px" }} />
            Add Memo
          </Button>
          <Button
            sx={{
              backgroundColor: colors.goldAccent[600],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      <Box>
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* COUNTERS: Only display loading spinner for these components */}
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <LoadingSpinnerComponent isLoading={loading} />
            ) : (
              <StatBox
                title={0}
                subtitle="Active Cases  "
                progress={0}
                progressColor="#00FF00"
                increase="+14%"
                icon={
                  <FontAwesomeIcon
                    icon={faBalanceScale}
                    style={{ color: colors.goldAccent[300], fontSize: "26px" }}
                  />
                }
              />
            )}
          </Box>

          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <LoadingSpinnerComponent isLoading={loading} />
            ) : (
              <StatBox
                title={0}
                subtitle="Clients Served"
                progress={0}
                progressColor="#FFFF00"
                increase="+21%"
                icon={
                  <FontAwesomeIcon
                    icon={faHandshake}
                    style={{ color: colors.goldAccent[300], fontSize: "26px" }}
                  />
                }
              />
            )}
          </Box>

          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <LoadingSpinnerComponent isLoading={loading} />
            ) : (
              <StatBox
                title={0}
                subtitle="Revenue"
                progress={0}
                progressColor="#FF0000"
                increase="+5%"
                icon={
                  <FontAwesomeIcon
                    icon={faSackDollar}
                    style={{ color: colors.goldAccent[300], fontSize: "26px" }}
                  />
                }
              />
            )}
          </Box>

          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {loading ? (
              <LoadingSpinnerComponent isLoading={loading} />
            ) : (
              <StatBox
                title={0}
                subtitle="Win Rate"
                progress={0}
                progressColor="#00FF00"
                progressColor2="#FFFF00"
                progressColor3="#FF0000"
                increase="+43%"
                icon={
                  <FontAwesomeIcon
                    icon={faTrophy}
                    style={{ color: colors.goldAccent[300], fontSize: "26px" }}
                  />
                }
              />
            )}
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 8"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            {loading ? (
              <LoadingSpinnerComponent isLoading={loading} />
            ) : (
              <Box>
                <Box
                  mt="25px"
                  p="0 30px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                    >
                      Monthly Revenue
                    </Typography>
                  </Box>
                </Box>
                <Box height="250px" mt="-20px">
                  <LineChart isDashboard={true} />
                </Box>
              </Box>
            )}
          </Box>

          {/* Memo Board */}

          <Box
            gridColumn="span 4"
            gridRow="span 4"
            backgroundColor={colors.primary[400]}
            sx={{ scrollBehavior: "smooth" }}
          >
            {loading ? (
              <LoadingSpinnerComponent isLoading={loading} />
            ) : (
              <Box height="100%">
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.primary[500]}`}
                  color={colors.grey[100]}
                  p="15px"
                  position="sticky"
                  top="0"
                  zIndex="100"
                  backgroundColor={colors.primary[400]}
                >
                  <Typography variant="h5" fontWeight="600">
                    Memo Board ({lawFirmMemos.length})
                  </Typography>
                </Box>
                <Box
                  p={2}
                  height="100%"
                  position="relative"
                  sx={{ overflowY: "scroll", height: "calc(100% - 80px)" }}
                >
                  {lawFirmMemos
                    .slice() // clone array so original not mutated
                    .sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at)
                    ) // descending by date
                    .map((memo) => (
                      <Paper
                        key={memo.memo_id}
                        elevation={3}
                        sx={(theme) => ({
                          bgcolor:
                            theme.palette.mode === "dark"
                              ? theme.palette.grey[900]
                              : "white",
                          mb: 1,
                          p: 2,
                        })}
                      >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {memo.title}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Case ID: {memo.case_id} | Client: {memo.client_name} |
                          Date: {new Date(memo.created_at).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" mb={1}>
                          {memo.details}
                        </Typography>

                        {memo.file_id && memo.file_id.trim() !== "" && (
                          <Button
                            variant="outlined"
                            size="small"
                            href={`https://drive.google.com/file/d/${memo.file_id}/view`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: colors.goldAccent[100],
                              borderColor: colors.goldAccent[100],
                              "&:hover": {
                                backgroundColor: colors.goldAccent[700], // optional lighter background on hover
                                borderColor: colors.goldAccent[300], // darker border on hover
                              },
                            }}
                          >
                            View Attachment
                          </Button>
                        )}
                      </Paper>
                    ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* ROW 3 */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h5" fontWeight="600">
              Expense Breakdown
            </Typography>
            <Box height="250px" mt="-20px">
              {loading ? (
                <LoadingSpinnerComponent isLoading={loading} />
              ) : (
                <PieChart isDashboard={true} />
              )}
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Typography
              variant="h5"
              fontWeight="600"
              sx={{ p: "30px 30px 0 30px" }}
            >
              Case Statistics
            </Typography>
            <Box height="250px" mt="-20px">
              {loading ? (
                <LoadingSpinnerComponent isLoading={loading} />
              ) : (
                <BarChart isDashboard={true} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <BillableWorkModal
        // user={user}
        // error={error}
        open={openModal}
        onClose={handleCloseModal}
        formData={formData}
        handleInputChange={handleInputChange}
        clearFormData={clearFormData}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
      <MemoModal
        // user={user}
        // error={error}
        open={openModal2}
        onClose={handleCloseModal2}
        formData={formData2}
        setFormData={setFormData2}
        handleInputChange={handleInputChange2}
        clearFormData={clearFormData2}
        handleFormSubmit={handleFormSubmit2}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default Dashboard;
