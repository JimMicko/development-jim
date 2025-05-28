import React, { useState, useEffect } from "react";
import "./lsa-styles.css";
import Swal from "sweetalert2";

function DocumentFormPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [clients, setClients] = useState([]);
  const [lsaList, setLsaList] = useState([]);
  const [error, setError] = useState({ clients: null, lsas: null });
  const [formData, setFormData] = useState({
    client_id: "",
    document_name: "",
    status: "drafting",
    clients_feedback: "waiting",
    date_sent: "",
    date_signed: "",
    payment_date: "",
    remarks: "",
  });
  const [selectedLsa, setSelectedLsa] = useState(null);

  const handleDocumentViewer = (document_id) => {
    const url = `https://docs.google.com/document/d/${document_id}/edit`;
    window.open(url, "_blank");
  };

  const handleUpdate = (document_id) => {
    const lsa = lsaList.find((item) => item.document_id === document_id);
    if (lsa) {
      setSelectedLsa(lsa);
      setFormData({
        client_id: lsa.client_id,
        document_name: lsa.document_name,
        status: lsa.status,
        clients_feedback: lsa.clients_feedback,
        date_sent: lsa.date_sent || "",
        date_signed: lsa.date_signed || "",
        payment_date: lsa.payment_date || "",
      });
      setShowUpdatePopup(true);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("http://193.203.161.251:9090/enwcore/getClients");
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      setClients(data || []);
      setError((prev) => ({ ...prev, clients: null }));
    } catch (err) {
      console.error("Failed to fetch clients:", err);
      setClients([]);
      setError((prev) => ({ ...prev, clients: "Failed to load clients" }));
    }
  };

  const fetchLsas = async () => {
    try {
      const res = await fetch("http://193.203.161.251:9090/enwcore/getAllLsa");
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      setLsaList(data || []);
      setError((prev) => ({ ...prev, lsas: null }));
    } catch (err) {
      console.error("Failed to fetch LSAs:", err);
      setLsaList([]);
      setError((prev) => ({ ...prev, lsas: "No LSA's found" }));
    }
  };

  useEffect(() => {
    fetchClients();
    fetchLsas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value ?? ""])
    );

    // Show loading spinner
    Swal.fire({
      title: "Submitting...",
      text: "Please wait while we submit the form.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        "http://193.203.161.251:9090/enwcore/createLsa",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cleanedData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");

      Swal.fire("Success", "Submitted successfully!", "success");

      setShowPopup(false);
      setFormData({
        client_id: "",
        document_name: "",
        status: "drafting",
        clients_feedback: "waiting",
        date_sent: "",
        date_signed: "",
        payment_date: "",
        remarks: ""
      });
      fetchLsas();
    } catch (error) {
      console.error("Submit failed:", error);
      Swal.fire("Error", "Submission failed", "error");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLsa) return;

    const updatedPayload = {
      ...formData,
      lsa_id: selectedLsa.lsa_id,
    };

    // Show loading spinner
    Swal.fire({
      title: "Updating...",
      text: "Please wait while we update the LSA.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        "http://193.203.161.251:9090/enwcore/updateLsa",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPayload),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      Swal.fire("Success", "Updated successfully!", "success");

      setShowUpdatePopup(false);
      setSelectedLsa(null);
      fetchLsas();
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", "Failed to update LSA", "error");
    }
  };

  return (
    <div>
      {/* Create LSA Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Legal Service Agreement</h2>
            <form onSubmit={handleSubmit}>
              <label>Client Name</label>
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.clientId} value={client.clientId}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>

              <label>Document Name</label>
              <input
                type="text"
                name="document_name"
                value={formData.document_name}
                onChange={handleChange}
                required
              />

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="drafting">Drafting</option>
                <option value="complete-unsent">
                  Draft completed but not sent
                </option>
                <option value="waiting">Waiting client's info</option>
                <option value="rca">For review RCA</option>
                <option value="jgg">For review JGG</option>
                <option value="sent">Sent</option>
              </select>

              <label>Client's Feedback</label>
              <select
                name="clients_feedback"
                value={formData.clients_feedback}
                onChange={handleChange}
              >
                <option value="">Select feedback</option>
                <option value="waiting">Sent - Waiting for client</option>
                <option value="signed">Signed</option>
                <option value="declined">Declined</option>
              </select>

              <label>Date Sent</label>
              <input
                type="date"
                name="date_sent"
                value={formData.date_sent}
                onChange={handleChange}
              />

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update LSA Popup */}
      {showUpdatePopup && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>Update LSA</h2>
            <form onSubmit={handleUpdateSubmit}>
              <label>Document Name</label>
              <input
                type="text"
                name="document_name"
                value={formData.document_name}
                onChange={handleChange}
                required
              />

              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="drafting">Drafting</option>
                <option value="complete-unsent">
                  Draft completed but not sent
                </option>
                <option value="waiting">Waiting client's info</option>
                <option value="rca">For review RCA</option>
                <option value="jgg">For review JGG</option>
                <option value="sent">Sent</option>
              </select>

              <label>Client's Feedback</label>
              <select
                name="clients_feedback"
                value={formData.clients_feedback}
                onChange={handleChange}
              >
                <option value="">Select feedback</option>
                <option value="waiting">Sent - Waiting for client</option>
                <option value="signed">Signed</option>
                <option value="declined">Declined</option>
              </select>

              <label>Remarks</label>
              <input
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
              />

              <label>Date Sent</label>
              <input
                type="date"
                name="date_sent"
                value={formData.date_sent}
                onChange={handleChange}
              />        

              <div className="button-group">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdatePopup(false);
                    setSelectedLsa(null);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h3>Legal Services Agreement</h3>
      <button onClick={() => setShowPopup(true)} className="primary-button mb-1">
        Create LSA
      </button>
      {/* LSA List */}
      <div className="lsa-list">
        <table>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Document Name</th>
              <th>Status</th>
              <th>Feedback</th>
              <th>Date Sent</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lsaList.map((lsa) => (
              <tr key={lsa.lsa_id}>
                <td>
                  {lsa.client_first_name} {lsa.client_last_name}
                </td>
                <td>{lsa.document_name}</td>
                <td>{lsa.status}</td>
                <td>{lsa.clients_feedback}</td>
                <td>{lsa.date_sent}</td>
                <td>{lsa.remarks}</td>
                <td>
                  <button
                    onClick={() => handleDocumentViewer(lsa.document_id)}
                    className="view-button"
                  >
                    Open Document
                  </button>
                  <button
                    onClick={() => handleUpdate(lsa.document_id)}
                    className="update-button"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
            {lsaList.length === 0 && (
              <tr>
                <td colSpan="8">No LSAs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocumentFormPopup;
