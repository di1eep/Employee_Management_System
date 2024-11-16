import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import "./home.css";

function EmployeeManagement() {
    const [loggedInUser, setLoggedInUser] = useState("");
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({
        EmployeeID: "",
        EmployeeName: "",
        EmployeeDesignation: "",
        EmployeeExperience: "",
        EmpMobileNo: "",
        EmpEmailId: "",
        EmployeeDOB: "",
        EmployeeAddress: "",
    });
    const [isEditing, setIsEditing] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("loggedInUser");
        if (!user) {
            navigate("/login");
        } else {
            setLoggedInUser(user);
        }
        fetchEmployees();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");
        handleSuccess("User Logged Out");
        setTimeout(() => navigate("/login"), 1000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const fetchEmployees = async () => {
        try {
            const url = "http://localhost:3000/Employee/get";
            const response = await fetch(url, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            const result = await response.json();
            if (result.flag === 1) {
                setEmployees(result.data);
                handleSuccess(result.flag_message);
            } else {
                handleError(result.flag_message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        const url = isEditing
            ? "http://localhost:3000/Employee/update"
            : "http://localhost:3000/Employee/create";
        const method = isEditing ? "PUT" : "POST";
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify(form),
            });
            const result = await response.json();
            if (result.flag_message[0].flag === 1) {
                handleSuccess(result.flag_message[0].flag_message);
                fetchEmployees();
                setIsEditing(null);
                setForm({
                    EmployeeID: "",
                    EmployeeName: "",
                    EmployeeDesignation: "",
                    EmployeeExperience: "",
                    EmpMobileNo: "",
                    EmpEmailId: "",
                    EmployeeDOB: "",
                    EmployeeAddress: "",
                });
            } else {
                handleError(result.flag_message[0].flag_message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    const handleDelete = async (employeeID) => {
        try {
            const url = "http://localhost:3000/Employee/delete";
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ EmployeeID: employeeID }),
            });
            const result = await response.json();
            if (result.flag_message[0].flag === 1) {
                handleSuccess(result.flag_message[0].flag_message);
                fetchEmployees();
            } else {
                handleError(result.flag_message[0].flag_message);
            }
        } catch (err) {
            handleError(err);
        }
    };

    const startEditing = (employee) => {
        setIsEditing(employee.EmployeeID);
        setForm(employee);
    };

    return (
        <div className="employee-management">
            <div className="header">
                <h1>Welcome {loggedInUser}</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <form onSubmit={handleCreateOrUpdate} className="form">
                <h2>{isEditing ? "Edit Employee" : "Add Employee"}</h2>
                <input
                    type="text"
                    name="EmployeeName"
                    placeholder="Name"
                    value={form.EmployeeName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="EmployeeDesignation"
                    placeholder="Designation"
                    value={form.EmployeeDesignation}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="EmployeeExperience"
                    placeholder="Experience"
                    value={form.EmployeeExperience}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="EmpMobileNo"
                    placeholder="Mobile No"
                    value={form.EmpMobileNo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="EmpEmailId"
                    placeholder="Email"
                    value={form.EmpEmailId}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="EmployeeDOB"
                    placeholder="DOB"
                    value={form.EmployeeDOB}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="EmployeeAddress"
                    placeholder="Address"
                    value={form.EmployeeAddress}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEditing ? "Update" : "Add"}</button>
            </form>

            <div className="employee-list">
                {employees.map((employee) => (
                    <div className="employee-row" key={employee.EmployeeID}>
                        <div className="employee-details">
                            {employee.EmployeeID} | {employee.EmployeeName} |{" "}
                            {employee.EmployeeDesignation} | {employee.EmployeeExperience} Yrs |{" "}
                            {employee.EmpMobileNo} | {employee.EmpEmailId} | {employee.EmployeeDOB} |{" "}
                            {employee.EmployeeAddress}
                        </div>
                        <div className="actions">
                            <button className="edit-btn" onClick={() => startEditing(employee)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(employee.EmployeeID)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <ToastContainer />
        </div>
    );
}

export default EmployeeManagement;