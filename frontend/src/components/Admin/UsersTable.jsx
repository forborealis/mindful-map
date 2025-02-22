import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Avatar, Typography, TextField, IconButton, Button, Checkbox } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import Navbar from './Navbar';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        console.log("API Response:", response.data); 
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
      setSelectedUsers([]); 
    } catch (error) {
      console.error("Error during bulk delete:", error);
    }
  };

  const handleAction = async (userId, action, deactivatedAt) => {
    try {
      const token = localStorage.getItem("token");
  
      if (action === "reactivate") {
        const response = await axios.post(
          "http://localhost:5000/api/admin/reactivate", 
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        if (response.data.message === "Reactivation is only allowed after 24 hours.") {
          toast.error("Reactivation is only allowed after 24 hours.");
          return;
        }
  
        setUsers(users.map(user =>
          user.id === userId ? { ...user, isDeactivated: false, deactivatedAt: null } : user
        ));
  
        toast.success("User reactivated successfully!");
        
      } else if (action === "softDelete") {
        const response = await axios.post(
          "http://localhost:5000/api/admin/soft-delete", 
          { userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // Update the user with the deactivatedAt from the response
        setUsers(users.map(user =>
          user.id === userId ? { 
            ...user, 
            isDeactivated: true, 
            deactivatedAt: response.data.deactivatedAt // Use the timestamp from backend
          } : user
        ));
  
        toast.success("User deactivated successfully!");
      }
    } catch (error) {
      console.error(`Error during ${action}:`, error);
      toast.error(error.response?.data?.message || `Error during ${action}. Please try again.`);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 25; 
    const logoHeight = 25;
    const margin = 15;
    const lineY = 42;  // Adjusted line position
    
    const tupLogo = new Image();
    const rightLogo = new Image();
    tupLogo.src = '/images/tup.png';
    rightLogo.src = '/images/logo.png';
    
    Promise.all([
      new Promise((resolve, reject) => {
        tupLogo.onload = resolve;
        tupLogo.onerror = reject;
      }),
      new Promise((resolve, reject) => {
        rightLogo.onload = resolve;
        rightLogo.onerror = reject;
      })
    ]).then(() => {
      doc.addImage(tupLogo, 'PNG', margin, 10, logoWidth, logoHeight);
      
      const rightLogoX = pageWidth - margin - logoWidth;
      doc.addImage(rightLogo, 'PNG', rightLogoX, 10, logoWidth, logoHeight);
      
      const textStart = margin + logoWidth + 10;
      const textWidth = rightLogoX - textStart;
      
      // University name 
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const universityName = "TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES-TAGUIG";
      const universityX = textStart + (textWidth - doc.getTextWidth(universityName)) / 2 - 5;
      doc.text(universityName, universityX, 20);
      
      // Program name
      doc.setFontSize(11);
      const program = "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY";
      const programX = textStart + (textWidth - doc.getTextWidth(program)) / 2 - 5;
      doc.text(program, programX, 27);
      
      // Address
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const address = "Km. 14 East Service Road, Western Bicutan, Taguig City 1630, Metro Manila, Philippines";
      const addressX = textStart + (textWidth - doc.getTextWidth(address)) / 2 - 5;
      doc.text(address, addressX, 34);
      
      // Horizontal line
      doc.setLineWidth(0.6);
      doc.setDrawColor(100, 179, 138);  
      doc.line(35, lineY, pageWidth - 35, lineY);
      
      // Add report title
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Users Report", margin, lineY + 20);
      
      // Table data
      const tableData = filteredUsers.map(user => [
        user.name || "N/A",
        user.email,
        user.status,
        new Date(user.createdAt).toLocaleDateString(),
      ]);
      
      doc.autoTable({
        head: [["Name", "Email", "Status", "Created At"]],
        body: tableData,
        startY: lineY + 25,
        margin: { top: 10, left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [100, 179, 138],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
        },
      });
      
      doc.save("users_report.pdf");
    }).catch(error => {
      console.error('Error loading images:', error);
      generatePDFWithoutLogos(doc, filteredUsers);
    });
  };
  
  // Fallback function
  const generatePDFWithoutLogos = (doc, users) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Users Report", 15, 20);
    
    const tableData = users.map(user => [
      user.name || "N/A",
      user.email,
      user.status,
      new Date(user.createdAt).toLocaleDateString(),
    ]);
    
    doc.autoTable({
      head: [["Name", "Email", "Status", "Created At"]],
      body: tableData,
      startY: 30,
      margin: { left: 15, right: 15 },
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [128, 0, 0],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
    });
    
    doc.save("users_report.pdf");
  };

  const columns = [
    {
      field: "checkbox",
      headerName: "Select",
      width: 80,
      renderCell: (params) => (
        <Checkbox
          checked={selectedUsers.includes(params.row.id)}
          onChange={() => handleSelectUser(params.row.id)}
          sx={{ color: '#4CAF50' }}
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
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email", 
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Typography
          sx={{
            bgcolor: params.value === "Active" ? '#E8F5E9' : '#FFEBEE',
            color: params.value === "Active" ? '#4CAF50' : '#F44336',
            px: 2,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => {
        if (!params.value) return "No Date Available";
        try {
          return new Date(params.value).toISOString().slice(0, 10);
        } catch (error) {
          return "Invalid Date";
        }
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => {
        const { id, isDeactivated, deactivatedAt } = params.row;
        return (
          <IconButton onClick={() => handleAction(id, isDeactivated ? "reactivate" : "softDelete", deactivatedAt)}>
            {isDeactivated ? (
              <RestoreIcon sx={{ color: "#4CAF50" }} />
            ) : (
              <DeleteIcon sx={{ color: "#F44336" }} />
            )}
          </IconButton>
        );
      },
    }    
   ];
   
   return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAF9" }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Navbar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",       // Centers vertically
          minHeight: "100vh", 
          py: 3,
          bgcolor: "#F8FAF9",
        }}
      >
        {/* Table Container */}
        <Box
          sx={{
            width: "100%", // Takes full width of the available space
            maxWidth: "1100px", 
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            margin: "0 auto", // Centers the table horizontally
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
              Users
            </Typography>

            {/* Controls */}
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                placeholder="Search..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: 280,
                  bgcolor: "#F5F5F5",
                  borderRadius: 1,
                }}
              />

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleBulkDelete}
                disabled={selectedUsers.length === 0}
                sx={{
                  bgcolor: selectedUsers.length > 0 ? "#F44336" : "#D32F2F",
                  fontSize: "0.875rem",
                  px: 3,
                }}
              >
                BULK DELETE
              </Button>

              <IconButton onClick={exportPDF} sx={{ color: "#1976D2" }}>
                <FileDownloadIcon />
              </IconButton>
            </Box>
          </Box>

          {/* DataGrid */}
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50, 100]}
            autoHeight
            disableSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "#E3F2FD",
                fontWeight: "bold",
                color: "#1565C0",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #E0E0E0",
                px: 2,
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "#FAFAFA",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
   );
};

export default UsersTable;