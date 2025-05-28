import { useState, useEffect } from "react";

function Stages() {
    const [templateName, setTemplateName] = useState("Default Stages");
    const [stages, setStages] = useState([
        { stage_name: "Document Review", stage_counsel: "", stage_deadline: "" },
        { stage_name: "Client Interview", stage_counsel: "", stage_deadline: "" },
        { stage_name: "Court Filing", stage_counsel: "", stage_deadline: "" }
    ]);
    const [users, setUsers] = useState([]); // State to store users

    useEffect(() => {
        // Fetch users from API when the component mounts
        fetch("http://localhost:8080/enwcore/getAllUser") // Replace with your actual API endpoint
            .then((res) => res.json())
            .then((data) => setUsers(data)) // Assuming the API returns a list of users
            .catch((err) => console.error("Error fetching users:", err));
    }, []);

    const handleStageChange = (index, field, value) => {
        const updatedStages = [...stages];
        updatedStages[index][field] = value;
        setStages(updatedStages);
    };

    const handleAddStage = () => {
        setStages([...stages, { stage_name: "", stage_counsel: "", stage_deadline: "" }]);
    };

    const handleRemoveStage = (index) => {
        const updatedStages = [...stages];
        updatedStages.splice(index, 1);
        setStages(updatedStages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Map through stages to get the userId based on the stage_counsel (username)
        const updatedStages = stages.map((stage) => {
            const user = users.find((user) => user.username === stage.stage_counsel);
            return {
                ...stage,
                stage_counsel_id: user ? user.userId : null, // Add the userId if the counsel is selected
            };
        });

        const payload = {
            stage_template_name: templateName,
            stage_list: updatedStages, // Use updated stages with userId included
        };
        

        console.log("Submitting:", payload);

        fetch("http://localhost:8080/enwcore/createStageTemplate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            
        })
            .then((res) => res.json())
            .then((data) => console.log("Success:", data))
            .catch((err) => console.error("Error:", err));
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Stage Template Form</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="form-label">Template Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                    />
                </div>

                <h2 className="mb-3">Stages</h2>
                <div className="row flex-nowrap overflow-auto mb-4">
                    {stages.map((stage, index) => (
                        <div key={index} className="col-12 col-md-4 me-3">
                            <div className="card h-100">
                                <div className="card-body">
                                    <div className="mb-3">
                                        <label className="form-label">Stage Name:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={stage.stage_name}
                                            onChange={(e) => handleStageChange(index, "stage_name", e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Stage Counsel:</label>
                                        <select
                                            className="form-control"
                                            value={stage.stage_counsel}
                                            onChange={(e) => handleStageChange(index, "stage_counsel", e.target.value)}
                                        >
                                            <option value="">Select Counsel</option>
                                            {users.map((user) => (
                                                <option key={user.userId} value={user.username}>
                                                    {user.firstName} {user.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Stage Deadline:</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={stage.stage_deadline}
                                            onChange={(e) => handleStageChange(index, "stage_deadline", e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleRemoveStage(index)}
                                    >
                                        Remove Stage
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="btn btn-success mb-3"
                    onClick={handleAddStage}
                >
                    Add New Stage
                </button>

                <div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Stages;
