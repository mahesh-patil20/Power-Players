import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, CardActions } from "@mui/material";
import ReactMarkdown from "react-markdown";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Drawer, TextField } from "@material-ui/core";
const Blogs = () => {
  const dummy = [
    {
      title: "Blog 1",
      content: "This is the content of blog 1",
      youtubeLink: "https://www.youtube.com/watch?v=1",
    },
    {
      title: "Blog 2",
      content: "This is the content of blog 2",
      youtubeLink: "https://www.youtube.com/watch?v=2",
    },
    {
      title: "Blog 3",
      content: "This is the content of blog 3",
      youtubeLink: "https://www.youtube.com/watch?v=3",
    },
    {
      title: "Blog 3",
      content: "This is the content of blog 3",
      youtubeLink: "https://www.youtube.com/watch?v=3",
    },
    {
      title: "Blog 3",
      content: "This is the content of blog 3",
      youtubeLink: "https://www.youtube.com/watch?v=3",
    },
  ];
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [newComment, setNewComment] = useState("");
  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
  };

//   useEffect(() => {
//     console.log("Selected Blog: ", selectedBlog);
    
//     },[selectedBlog])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogID = selectedBlog._id;
    try {
      const response =  await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addcomment`, {
        blogId: blogID, 
        comment: newComment,
        username : localStorage.getItem("name"),
        useremail : localStorage.getItem("email"),
      });
      toast.success("Comment posted successfully");
      setNewComment(""); // Clear the input field\
    setSelectedBlog(response.data.blog);
      
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getblogs`
      ); // Assuming your backend API endpoint for fetching blogs is /blogs
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.document.title = "Blogs";
    fetchBlogs();
  }, []);

  function MultiActionAreaCard({
    title,
    content,
    image,
    Date,
    Username,
    comments,
    _id,
  }) {
    return (
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: 10,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardActionArea sx={{ display: "flex", flexDirection: "column" }}>
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt={title}
            sx={{ objectFit: "cover" }} // Ensures the image covers the entire area
          />
          <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ fontWeight: "boldest" }}
            >
              {title.length > 25 ? title.substring(0, 25) + "..." : title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{ textAlign: "left" }}
            >
              {content.length > 100
                ? content.substring(0, 100) + "..."
                : content}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                textAlign: "left",
                fontStyle: "italic",
                color: "grey",
                fontSize: "0.8rem",
              }}
            >
              Written By :{Username == localStorage.getItem("name") ? "You" : Username}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                textAlign: "left",
                fontStyle: "italic",
                color: "grey",
                fontSize: "0.8rem",
              }}
            >
              Date : {Date}
              {/* {_id} */}
            </Typography>
          </CardContent>
          <CardActions sx={{ flexShrink: 0 }}>
            <Button
              size="small"
              color="primary"
              onClick={() =>
                handleReadMore({
                  title,
                  content,
                  image,
                  Date,
                  Username,
                  comments,
                    _id,
                })
              }
            >
              Read more...
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    );
  }

//   useEffect(() => {
//     console.log(blogs);
//   }, [blogs]);


  return (
    <>
      {/* <div style={{
                padding: "2rem",
            }}>
            <Grid container spacing={4}>
                {blogs.map(blog => (
                    <Grid item xs={12} sm={10} md={3} key={blog._id}>
                        <Card style={{
                            borderRadius: "5px",
                            backgroundColor: "rgb(232, 238, 244)",
                        }}>
                            <CardContent>
                                <Typography variant="h6" component="h2" style={{
                                    margin: "1em"
                                }}>{blog.title}</Typography>
                                <Typography variant="body2" color="textSecondary" component="p" style={{
                                    margin: "1em"
                                }}>
                                    {blog.content.substring(0, 100)}...
                                </Typography>
                                <Button href={`/blogs/${blog._id}`} onClick={handleOpen} style={{
                                    margin: "1em",
                                    color: "158344",
                                    backgroundColor: "white",
                                    borderRadius: "20px",
                                    padding: "0.5em"

                                }}>Read More</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <BlogModal style={{
                    padding: "3rem",
                }}>
                    <h2 id="modal-modal-title" style={{
                        margin: "0 0 2rem 0"
                    }}>{blog.title}</h2>
                    {blog.youtubeLink && (
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${blog.youtubeLink.split('=')[1]}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                    <div style={{
                        padding: "2em 0",
                        textAlign: "justify"
                    }}>{blog.content}</div>
                </BlogModal>
            </Modal>
            <br></br> */}
      {/* <Footer/> */}

      <div
        style={{
          width: "100%",
          // border: "1px solid black",
        }}
      >
        <Grid container spacing={2} sx={{ margin: "0 -2px" }}>
          {blogs.map((blog) => (
            <Grid
              item
              key={blog._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ padding: "0 8px" }}
            >
              <MultiActionAreaCard
                title={blog.title}
                content={blog.content}
                image={blog.image}
                Date={blog.date}
                Username={blog.username}
                comments={blog.comments}
                _id={blog._id}
              />
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Drawer to Display the Selected Blog */}
      <div>
        <Drawer
          anchor="bottom"
          open={selectedBlog !== null}
          onClose={() => {
            setSelectedBlog(null);
            fetchBlogs();
           }} 
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "#158344",
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{
                // border: "1px solid white",
                width: "100vw",
                margin: "0 auto",
                fontSize: "1.3rem",
              }} >{selectedBlog?.title}</div>
              <CloseIcon
                onClick={() => {
                    setSelectedBlog(null);
                    fetchBlogs();
                   }}
                style={{ cursor: "pointer"}}
              />
            </div>
            <div
              style={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={selectedBlog?.image}
                alt={selectedBlog?.title}
                style={{ height: "300px", width: "600px", objectFit: "cover" }}
              />
           
              <div
                style={{ width: "75%", margin: "20px 0", textAlign: "justify" }}
              >
                    <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                textAlign: "left",
                fontStyle: "italic",
                color: "grey",
                fontSize: "0.8rem",
              }}
            >
              Written By : {selectedBlog?.Username == localStorage.getItem("name") ? "You" : selectedBlog?.Username}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                textAlign: "left",
                fontStyle: "italic",
                color: "grey",
                fontSize: "0.8rem",
                margin: "10px 0"
              }}
            >
              Date : {selectedBlog?.Date}
              {/* {_id} */}
            </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  <ReactMarkdown>{selectedBlog?.content}</ReactMarkdown>
                </Typography>
              </div>
              {/* {selectedBlog.comments && (
                <div style={{ width: "75%", margin: "20px 0" }}>
                  <Typography variant="h6">Comments:</Typography>
                  {selectedBlog.comments.map((comment, index) => (
                    <Typography key={index} variant="body1">
                      {comment}
                    </Typography>
                  ))}
                </div>
              )} */}
              {/* {selectedBlog?._id && (<div>{selectedBlog._id}</div>)} */}
              {selectedBlog?.comments && (
                <div style={{ width: "75%", margin: "20px 0" }}>
                  <Typography variant="h6">Comments:</Typography>
                  {selectedBlog.comments.map((comment, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #158344",
                        padding: "10px",
                        margin: "10px 0",
                      }}
                    >
                      <Typography variant="body1">
                        <strong>{comment.username === localStorage.getItem('name') ? "You" : comment.username }</strong>: {comment.comment}
                      </Typography>
                    </div>
                  ))}
                </div>
                )}
              <form
                onSubmit={handleSubmit}
                style={{
                  width: "75%",
                  margin: "20px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <TextField
                  label="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  fullWidth
                  multiline
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                >
                  Post Comment
                </Button>
              </form>
            </div>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default Blogs;
