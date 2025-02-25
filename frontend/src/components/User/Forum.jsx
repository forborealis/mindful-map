import React, { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNowStrict } from 'date-fns';
import {Box, Card, Typography, Avatar, Stack, Paper, TextField, Button, 
        Alert, Snackbar, IconButton, Menu, MenuItem } from "@mui/material";
import { AccessTime, MoreVert } from "@mui/icons-material";

const ForumDiscussion = () => {
  const [todaysPrompt, setTodaysPrompt] = useState(null);
  const [pastForums, setPastForums] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  useEffect(() => {
    const fetchUserAndPrompt = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Get user data
        const userResponse = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(userResponse.data);
        
        // Get today's prompt - this call will also handle setting isUsed=true on the backend
        // if a new prompt is selected from the unused pool
        const promptResponse = await axios.get("http://localhost:5000/api/todays-prompt", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Check if we have a valid prompt response with an ID
        if (promptResponse.data && promptResponse.data._id) {
          setTodaysPrompt(promptResponse.data);
          
          // Get comments/discussions for this prompt
          const forumResponse = await axios.get(`http://localhost:5000/api/${promptResponse.data._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (forumResponse.data && forumResponse.data.discussions) {
            setComments(forumResponse.data.discussions);
          }
        } else if (promptResponse.data && promptResponse.data.message) {
          // Handle case where we get a message about no prompts being available
          setTodaysPrompt(null);
          console.log(promptResponse.data.message);
        } else {
          // Handle any other case where we don't have a valid prompt
          setTodaysPrompt(null);
        }
        
        // Fetch past forums with comments
        const pastForumsResponse = await axios.get("http://localhost:5000/api/past-forums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (pastForumsResponse.data && pastForumsResponse.data.length > 0) {
          // Sort forums by createdAt in descending order (newest first)
          const sortedForums = pastForumsResponse.data.sort((a, b) => 
            new Date(b.prompt.createdAt) - new Date(a.prompt.createdAt)
          );
          setPastForums(sortedForums);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        
        // Provide more specific error messages based on the error
        if (error.response) {
          setError(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to load data. Please try refreshing the page.");
        }
        
        setLoading(false);
      }
    };
  
    fetchUserAndPrompt();
  }, []);

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(commentId);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };
  
  const handlePostComment = async () => {
    if (!newComment.trim() || !user || !todaysPrompt) return;
    
    try {
      const token = localStorage.getItem("token");
      
      if (!todaysPrompt._id || !todaysPrompt._id.match(/^[0-9a-fA-F]{24}$/)) {
        setSnackbar({
          open: true,
          message: 'Invalid prompt ID. Cannot post comment.',
          severity: 'error'
        });
        return;
      }
      
      // Save the comment to the forum schema
      const response = await axios.post("http://localhost:5000/api/comment", {
          promptId: todaysPrompt._id,
          content: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.newDiscussion) {
        setComments([response.data.newDiscussion, ...comments]);
        setNewComment("");
        setSnackbar({
          open: true,
          message: 'Comment posted successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error posting comment. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDeleteComment = async () => {
    if (!selectedComment) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/${todaysPrompt._id}/comment/${selectedComment}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setComments(comments.filter(comment => comment._id !== selectedComment));
      setSnackbar({ open: true, message: "Comment deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSnackbar({ open: true, message: "Failed to delete comment", severity: "error" });
    } finally {
      handleMenuClose();
    }
  };

  const getAvatarColor = (name) => {
    const colors = ["primary.main", "secondary.main", "success.main", "warning.main", "info.main"];
    const nameHash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[nameHash % colors.length];
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  // Function to render comments for a forum
  const renderComments = (discussionComments) => {
    return discussionComments.length > 0 ? (
      discussionComments.map((comment, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "flex-start", position: "relative" }}>
          <Avatar 
            sx={{ 
              bgcolor: comment.user && comment.user.avatar 
                ? null 
                : getAvatarColor(comment.user?.name || "User"), 
              mr: 2,
              mt: 1.5
            }}
            src={comment.user?.avatar || null}
          >
            {comment.user?.name ? comment.user.name[0] : "U"}
          </Avatar>
          <Paper
            elevation={0}
            sx={{
              p: 1,
              pl: 3,
              borderRadius: 5,
              bgcolor: "#f0f0f0",
              width: "80%"
            }}
          >
            <Typography fontWeight="bold" sx={{ fontSize: "0.9rem" }}>
              {comment.user?.name || "Anonymous User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              <AccessTime sx={{ fontSize: "0.9rem", mr: 0.5 }} />
              {formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
              {comment.content}
            </Typography>
          </Paper>
  
          {/* Show delete menu only for user's own comments */}
          {user && comment.user?._id === user._id && (
            <>
              <IconButton
                sx={{ position: "absolute", right: 10, top: 5 }}
                onClick={(event) => handleMenuOpen(event, comment._id)}
              >
                <MoreVert />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      ))
    ) : (
      <Typography color="text.secondary" align="center" py={4}>
        No comments yet.
      </Typography>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography>Loading discussion...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ width: "100%", maxWidth: "650px" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      {/* Today's Forum */}
      {todaysPrompt && (
      <Card sx={{ width: "900px", p: 5, borderRadius: 5, boxShadow: 3, mb: 4 }}>
        {/* Prompt Header */}
        <Typography variant="subtitle1" color="success.main" gutterBottom>
          TODAY, {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
        </Typography>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Today's Prompt: {todaysPrompt.question}
        </Typography>

        {/* Comments Section */}
        <Stack 
          spacing={2} 
          mt={3} 
          sx={{ 
            height: "200px",  
            overflowY: "auto", 
            pr: 1
          }}
        >
          {renderComments(comments)}
        </Stack>

        {/* Comment Input Section */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              mr: 2,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostComment}
            disabled={!newComment.trim()}
            sx={{
              textTransform: "none",
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: "bold",
            }}
          >
            Post
          </Button>
        </Box>
      </Card>
    )}
    
    {/* Information message when no prompt is available */}
    {!todaysPrompt && pastForums.length > 0 && (
      <Alert severity="info" sx={{ width: "900px", mb: 4 }}>
        No new prompt is available for today. You can view past discussions below.
      </Alert>
    )}
    
    {/* Past Forums */}
    {pastForums.map((forum, index) => (
      <Card 
        key={index} 
        sx={{ 
          width: "900px", 
          p: 5, 
          borderRadius: 5, 
          boxShadow: 3, 
          mb: 4 
        }}
      >
        {/* Prompt Header */}
        <Typography variant="subtitle1" color="success.main" gutterBottom>
          {new Date(forum.prompt.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </Typography>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {forum.prompt?.question || "Past prompt"}
        </Typography>

        {/* Comments Section */}
        <Stack 
          spacing={2} 
          mt={3} 
          sx={{ 
            height: "200px",  
            overflowY: "auto", 
            pr: 1
          }}
        >
          {renderComments(forum.discussions)}
        </Stack>
      </Card>
    ))}
      
      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ForumDiscussion;