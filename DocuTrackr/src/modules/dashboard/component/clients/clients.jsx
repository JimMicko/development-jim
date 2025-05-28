import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function Clients() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        contact_number: '',
        address: '',
        birthday: '',
    });

    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = () => {
        Swal.fire({
            title: "Loading clients...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        fetch("http://193.203.161.251:9090/enwcore/getClients")
            .then((res) => res.json())
            .then((data) => {
                setClients(data);
                Swal.close();
            })
            .catch((err) => {
                console.error("Error fetching clients:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error fetching clients!",
                    text: err.message || "Something went wrong.",
                });
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredClients = clients.filter(client => {
        return (
            client.firstName.toLowerCase().includes(searchTerm) ||
            client.lastName.toLowerCase().includes(searchTerm) ||
            client.email.toLowerCase().includes(searchTerm) ||
            client.contactNumber.toLowerCase().includes(searchTerm) ||
            (client.address && client.address.toLowerCase().includes(searchTerm))
        )
    });

    const showFormPopup = () => {
        Swal.fire({
            title: 'Add New Client',
            html: `
                <form id="clientForm" class="mt-3">
                    <div class="mb-3">
                        <label class="form-label text-start d-block">First Name</label>
                        <input required type="text" class="form-control" name="first_name" value="${formData.first_name}" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-start d-block">Last Name</label>
                        <input required type="text" class="form-control" name="last_name" value="${formData.last_name}" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-start d-block">Email</label>
                        <input required type="email" class="form-control" name="email" value="${formData.email}" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-start d-block">Contact Number</label>
                        <input required type="text" class="form-control" name="contact_number" value="${formData.contact_number}" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-start d-block">Address</label>
                        <input type="text" class="form-control" name="address" value="${formData.address}" />
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-start d-block">Birthday</label>
                        <input type="date" class="form-control" name="birthday" value="${formData.birthday}" />
                    </div>
                </form>
            `,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            preConfirm: () => {
                const form = document.getElementById('clientForm');
                const inputs = form.querySelectorAll('input');
                const newFormData = { ...formData };

                inputs.forEach(input => {
                    newFormData[input.name] = input.value;
                });

                return handleSubmit(newFormData);
            }
        });
    };

    const handleSubmit = (formData) => {
        const payload = { ...formData };

        Swal.fire({
            title: "Saving changes...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        return fetch("http://193.203.161.251:9090/enwcore/createClient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then((res) => res.json())
            .then((data) => {
                Swal.fire({
                    icon: "success",
                    title: "Client saved successfully!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchClients(); // Refresh the client list after successful submission
                return true;
            })
            .catch((err) => {
                console.error("Error:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error saving client!",
                    text: err.message || "Something went wrong.",
                });
                return false;
            });
    };

    return (
        <div className="clients mt-4">
            <h2>Client Management</h2>
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-secondary" onClick={showFormPopup}>
                    Add New Client
                </button>
                <div className="w-50">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search clients..."
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Client List</h5>
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                    <th>Address</th>
                                    <th>Birthday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <tr key={client.clientId}>
                                            <td>{client.firstName}</td>
                                            <td>{client.lastName}</td>
                                            <td>{client.email}</td>
                                            <td>{client.contactNumber}</td>
                                            <td>{client.address}</td>
                                            <td>{client.birthday || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            {clients.length === 0 ? 'No clients found' : 'No matching clients found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Clients;