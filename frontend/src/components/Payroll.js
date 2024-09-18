import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary components from Chart.js
import './Payroll.css';

const API_BASE_URL = 'http://localhost:8000/api';

function Payroll() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [payrollData, setPayrollData] = useState([]);
  const [payrollAccounts, setPayrollAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    department: '',
    start_date: '',
    end_date: '',
    worked_days: '',
    basic_pay: '',
    over_time_pay: '',
    allowance: '',
    sss_contribution: '',
    gsis_contribution: '',
    phil_health_contribution: '',
    pag_ibig_contribution: '',
    gross_pay: '',
    total_deductions: '',
    net_pay: ''
  });
  const [isReadOnly, setIsReadOnly] = useState(true);

  // Pagination and entry limits
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesToShow, setEntriesToShow] = useState(20); // Default: 20 entries per page

  useEffect(() => {
    fetch(`${API_BASE_URL}/payroll/`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched payroll data:', data); // Debugging line
        setPayrollData(data);
      })
      .catch(error => console.error('Error fetching payroll data:', error));
  }, []);

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
  const currentEntries = payrollData.slice(indexOfFirstEntry, indexOfLastEntry);

  // Total pages calculation
  const totalPages = Math.ceil(payrollData.length / entriesToShow);

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

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setFormData({
      ...formData,
      department: selectedDepartment,
      full_name: '',
    });
  };

  const handleFullNameChange = (e) => {
    const selectedFullName = e.target.value;
    const selectedAccount = payrollAccounts.find(account => account.full_name === selectedFullName && account.department === formData.department);

    if (selectedAccount) {
      setFormData({
        ...formData,
        full_name: selectedAccount.full_name,
        position: selectedAccount.position,
        basic_pay: selectedAccount.basic_pay,
        over_time_pay: selectedAccount.over_time_pay,
        allowance: selectedAccount.allowance,
        sss_contribution: selectedAccount.sss_contribution,
        gsis_contribution: selectedAccount.gsis_contribution,
        phil_health_contribution: selectedAccount.phil_health_contribution,
        pag_ibig_contribution: selectedAccount.pag_ibig_contribution,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editingId
      ? `${API_BASE_URL}/payroll/${editingId}/`
      : `${API_BASE_URL}/payroll/`;

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
          setPayrollData(payrollData.map(item => item.id === editingId ? data : item));
        } else {
          setPayrollData([...payrollData, data]);
        }
        setShowModal(false);
        setEditingId(null);
        resetFormData();
        setIsReadOnly(true);
      })
      .catch(error => console.error('Error saving payroll data:', error));
  };

  const handleEdit = (item) => {
    setFormData({
      full_name: item.full_name,
      position: item.position,
      department: item.department,
      start_date: item.start_date,
      end_date: item.end_date,
      worked_days: item.worked_days,
      basic_pay: item.basic_pay,
      over_time_pay: item.over_time_pay,
      allowance: item.allowance,
      sss_contribution: item.sss_contribution,
      gsis_contribution: item.gsis_contribution,
      phil_health_contribution: item.phil_health_contribution,
      pag_ibig_contribution: item.pag_ibig_contribution,
      gross_pay: item.gross_pay,
      total_deductions: item.total_deductions,
      net_pay: item.net_pay
    });
    setEditingId(item.id);
    setShowModal(true);
    setIsReadOnly(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/payroll/${id}/`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`Deleted payroll record with id ${id}`);
      // Optionally, refresh your payroll list here to reflect the deletion
    } catch (error) {
      console.error('Error deleting payroll data:', error);
    }
  };

  const resetFormData = () => {
    setFormData({
      full_name: '',
      position: '',
      department: '',
      start_date: '',
      end_date: '',
      worked_days: '',
      basic_pay: '',
      over_time_pay: '',
      allowance: '',
      sss_contribution: '',
      gsis_contribution: '',
      phil_health_contribution: '',
      pag_ibig_contribution: '',
      gross_pay: '',
      total_deductions: '',
      net_pay: ''
    });
  };

  const computePayroll = () => {
    const { basic_pay, over_time_pay, allowance, worked_days, sss_contribution, gsis_contribution, phil_health_contribution, pag_ibig_contribution } = formData;

    // Convert to numbers and default to 0 if falsy
    const basicPay = parseFloat(basic_pay) || 0;
    const workedDays = parseFloat(worked_days) || 0;
    const sssContribution = parseFloat(sss_contribution) || 0;
    const gsisContribution = parseFloat(gsis_contribution) || 0;
    const philHealthContribution = parseFloat(phil_health_contribution) || 0;
    const pagIbigContribution = parseFloat(pag_ibig_contribution) || 0;

    // Calculate Gross Pay as basic pay multiplied by worked days
    const grossPay = basicPay * workedDays;

    // Compute total deductions
    let totalDeductions = 0;
    if (sssContribution > 0) totalDeductions += sssContribution;
    if (gsisContribution > 0) totalDeductions += gsisContribution;
    if (philHealthContribution > 0) totalDeductions += philHealthContribution;
    if (pagIbigContribution > 0) totalDeductions += pagIbigContribution;

    // Compute Net Pay as Gross Pay minus Total Deductions
    const netPay = grossPay - totalDeductions;

    // Update form data with computed values
    setFormData({
      ...formData,
      gross_pay: grossPay > 0 ? grossPay.toFixed(2) : '',
      total_deductions: totalDeductions > 0 ? totalDeductions.toFixed(2) : '',
      net_pay: netPay > 0 ? netPay.toFixed(2) : ''
    });
  };

  return (
    <div className="data-container">
      <button className="back-button" onClick={() => navigate("/payrollmanagement")}>
        Back
      </button>
      <div className="header-container">
        <button className="add-button" onClick={() => { resetFormData(); setShowModal(true); setIsReadOnly(false); }}>
          Add Payroll
        </button>
      </div>
      <table className="payroll-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Position</th>
            <th>Department</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Worked Days</th>
            <th>Basic Pay</th>
            <th>Over Time Pay</th>
            <th>Allowance</th>
            <th>SSS Contribution</th>
            <th>GSIS Contribution</th>
            <th>PhilHealth Contribution</th>
            <th>Pag-Ibig Contribution</th>
            <th>Gross Pay</th>
            <th>Total Deductions</th>
            <th>Net Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map(item => (
            <tr key={item.id}>
              <td>{item.full_name}</td>
              <td>{item.position}</td>
              <td>{item.department}</td>
              <td>{item.start_date}</td>
              <td>{item.end_date}</td>
              <td>{item.worked_days}</td>
              <td>{item.basic_pay}</td>
              <td>{item.over_time_pay}</td>
              <td>{item.allowance}</td>
              <td>{item.sss_contribution}</td>
              <td>{item.gsis_contribution}</td>
              <td>{item.phil_health_contribution}</td>
              <td>{item.pag_ibig_contribution}</td>
              <td>{item.gross_pay}</td>
              <td>{item.total_deductions}</td>
              <td>{item.net_pay}</td>
              <td>
                <div className="dropdown">
                  <button className="dropbtn">⋮</button>
                  <div className="dropdown-content">
                    <a onClick={() => handleEdit(item)}>Edit</a>
                    <a onClick={() => handleDelete(item.id)}>Delete</a>
                  </div>
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
            <form className="payroll-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <input
                    list="department-list"
                    name="department"
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    required
                    readOnly={isReadOnly}
                  />
                  <datalist id="department-list">
                    {[...new Set(payrollAccounts.map(account => account.department))].map(dept => (
                      <option key={dept} value={dept} />
                    ))}
                  </datalist>
                </div>
                <div className="form-group">
  <label>Full Name</label>
  <select
    name="full_name"
    value={formData.full_name}
    onChange={handleFullNameChange}
    required
    disabled={isReadOnly}
  >
    <option value="">Select Full Name</option>
    {payrollAccounts
      .filter(account => account.department === formData.department)
      .map(account => (
        <option key={account.id} value={account.full_name}>
          {account.full_name}
        </option>
      ))}
  </select>
</div>

              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="form-group">
                  <label>Basic Pay</label>
                  <input
                    type="number"
                    name="basic_pay"
                    value={formData.basic_pay}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Over Time Pay</label>
                  <input
                    type="number"
                    name="over_time_pay"
                    value={formData.over_time_pay}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="form-group">
                  <label>Allowance</label>
                  <input
                    type="number"
                    name="allowance"
                    value={formData.allowance}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>SSS Contribution</label>
                  <input
                    type="number"
                    name="sss_contribution"
                    value={formData.sss_contribution}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="form-group">
                  <label>GSIS Contribution</label>
                  <input
                    type="number"
                    name="gsis_contribution"
                    value={formData.gsis_contribution}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>PhilHealth Contribution</label>
                  <input
                    type="number"
                    name="phil_health_contribution"
                    value={formData.phil_health_contribution}
                    onChange={handleInputChange}
                    required
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="form-group">
                  <label>Pag-Ibig Contribution</label>
                  <input
                    type="number"
                    name="pag_ibig_contribution"
                    value={formData.pag_ibig_contribution}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Worked Days</label>
                  <input
                    type="number"
                    name="worked_days"
                    value={formData.worked_days}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Gross Pay</label>
                  <input
                    type="text"
                    name="gross_pay"
                    value={formData.gross_pay}
                    readOnly
                  />
                  <label>Total Deductions</label>
                  <input
                    type="text"
                    name="total_deductions"
                    value={formData.total_deductions}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Net Pay</label>
                  <input
                    type="text"
                    name="net_pay"
                    value={formData.net_pay}
                    readOnly
                  />
                </div>
              </div>
              <div className="form-buttons">
                <button type="button" className="compute-button" onClick={computePayroll}>Compute</button>
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

export default Payroll;