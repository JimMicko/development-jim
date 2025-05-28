import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Cases() {
  const [formData, setFormData] = useState({
    case_name: "",
    client_id: "",
    case_type: "",
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    setLoading(true);
    fetch("http://193.203.161.251:9090/enwcore/getClients")
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw new Error("Failed to fetch clients");
        }
      })
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clients:", err);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load client list",
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showFormPopup = () => {
    Swal.fire({
      title: "Create New Case",
      html: `
        <form id="caseForm">
          <div class="mb-3">
            <label class="form-label text-start d-block">Client</label>
            <select
              class="form-select"
              name="client_id"
              value="${formData.client_id}"
              required
            >
              <option value="">Select Client</option>
              ${clients
                .map(
                  (client) => `
                <option value="${client.clientId}">
                  ${client.firstName} ${client.lastName}
                </option>
              `
                )
                .join("")}
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label text-start d-block">Case Name</label>
            <input
              type="text"
              class="form-control"
              name="case_name"
              value="${formData.case_name}"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label text-start d-block">Case Type</label>
            <input
              type="text"
              class="form-control"
              name="case_type"
              value="${formData.case_type}"
              required
            />
          </div>
        </form>
      `,
      showCancelButton: true,
      confirmButtonText: "Submit",
      focusConfirm: false,
      preConfirm: () => {
        const form = document.getElementById("caseForm");
        const inputs = form.querySelectorAll("input, select");
        const newFormData = { ...formData };

        inputs.forEach((input) => {
          newFormData[input.name] = input.value;
        });

        return handleSubmit(newFormData);
      },
    });
  };

  const handleSubmit = (formData) => {
    const payload = {
      case_name: formData.case_name,
      client_id: formData.client_id,
      case_type: formData.case_type,
    };

    Swal.fire({
      title: "Creating case...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    return fetch("http://193.203.161.251:9090/enwcore/createCase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Case created successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        return true;
      })
      .catch((err) => {
        console.error("Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to create case",
        });
        return false;
      });
  };

  return (
    <div className="cases mt-4">
      <h2>Case Management</h2>
      <button
        className="btn btn-primary"
        onClick={showFormPopup}
        disabled={loading}
      >
        {loading ? "Loading..." : "Create New Case"}
      </button>
    </div>
  );
}

export default Cases;