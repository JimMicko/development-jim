// src/components/Dashboard/BillableWorkValidation.jsx

export const Validation = (formData) => {
  const validationErrors = [];

  const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());

  // Validate required fields
  if (!formData.date_of_service || !isValidDate(formData.date_of_service)) {
    validationErrors.push(
      "Date of Service is required and must be a valid date."
    );
  }

  if (!formData.client_id || formData.client_id.trim() === "") {
    validationErrors.push("Client selection is required.");
  }

  if (!formData.case_id || formData.case_id.trim() === "") {
    validationErrors.push("Case selection is required.");
  }

  if (!formData.job_performed || formData.job_performed.trim() === "") {
    validationErrors.push("Job Performed is required.");
  }

  if (!formData.billing_type || formData.billing_type.trim() === "") {
    validationErrors.push("Billing Type is required.");
  }

  // Billing type specific validations
  if (formData.billing_type === "Fixed Rate") {
    if (
      formData.fixed_rate === undefined ||
      formData.fixed_rate === null ||
      formData.fixed_rate === "" ||
      Number(formData.fixed_rate) < 0
    ) {
      validationErrors.push("Fixed Rate is required and must be 0 or greater.");
    }
  }

  if (formData.billing_type === "Hourly Rate") {
    // Check dates exist and are valid
    if (!formData.hourly_rate_from || !isValidDate(formData.hourly_rate_from)) {
      validationErrors.push("'From' date is required and must be valid.");
    }

    if (!formData.hourly_rate_to || !isValidDate(formData.hourly_rate_to)) {
      validationErrors.push("'To' date is required and must be valid.");
    }

    // Check from <= to
    if (
      isValidDate(formData.hourly_rate_from) &&
      isValidDate(formData.hourly_rate_to) &&
      new Date(formData.hourly_rate_to) < new Date(formData.hourly_rate_from)
    ) {
      validationErrors.push("'To' date cannot be before 'From' date.");
    }
  }

  // Return all collected validation errors
  return validationErrors;
};
