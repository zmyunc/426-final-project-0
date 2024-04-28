import React, { useState, useEffect } from 'react';
import { Employee } from './EmployeeInformation';
import { useNavigate } from 'react-router-dom';

function EmployeePage({ setIsLogged }) {
    const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [employeeInput, setEmployeeInput] = useState({
    Id: '',
    FirstName: '',
    LastName: '',
  });
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    // Fetch all employees (Read in CRUD)
    fetch('http://localhost:5000/employees')
      .then(response => response.json())
      .then(data => {
        const employeeInstances = data.map(emp => new Employee(emp.id, emp.firstName, emp.lastName));
        setEmployees(employeeInstances);
      })
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleLogout = () => {
    // Perform the logout operation
    localStorage.removeItem('token'); // Or however you manage your auth tokens
    setIsLogged(false); // Update the login state
    navigate('/login'); // Redirect to the login page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeInput(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const { FirstName, LastName } = employeeInput;
    fetch('http://localhost:5000/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: FirstName, lastName: LastName })
    })
    .then(response => response.json())
    .then(addedEmployee => {
      setEmployees(prevEmployees => [...prevEmployees, new Employee(addedEmployee.id, addedEmployee.firstName, addedEmployee.lastName)]);
      setEmployeeInput({ Id: '', FirstName: '', LastName: '' }); // Reset form
    })
    .catch(error => console.error('Error adding employee:', error));
  };

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    const { Id, FirstName, LastName } = employeeInput;
    fetch(`http://localhost:5000/employees/${Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName: FirstName, lastName: LastName })
    })
    .then(response => response.json())
    .then(updatedEmployee => {
      setEmployees(prevEmployees => prevEmployees.map(emp => emp.getId() === updatedEmployee.id ? new Employee(updatedEmployee.id, updatedEmployee.firstName, updatedEmployee.lastName) : emp));
      setEmployeeInput({ Id: '', FirstName: '', LastName: '' }); // Reset form
    })
    .catch(error => console.error('Error updating employee:', error));
  };

  const handleDeleteEmployee = (e) => {
    e.preventDefault();
    const { Id } = employeeInput;
    fetch(`http://localhost:5000/employees/${Id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.getId() !== parseInt(Id)));
      setEmployeeInput({ Id: '', FirstName: '', LastName: '' }); // Reset form
    })
    .catch(error => console.error('Error deleting employee:', error));
  };

  const renderForm = () => {
    switch (actionType) {
      case 'add':
        return (
          <form onSubmit={handleAddEmployee}>
            <input
              type="text"
              name="FirstName"
              value={employeeInput.FirstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="LastName"
              value={employeeInput.LastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
            <button type="submit">Add Employee</button>
          </form>
        );
  
      case 'update':
        return (
          <form onSubmit={handleUpdateEmployee}>
            <input
              type="number"
              name="Id"
              value={employeeInput.Id}
              onChange={handleInputChange}
              placeholder="ID"
              required
            />
            <input
              type="text"
              name="FirstName"
              value={employeeInput.FirstName}
              onChange={handleInputChange}
              placeholder="First Name"
              required
            />
            <input
              type="text"
              name="LastName"
              value={employeeInput.LastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              required
            />
            <button type="submit">Update Employee</button>
          </form>
        );
  
      case 'delete':
        return (
          <form onSubmit={handleDeleteEmployee}>
            <input
              type="number"
              name="Id"
              value={employeeInput.Id}
              onChange={handleInputChange}
              placeholder="ID"
              required
            />
            <button type="submit">Delete Employee</button>
          </form>
        );
  
      default:
        return null; // Return null when no action type is selected
    }
  };
  employees.sort((a, b) => a.getId() - b.getId());

  
  const handleGoHome = () => {
    navigate('/chooseuser'); // Navigate to the homepage
  };
  return (
    <div>
      <h1>Employee Page</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
      <button onClick={handleGoHome}>Go back to menu</button>

      <div>
        <button onClick={() => setActionType('add')}>Add Employee</button>
        <button onClick={() => setActionType('update')}>Update Employee</button>
        <button onClick={() => setActionType('delete')}>Delete Employee</button>
      </div>
      {renderForm()}
      <ul>
        {employees
          .sort((a, b) => a.getId() - b.getId()) // Sort the employees by ID
          .map(employee => (
            <li key={employee.getId()}>
              ID: {employee.getId()} -  {employee.getFirstName()} {employee.getLastName()}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default EmployeePage;
