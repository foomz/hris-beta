import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './PayrollAccounts.css';

const API_BASE_URL = 'http://localhost:8000/api';

function PayrollAccounts() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [payrollAccounts, setPayrollAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null); // State to track if editing
  const [activeMenu, setActiveMenu] = useState(null); // Track active dropdown menu
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    department: '',
    bank_name: '',
    bank_account: '',
    basic_pay: '',
    gross_pay: '',
    over_time_pay: '',
    allowance: '',
    sss_account: '',
    sss_contribution: '',
    gsis_account: '',
    gsis_contribution: '',
    phil_health_account: '',
    phil_health_contribution: '',
    pag_ibig_account: '',
    pag_ibig_contribution: ''
  });
    // Pagination and entry limits
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesToShow, setEntriesToShow] = useState(20); // Default: 20 entries per page

  useEffect(() => {
    fetch(`${API_BASE_URL}/payroll-accounts/`)
      .then(response => response.json())
      .then(data => setPayrollAccounts(data))
      .catch(error => console.error('Error fetching payroll accounts:', error));
  }, []);

    // Handle entries to show
    const handleEntriesChange = (e) => {
      setEntriesToShow(Number(e.target.value));
      setCurrentPage(1); // Reset to first page when changing the entries limit
    };
  
    // Calculate paginated data
    const indexOfLastEntry = currentPage * entriesToShow;
    const indexOfFirstEntry = indexOfLastEntry - entriesToShow;
    const currentEntries = payrollAccounts.slice(indexOfFirstEntry, indexOfLastEntry);
  
    // Total pages calculation
    const totalPages = Math.ceil(payrollAccounts.length / entriesToShow);
  
    // Handle page change
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `${API_BASE_URL}/payroll-accounts/${editingId}/`
      : `${API_BASE_URL}/payroll-accounts/`;

    const method = editingId ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (editingId) {
          setPayrollAccounts(payrollAccounts.map(acc => acc.id === editingId ? data : acc));
        } else {
          setPayrollAccounts([...payrollAccounts, data]);
        }
        setShowModal(false);
        setEditingId(null);
        resetFormData();
      })
      .catch(error => console.error('Error saving payroll account:', error));
  };

  const handleEdit = (account) => {
    setFormData({
      full_name: account.full_name,
      position: account.position,
      department: account.department,
      bank_name: account.bank_name,
      bank_account: account.bank_account,
      basic_pay: account.basic_pay,
      gross_pay: account.gross_pay,
      over_time_pay: account.over_time_pay,
      allowance: account.allowance,
      sss_account: account.sss_account,
      sss_contribution: account.sss_contribution,
      gsis_account: account.gsis_account,
      gsis_contribution: account.gsis_contribution,
      phil_health_account: account.phil_health_account,
      phil_health_contribution: account.phil_health_contribution,
      pag_ibig_account: account.pag_ibig_account,
      pag_ibig_contribution: account.pag_ibig_contribution,
    });
    setEditingId(account.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/payroll-accounts/${id}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.status === 204) {
          setPayrollAccounts(payrollAccounts.filter(account => account.id !== id));
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      })
      .catch(error => console.error('Error deleting payroll account:', error));
  };

  const resetFormData = () => {
    setFormData({
      full_name: '',
      position: '',
      department: '',
      bank_name: '',
      bank_account: '',
      basic_pay: '',
      gross_pay: '',
      over_time_pay: '',
      allowance: '',
      sss_account: '',
      sss_contribution: '',
      gsis_account: '',
      gsis_contribution: '',
      phil_health_account: '',
      phil_health_contribution: '',
      pag_ibig_account: '',
      pag_ibig_contribution: ''
    });
  };

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="data-container">
                  <button className="back-button" onClick={() => navigate("/payrollmanagement")}>
          Back
        </button>
      <div className="header-container">
        <button className="add-button" onClick={() => { resetFormData(); setShowModal(true); }}>Add Payroll Account</button>
      </div>
      <table className="employees-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Bank Name</th>
            <th>Bank Account</th>
            <th>Basic Pay</th>
            <th>Gross Pay</th>
            <th>Over Time Pay</th>
            <th>Allowance</th>
            <th>SSS Account</th>
            <th>SSS Contribution</th>
            <th>GSIS Account</th>
            <th>GSIS Contribution</th>
            <th>PhilHealth Account</th>
            <th>PhilHealth Contribution</th>
            <th>Pag-Ibig Account</th>
            <th>Pag-Ibig Contribution</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payrollAccounts.map(account => (
            <tr key={account.id}>
              <td>{account.full_name}</td>
              <td>{account.position}</td>
              <td>{account.department}</td>
              <td>{account.bank_name}</td>
              <td>{account.bank_account}</td>
              <td>{account.basic_pay}</td>
              <td>{account.gross_pay}</td>
              <td>{account.over_time_pay}</td>
              <td>{account.allowance}</td>
              <td>{account.sss_account}</td>
              <td>{account.sss_contribution}</td>
              <td>{account.gsis_account}</td>
              <td>{account.gsis_contribution}</td>
              <td>{account.phil_health_account}</td>
              <td>{account.phil_health_contribution}</td>
              <td>{account.pag_ibig_account}</td>
              <td>{account.pag_ibig_contribution}</td>
              <td>
  <div className="actions-menu">
    <button className="dots-button" onClick={() => toggleMenu(account.id)}>⋮</button>
    {activeMenu === account.id && (
      <div className="dropdown-menu">
        <button onClick={() => handleEdit(account)}>Edit</button>
        <button onClick={() => handleDelete(account.id)}>Delete</button>
      </div>
    )}
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>

                    {/* Entries Display Dropdown */}
                    <div className="entries-display">
          <label htmlFor="entries">Show</label>
          <select id="entries" value={entriesToShow} onChange={handleEntriesChange}>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>
      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="exit-button" onClick={() => setShowModal(false)}>×</button>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input type="text" name="position" value={formData.position} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input type="text" name="department" value={formData.department} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
  <label>Bank Name</label>
  <select
    name="bank_name"
    value={formData.bank_name}
    onChange={handleInputChange}
    required
  >
    <option value="">Select a bank</option> {/* Placeholder option */}
    <option value="AUB">AUB</option>
    <option value="BDO">BDO</option>
    <option value="BPI">BPI</option>
    <option value="LandBank">LandBank</option>
    <option value="MetroBank">MetroBank</option>
    <option value="RCBC">RCBC</option>
    <option value="EastWest">EastWest</option>
    {/* Add more options as needed */}
  </select>
</div>

              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bank Account</label>
                  <input type="text" name="bank_account" value={formData.bank_account} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Basic Pay</label>
                  <input type="number" name="basic_pay" value={formData.basic_pay} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gross Pay</label>
                  <input type="number" name="gross_pay" value={formData.gross_pay} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Overtime Pay</label>
                  <input type="text" name="over_time_pay" value={formData.over_time_pay} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Allowance</label>
                  <input type="number" name="allowance" value={formData.allowance} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>SSS Account</label>
                  <input type="text" name="sss_account" value={formData.sss_account} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SSS Contribution</label>
                  <input type="number" name="sss_contribution" value={formData.sss_contribution} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>GSIS Account</label>
                  <input type="text" name="gsis_account" value={formData.gsis_account} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>GSIS Contribution</label>
                  <input type="number" name="gsis_contribution" value={formData.gsis_contribution} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>PhilHealth Account</label>
                  <input type="text" name="phil_health_account" value={formData.phil_health_account} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>PhilHealth Contribution</label>
                  <input type="number" name="phil_health_contribution" value={formData.phil_health_contribution} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Pag-Ibig Account</label>
                  <input type="text" name="pag_ibig_account" value={formData.pag_ibig_account} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row"></div>
              <div className="form-group">
                  <label>Pag-Ibig Contribution</label>
                  <input type="number" name="pag_ibig_contribution" value={formData.pag_ibig_contribution} style={{ width: "345px" }} onChange={handleInputChange} required/>
                  </div>
              {/* Add other form fields similarly */}
              <div className="form-buttons">
                <button type="submit" className="submit-button">Submit</button>
                <button type="button" className="close-button" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollAccounts;