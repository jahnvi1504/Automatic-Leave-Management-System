const Leave = require('../models/leaveModel');
const db = require('../config/db');

exports.createLeave = (req, res) => {
  Leave.create(req.body, (err) => {
    if (err) throw err;
    res.send('Leave request created');
  });
};

exports.getLeaves = (req, res) => {
  Leave.getAll((err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

exports.getEmployeeLeaves = (req, res) => {
  Leave.getByEmployee(req.params.id, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Leave approval with leave balance check
exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (status !== "Approved") {
    // For Declined/other
    Leave.updateStatus(id, status, (err) => {
      if (err) throw err;
      res.send('Leave status updated');
    });
    return;
  }

  // Find leave request and user for Approve
  db.query('SELECT * FROM leaves WHERE id = ?', [id], (err, leaveResults) => {
    if (err || !leaveResults.length) return res.status(404).send('Leave request not found');
    const leave = leaveResults[0];
    const daysRequested = Math.ceil((new Date(leave.end_date) - new Date(leave.start_date)) / (1000 * 60 * 60 * 24)) + 1;
    db.query('SELECT leave_balance FROM users WHERE id = ?', [leave.employee_id], (err2, userResults) => {
      if (err2 || !userResults.length) return res.status(404).send('User not found');
      const balance = userResults[0].leave_balance;
      if (balance < daysRequested) {
        return res.status(400).send('Insufficient leave balance');
      }
      // Approve leave and deduct balance
      Leave.updateStatus(id, status, (err3) => {
        if (err3) throw err3;
        db.query('UPDATE users SET leave_balance = leave_balance - ? WHERE id = ?', [daysRequested, leave.employee_id], (err4) => {
          if (err4) return res.status(500).send('Error updating balance');
          res.send('Leave status updated');
        });
      });
    });
  });
};
