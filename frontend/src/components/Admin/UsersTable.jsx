import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar, Typography, TextField, IconButton, Button, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import Navbar from './Navbar';

const UsersTable = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [selectedUsers, setSelectedUsers] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data); 
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSelectUser = (id) => {
    setSelectedUsers((prevSelected) => 
      prevSelected.includes(id) ? prevSelected.filter((userId) => userId !== id) : [...prevSelected, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/bulk-delete", { ids: selectedUsers }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedUsers.includes(user.id) ? { ...user, isDeactivated: true } : user
        )
      );
      setSelectedUsers([]); // Clear selected users after bulk delete
    } catch (error) {
      console.error("Error during bulk delete:", error);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      const token = localStorage.getItem("token");
  
      if (action === 'softDelete') {
        await axios.post("http://localhost:5000/api/admin/soft-delete", { userId }, { headers: { Authorization: `Bearer ${token}` } });

        setUsers(users.map(user => 
          user.id === userId ? { ...user, isDeactivated: true } : user
        ));
      } else if (action === 'reactivate') {
        await axios.post("http://localhost:5000/api/admin/reactivate", { userId }, { headers: { Authorization: `Bearer ${token}` } });

        setUsers(users.map(user => 
          user.id === userId ? { ...user, isDeactivated: false } : user
        ));
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };  

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users Report", 14, 10);

    const tableData = filteredUsers.map(user => [
      user.name || "N/A",
      user.email,
      user.status,
      new Date(user.createdAt).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Name", "Email", "Status", "Created At"]],
      body: tableData,
    });

    doc.save("users_report.pdf");
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "Select",
      width: 100,
      renderCell: (params) => (
        <Checkbox
          checked={selectedUsers.includes(params.row.id)}
          onChange={() => handleSelectUser(params.row.id)}
        />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "avatar",
      headerName: "Avatar",
      width: 80,
      renderCell: (params) => (
        <Avatar src={params.value} alt="User Avatar" />
      ),
      sortable: false,
      filterable: false,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <Typography 
          sx={{
            color: params.value === "Active" ? theme.palette.success.main : theme.palette.error.main,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 0.5,
      valueGetter: (params) => {
        const date = moment(params.value);
        if (date.isValid()) {
          return date.format('YYYY-MM-DD');
        }
        return 'Invalid Date';
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const isDeactivated = params.row.isDeactivated;
    
        // console.log(`User ${params.row.name} isDeactivated:`, isDeactivated);  

        return (
          <Box>
            {isDeactivated ? (
              <IconButton onClick={() => handleAction(params.row.id, 'reactivate')}>
                <RestoreIcon sx={{ color: "green" }} />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleAction(params.row.id, 'softDelete')}>
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            )}
          </Box>
        );
      },
    }    
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Users</Typography>
        
        {/* Search Field */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 200 }}
        />

        {/* Bulk Delete Button */}
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleBulkDelete}
          disabled={selectedUsers.length === 0}
        >
          Bulk Delete
        </Button>

        <FileDownloadIcon
          onClick={exportPDF}
          sx={{ cursor: "pointer", color: theme.palette.primary.main }}
        />
      </Box>

      <DataGrid
        rows={filteredUsers}
        columns={columns}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        autoHeight
        disableSelectionOnClick
      />
      <Navbar />
    </Box>
  );
};

export default UsersTable;