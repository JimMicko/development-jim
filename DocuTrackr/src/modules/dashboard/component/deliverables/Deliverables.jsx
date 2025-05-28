import { useEffect, useState } from "react";
import "./deliverables-styles.css";
import Swal from "sweetalert2";

function Deliverables({ userData }) {
  const [formData, setFormData] = useState({
    case_id: "",
    document_name: "",
    client_id: "",
    date_started: "",
    date_submitted: ""
  });

  const [newClientData, setNewClientData] = useState({
    first_name: "",
    last_name: "",
    case_name: "",
  });

  // const [cases, setCases] = useState([]);
  const [clients, setClients] = useState([]);
  const [stageTemplates, setStageTemplates] = useState([]);
  const [editableStages, setEditableStages] = useState([]);
  const [createDocumentPopup, setShowPopup] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    document_id: "",
    document_name: "",
    version_number: null,
    stages: [],
  });
  const [originalUpdateForm, setOriginalUpdateForm] = useState(null);

  const fetchDocuments = () => {
    fetch("http://193.203.161.251:9090/enwcore/getAllDocuments")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch documents");
        return res.json();
      })
      .then(setDocuments)
      .catch((err) => console.error("Error fetching documents:", err.message));
  };

  const createNewClient = async () => {
    const payload = {
      first_name: newClientData.first_name,
      last_name: newClientData.last_name,
    };

    try {
      const response = await fetch(
        "http://193.203.161.251:9090/enwcore/createClient",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        const clientId = data.client_id; // Extract the client_id value
        return clientId; // Return the client_id to the caller
      } else {
        console.error("Error: ", response.statusText);
        return null; // Indicate failure if response is not ok
      }
    } catch (error) {
      console.error("Error:", error);
      return null; // Indicate failure
    }
  };

  useEffect(() => {
    const handleResponse = async (res) => {
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      return res.json();
    };

    // fetch("http://193.203.161.251:9090/enwcore/getCases")
    //   .then(handleResponse)
    //   .then(setCases)
    //   .catch((err) => console.error("Error fetching cases:", err.message));

    fetch("http://193.203.161.251:9090/enwcore/getClients")
      .then(handleResponse)
      .then(setClients)
      .catch((err) => console.error("Error fetching clients:", err.message));

    fetch("http://193.203.161.251:9090/enwcore/getTemplates")
      .then(handleResponse)
      .then((data) => {
        const parsedTemplates = data.map((item) => ({
          stage_template_id: item.templateId,
          stage_template_name: item.templateName,
          stage_list: item.stageList.map((stage) => ({
            stage_name: stage.stageName,
            stage_counsel: stage.stageCounsel,
            stage_deadline: stage.stageDeadline,
          })),
        }));
        setStageTemplates(parsedTemplates);

        // Set first template as default stages if available
        if (parsedTemplates.length > 0) {
          setEditableStages(
            parsedTemplates[0].stage_list.map(stage => ({
              ...stage,
              stage_deadline: stage.stage_deadline || "",
              stage_status: "pending"
            }))
          );
        }
      })
      .catch((err) => console.error("Error fetching templates:", err.message));

    fetch("http://193.203.161.251:9090/enwcore/getAllDocuments") //
      .then(handleResponse)
      .then(setDocuments)
      .catch((err) => console.error("Error fetching documents:", err.message));

    fetchDocuments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "new_client_first_name" || name === "new_client_last_name") {
      setNewClientData((prev) => ({
        ...prev,
        [name === "new_client_first_name" ? "first_name" : "last_name"]: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "stage_template_id") {
        const selected = stageTemplates.find(
          (t) => t.stage_template_id === value
        );
        if (selected) {
          setEditableStages(
            selected.stage_list.map((stage) => ({
              ...stage,
              stage_deadline: stage.stage_deadline || "",
              stage_status: "pending",
            }))
          );
        } else {
          setEditableStages([]);
        }
      }
    }
  };

  const handleOpenUpdatePopup = (doc) => {
    const latestVersion = doc.data.versions[doc.data.versions.length - 1];
    const form = {
      document_id: doc.document_id,
      document_name: doc.data.document_name,
      version_number: latestVersion.version_number,
      gdocId: latestVersion.gdocId,
      stages: latestVersion.stages.map((stage) => ({
        ...stage,
        stage_deadline: stage.stage_deadline || "",
      })),
    };

    setUpdateForm(form);
    setOriginalUpdateForm(JSON.parse(JSON.stringify(form)));
    setShowUpdatePopup(true);
  };

  const handleUpdateChange = (index, newDeadline) => {
    setUpdateForm((prev) => {
      const updatedStages = [...prev.stages];
      updatedStages[index].stage_deadline = newDeadline;
      return { ...prev, stages: updatedStages };
    });
  };

  const handleDocumentNameChange = (e) => {
    setUpdateForm((prev) => ({ ...prev, document_name: e.target.value }));
  };

  const handleUpdateSubmit = () => {
    if (!originalUpdateForm) return;

    const changedStages = updateForm.stages.filter((stage, index) => {
      const original = originalUpdateForm.stages[index];
      return stage.stage_deadline !== original.stage_deadline;
    });

    const nameChanged =
      updateForm.document_name !== originalUpdateForm.document_name;

    if (changedStages.length === 0 && !nameChanged) {
      Swal.fire("No Changes", "There are no changes to save.", "info");
      return;
    }

    const payload = {
      document_id: updateForm.document_id,
      version_number: updateForm.version_number,
      gdocId: updateForm.gdocId,
      document_name: updateForm.document_name,
    };

    if (changedStages.length > 0) {
      payload.stages = updateForm.stages.map((stage) => ({
        stage_name: stage.stage_name,
        stage_counsel: stage.stage_counsel,
        stage_deadline: stage.stage_deadline,
        status: stage.status,
      }));
    }

    // 🔄 Show loading spinner
    Swal.fire({
      title: "Saving changes...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch("http://193.203.161.251:9090/enwcore/updateDocument", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        Swal.close();
        setShowUpdatePopup(false);
        Swal.fire("Updated", "Document updated successfully!", "success");
        fetchDocuments();
      })
      .catch((err) => {
        Swal.close();
        Swal.fire("Error", "Failed to update document.", "error");
        console.error("Error updating document:", err.message);
      });
  };

  const handleDeadlineChange = (index, newDeadline) => {
    setEditableStages((prevStages) => {
      const updated = [...prevStages];
      updated[index].stage_deadline = newDeadline;
      return updated;
    });
  };

  const handleStatusChange = (index, newStatus) => {
    setEditableStages((prevStages) => {
      const updated = [...prevStages];
      updated[index].stage_status = newStatus;
      return updated;
    });
  };

  const handleDocumentViewer = (gdocId) => {
    const url = `https://docs.google.com/document/d/${gdocId}/edit`;
    window.open(url, "_blank");
  };

  const handleSubmitNewDocument = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    let clientId = formData.client_id;

    // Show loading spinner
    Swal.fire({
      title: "Creating Deliverable...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // If creating a new client
    if (clientId === "createNewClient") {
      clientId = await createNewClient();
      if (!clientId) {
        Swal.close();
        Swal.fire(
          "Error",
          "Failed to create client. Deliverable creation aborted.",
          "error"
        );
        return;
      }
    }

    const initialStages = editableStages.map((stage) => ({
      stage_name: stage.stage_name,
      stage_counsel: stage.stage_counsel,
      stage_deadline: stage.stage_deadline,
      status: stage.stage_status,
    }));

    const payload = {
      ...formData,
      client_id: clientId,
      versions: [
        {
          version_number: 1,
          gdocId: "",
          created_at: today,
          stages: initialStages,
        },
      ],
      user: userData,
    };

    try {
      const res = await fetch(
        "http://193.203.161.251:9090/enwcore/createDocument",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log(data);

      Swal.close();
      Swal.fire("Success", "Deliverable created successfully!", "success");

      setShowPopup(false);
      fetchDocuments();
    } catch (err) {
      Swal.close();
      Swal.fire(
        "Error",
        "Something went wrong while creating the deliverable.",
        "error"
      );
      console.error("Error:", err);
    }
  };

  const handleMarkDone = async (document, gdocId) => {
    const { value: remarks } = await Swal.fire({
      title: "Submit Stage",
      input: "text",
      inputLabel: "Remarks",
      inputPlaceholder: "Enter any remarks...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      inputValidator: (value) => {
        if (!value) {
          return "Remarks are required!";
        }
      },
    });

    if (!remarks) return; // user canceled

    const versionCount = document.data.versions.length;
    const activeVersion = document.data.versions[versionCount - 1];

    const updatedStages = activeVersion.stages.map((stage) => {
      if (stage.status === "on-going") {
        return {
          ...stage,
          status: "done",
          submitted_date: new Date().toISOString().split('T')[0],
          remarks: remarks, // Add remarks here
        };
      }
      return stage;
    });

    const nextStageIndex = updatedStages.findIndex(
      (s) => s.status === "pending"
    );
    if (nextStageIndex !== -1) {
      updatedStages[nextStageIndex].status = "on-going";
    }

    const payload = {
      document_id: document.document_id,
      version_number: versionCount + 1,
      stages: updatedStages,
      gdocId: gdocId || "",
    };

    Swal.fire({
      title: "Updating...",
      text: "Please wait while the stage is being updated.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch("http://193.203.161.251:9090/enwcore/updateDocumentStages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update stages");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Document updated successfully:", data);
        Swal.fire("Success", "Stage marked as done!", "success");
        fetchDocuments();
      })
      .catch((err) => {
        console.error("Error updating document:", err.message);
        Swal.fire("Error", err.message, "error");
      });
  };


  return (
    <div className="deliverables">
      <div className="container">
        <h2 className="mb-1">Deliverables Overview</h2>
        <button
          className="btn create-deliverable-btn mb-1"
          onClick={() => setShowPopup(true)}
        >
          Create Deliverable
        </button>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>
                  Date Started:
                  {/* <div className="due-date">{doc.data.date_started}</div> */}
                </th>
                {documents.length > 0 &&
                  documents[0].data.versions[
                    documents[0].data.versions.length - 1
                  ].stages.map((stage, i) => (
                    <th key={i}>{stage.stage_name}</th>
                  ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((doc) => {
                  const versionCount = doc.data.versions.length;
                  const activeVersion = doc.data.versions.find(
                    (v) => v.version_number === versionCount
                  );
                  const gdocId = activeVersion?.gdocId;
                  return (
                    <tr key={doc.document_id}>
                      <td>
                        {doc.data.document_name}
                        <div className="version">
                          Version: {activeVersion.version_number}

                          <details>
                            <summary style={{ cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}>
                              View Versions
                            </summary>
                            <div style={{ marginLeft: '10px', marginTop: '5px' }}>
                              {[...doc.data.versions]
                                .sort((a, b) => b.version_number - a.version_number) // Descending sort
                                .slice(1) // to not display the latest
                                .map((version, index) => (
                                  <div key={index}>
                                    <span
                                      className="clickable-version"
                                      onClick={() => handleDocumentViewer(version.gdocId)}
                                      style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                    >
                                      Version: {version.version_number}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </details>
                        </div>
                      </td>

                      <td>
                        <div className="due-date">{doc.data.date_started}</div>
                      </td>
                      {activeVersion.stages.map((stage, idx) => (
                        <td key={idx}>
                          <span className={`badge badge-${stage.status}`}>
                            {stage.status === "on-going" && "On-going"}
                            {stage.status === "pending" && "Pending"}
                            {stage.status === "done" && "Done"}
                          </span>

                          <div className="due-date">
                            Due: {stage.stage_deadline}
                          </div>
                          <div className="date-submitted">
                            Date Submitted: {stage.submitted_date || 'N/A'}
                          </div>
                          <div className="remarks">
                            Remarks: {stage.remarks || 'N/A'}
                          </div>
                          <div className="counsel">
                            Counsel: {stage.stage_counsel}
                          </div>
                          {stage.status === "on-going" && (
                            <button
                              className="btn mt-2 submit-stage-update"
                              onClick={() => handleMarkDone(doc, gdocId)}
                            >
                              Submit
                            </button>
                          )}
                        </td>
                      ))}
                      <td>
                        <button
                          className="btn btn-primary me-2 view-action"
                          onClick={() => handleDocumentViewer(gdocId)}
                        >
                          Open Document
                        </button>
                        <button
                          className="btn btn-primary me-2 update-action"
                          onClick={() => handleOpenUpdatePopup(doc)}
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">No documents found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {createDocumentPopup && (
        <div className="modal-overlay">
          <div className="modal-content p-4 bg-white rounded shadow-lg position-relative">
            <button
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={() => setShowPopup(false)}
            ></button>

            <h2 className="mb-4">Deliverables Form</h2>
            <form onSubmit={handleSubmitNewDocument}>
              <div className="mb-3">
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Client</option>
                  <option value="createNewClient">Create New Client</option>
                  {clients.map((client) => (
                    <option key={client.clientId} value={client.clientId}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>
              {formData.client_id === "createNewClient" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Client First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="new_client_first_name"
                      value={newClientData.first_name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Client Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="new_client_last_name"
                      value={newClientData.last_name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label className="form-label">Case Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="new_client_case_name"
                      value={newClientData.case_name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div> */}
                </>
              )}
              {/* <div className="mb-3">
                <label className="form-label">Case Title </label>
                <select
                  className="form-select"
                  name="case_id"
                  value={formData.case_id}
                  onChange={handleChange}
                  // required
                >
                  <option value="">Select Case</option>
                  {cases.map((c) => (
                    <option key={c.caseId} value={c.caseId}>
                      {c.caseName}
                    </option>
                  ))}
                </select>
              </div> */}

              <div className="mb-3">
                <label className="form-label">Document Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="document_name"
                  value={formData.document_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Date Started</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_started"
                  value={formData.date_started}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* <div className="mb-3">
                <label className="form-label">Date Submitted</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_submitted"
                  value={formData.date_submitted}
                  onChange={handleChange}
                />
              </div> */}

              {editableStages.length > 0 && (
                <div className="mb-3">
                  <label className="form-label">Stages</label>
                  <div className="d-flex flex-wrap gap-3">
                    {editableStages.map((stage, index) => (
                      <div key={index} className="border rounded p-3 bg-light">
                        <h5>Stage Name</h5>
                        <strong>{stage.stage_name}</strong>
                        <br />
                        <h5>Counsel Name</h5>
                        <strong>{stage.stage_counsel}</strong>
                        <br />
                        <h5>Counsel Name</h5>
                        
                        <h5>Deadline</h5>
                        <input
                          type="date"
                          className="form-control mb-2"
                          value={stage.stage_deadline}
                          onChange={(e) =>
                            handleDeadlineChange(index, e.target.value)
                          }
                        />
                        <h5>Status</h5>
                        <select
                          className="form-select"
                          value={index === 0 ? "on-going" : stage.stage_status}
                          onChange={(e) =>
                            handleStatusChange(index, e.target.value)
                          }
                          disabled
                        >
                          <option value="pending">Pending</option>
                          <option value="on-going">On-Going</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showUpdatePopup && (
        <div className="modal-overlay">
          <div className="modal-content p-4 bg-white rounded shadow-lg position-relative">
            <button
              className="btn-close position-absolute top-0 end-0 m-3"
              onClick={() => setShowUpdatePopup(false)}
            ></button>

            <h2 className="mb-4">Update Deliverable</h2>

            <div className="mb-3">
              <label className="form-label">Document Name</label>
              <input
                type="text"
                className="form-control"
                value={updateForm.document_name}
                onChange={handleDocumentNameChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Stages</label>
              <div className="d-flex flex-wrap gap-3">
                {updateForm.stages.map((stage, index) => (
                  <div key={index} className="border rounded p-3 bg-light">
                    <h5>Stage Name</h5>
                    <strong>{stage.stage_name}</strong>
                    <br />
                    <h5>Counsel</h5>
                    <small>{stage.stage_counsel}</small>
                    <br />
                    <h5>Deadline</h5>
                    <input
                      type="date"
                      className="form-control"
                      value={stage.stage_deadline}
                      onChange={(e) =>
                        handleUpdateChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-success"
              onClick={() => handleUpdateSubmit()}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Deliverables;
