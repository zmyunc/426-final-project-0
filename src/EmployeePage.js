import React, { useState, useEffect } from 'react';
import { Employee } from './EmployeeInformation';
import { useNavigate } from 'react-router-dom';
import './EmployeePage.css'; // Adjust the path if necessary
import Weather from './Weather'; // Import the Weather component


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

  const handleLogout = async () => {
    // Assuming you have an endpoint to clear the session
    try {
      const response = await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Needed for cookies if you're using them
      });
      if (response.ok) {
        // Update the state and redirect to login
        setIsLogged(false);
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('There was an error logging out', error);
    }
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
  
    // Trim the input and check if they are strings and not empty
    if (typeof FirstName === 'string' && FirstName.trim() && typeof LastName === 'string' && LastName.trim()) {
      fetch('http://localhost:5000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName: FirstName.trim(), lastName: LastName.trim() })
      })
      .then(response => response.json())
      .then(addedEmployee => {
        setEmployees(prevEmployees => [...prevEmployees, new Employee(addedEmployee.id, addedEmployee.firstName, addedEmployee.lastName)]);
        setEmployeeInput({ Id: '', FirstName: '', LastName: '' }); // Reset the form
      })
      .catch(error => {
        console.error('Error adding employee:', error);
        alert('Failed to add employee. Please try again.');
      });
    } else {
      alert('First Name and Last Name must be non-empty strings.');
      // Handle invalid input case here
    }
  };
  
  

  const handleUpdateEmployee = (e) => {
    e.preventDefault();
    const { Id, FirstName, LastName } = employeeInput;
  
    // Convert ID to number and check if it is a positive number and exists in the employees array
    const idNum = Number(Id);
    const employeeExists = employees.some(employee => employee.getId() === idNum);
  
    if (idNum > 0 && employeeExists) {
      fetch(`http://localhost:5000/employees/${idNum}`, {
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
      .catch(error => {
        console.error('Error updating employee:', error);
        alert('Failed to update employee. Please try again.');
      });
    } else {
      alert('Please enter a valid and existing ID.');
      // Handle invalid or non-existing ID case here
    }
  };
  
  
  const handleDeleteEmployee = (e) => {
    e.preventDefault();
    const idNum = Number(employeeInput.Id); // Convert input to number
  
    if (idNum > 0 && employees.some(emp => emp.getId() === idNum)) {
      // If the ID is positive and exists in the employees array, proceed to delete
      fetch(`http://localhost:5000/employees/${idNum}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          setEmployees(prevEmployees => prevEmployees.filter(emp => emp.getId() !== idNum));
          setEmployeeInput({ Id: '', FirstName: '', LastName: '' }); // Reset form
        } else {
          throw new Error('Deletion was not successful.');
        }
      })
      .catch(error => {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      });
    } else {
      // Alert user if the ID is not greater than 0 or does not exist
      alert('Please enter a valid and existing ID.');
    }
  };
  




  const renderForm = () => {
    switch (actionType) {
      case 'add':
        return (
          <form onSubmit={handleAddEmployee}className="employee-form">
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
          <form onSubmit={handleUpdateEmployee}className="employee-form">
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
          <form onSubmit={handleDeleteEmployee}className="employee-form">
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



  const onAddEmployeeClick = () => setActionType('add');
  const onUpdateEmployeeClick = () => setActionType('update');
  const onDeleteEmployeeClick = () => setActionType('delete');
  const onLogoutClick = handleLogout;
  const onGoHomeClick = handleGoHome;



  return (
    <div className="employee-container">
        <h1 className="employee-title">Employee Page</h1>
        <div className="top-buttons">
            <button onClick={onLogoutClick} className="employee-button">Logout</button>
            <button onClick={onGoHomeClick} className="employee-button">Go back to menu</button>
        </div>

        <div className="employee-box">
            <button className="employee-button" onClick={() => setActionType('add')}>Add Employee</button>
            <button className="employee-button" onClick={() => setActionType('update')}>Update Employee</button>
            <button className="employee-button" onClick={() => setActionType('delete')}>Delete Employee</button>
        </div>
        {renderForm()}
        <ul className="employee-list">
            {employees.map(employee => (
                <li key={employee.getId()}>
                    ID: {employee.getId()} - {employee.getFirstName()} {employee.getLastName()}
                </li>
            ))}
        </ul>
        <div className='weather-display '>
    <Weather cityId="4460162" /> 
  </div>
    </div>
);
}

export default EmployeePage;
