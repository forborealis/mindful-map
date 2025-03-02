import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Navbar from './Navbar';

const StatisticsTable = () => {
  const [statistics, setStatistics] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched data:', response.data); // Debugging log
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredStatistics = statistics.filter((stat) =>
    stat.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = 25;
    const logoHeight = 25;
    const margin = 15;
    const lineY = 42;

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

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      const universityName = "TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES-TAGUIG";
      const universityX = textStart + (textWidth - doc.getTextWidth(universityName)) / 2 - 5;
      doc.text(universityName, universityX, 20);

      doc.setFontSize(11);
      const program = "BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY";
      const programX = textStart + (textWidth - doc.getTextWidth(program)) / 2 - 5;
      doc.text(program, programX, 27);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const address = "Km. 14 East Service Road, Western Bicutan, Taguig City 1630, Metro Manila, Philippines";
      const addressX = textStart + (textWidth - doc.getTextWidth(address)) / 2 - 5;
      doc.text(address, addressX, 34);

      doc.setLineWidth(0.6);
      doc.setDrawColor(100, 179, 138);
      doc.line(35, lineY, pageWidth - 35, lineY);

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Statistics Report", margin, lineY + 20);

      let currentY = lineY + 30;

      doc.autoTable({
        head: [['Email', 'Correlation Values', 'Correlation Moods', 'Correlation Activities', 'Sleep Quality Values', 'Sleep Qualities', 'Date']],
        body: filteredStatistics.map((stat) => [
          stat.email,
          stat.correlationValues.join(', '),
          stat.correlationMoods.join(', '),
          stat.correlationActivities.join(', '),
          stat.sleepQualityValues.join(', '),
          stat.sleepQualities.join(', '),
          new Date(stat.createdAt).toLocaleDateString(),
        ]),
        startY: currentY,
        margin: { left: margin, right: margin },
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

      doc.save('statistics.pdf');
    }).catch(error => {
      console.error('Error loading images:', error);
    });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAF9" }}>
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Navbar />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          py: 3,
          bgcolor: "#F8FAF9",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1100px",
            bgcolor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            margin: "0 auto",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
              Statistics
            </Typography>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                placeholder="Search by email"
                size="small"
                value={searchText}
                onChange={handleSearch}
                sx={{
                  width: 280,
                  bgcolor: "#F5F5F5",
                  borderRadius: 1,
                }}
              />
              <IconButton onClick={handleDownloadPDF} sx={{ color: "#1976D2" }}>
                <FileDownloadIcon />
              </IconButton>
            </Box>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table aria-label="statistics table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Correlation Values</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Correlation Moods</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Correlation Activities</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Sleep Quality Values</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Sleep Qualities</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#4CAF50' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStatistics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>No statistics found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStatistics.map((stat) => (
                    <TableRow key={stat.id} hover>
                      <TableCell>{stat.email}</TableCell>
                      <TableCell>{stat.correlationValues.join(', ')}</TableCell>
                      <TableCell>{stat.correlationMoods.join(', ')}</TableCell>
                      <TableCell>{stat.correlationActivities.join(', ')}</TableCell>
                      <TableCell>{stat.sleepQualityValues.join(', ')}</TableCell>
                      <TableCell>{stat.sleepQualities.join(', ')}</TableCell>
                      <TableCell>{new Date(stat.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default StatisticsTable;