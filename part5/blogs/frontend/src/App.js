import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import User from "./components/User";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Blog from "./components/Blog";
import Footer from "./components/Footer";
import Notification from "./components/Notification";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);

	const [notification, setNotification] = useState({
		message: null,
		variant: null,
	});

	const [blogs, setBlogs] = useState([]);

	const blogFormRef = useRef();

	const getAllBlogs = () => {
		blogService
			.getAll()
			.then((blogs) => setBlogs(blogs))
			.catch((error) => {
				handleNotification({
					message: error.response.data.error,
					variant: "error",
				});
			});
	};

	useEffect(() => {
		getAllBlogs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);

			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const handleNotification = (event) => {
		setNotification({
			message: event.message,
			variant: event.variant,
		});

		setTimeout(() => {
			setNotification({
				message: null,
				variant: null,
			});
		}, 5000);
	};

	const addBlog = (blogObject) => {
		blogFormRef.current.toggleVisibility();

		blogService
			.create(blogObject)
			.then((returnedBlog) => {
				getAllBlogs();
				handleNotification({
					message: `A new blog ${blogObject.title} by ${blogObject.author} added`,
					variant: "success",
				});
			})
			.catch((error) => {
				handleNotification({
					message: error.response.data.error,
					variant: "error",
				});
			});
	};

	const handleLikeBlog = (blogObject) => {
		blogService
			.update(blogObject.id, blogObject)
			.then((response) => {
				getAllBlogs();
				handleNotification({
					message: `${blogObject.title} was successfully liked`,
					variant: "success",
				});
			})
			.catch((error) => {
				handleNotification({
					message: error.response.data.error,
					variant: "error",
				});
			});
	};

	const handleDeleteBlog = (blogObject) => {
		if (
			window.confirm(
				`Remove blog: ${blogObject.title} by ${blogObject.author}?`
			)
		) {
			blogService
				.remove(blogObject.id)
				.then((response) => {
					getAllBlogs();
					handleNotification({
						message: `${blogObject.title} was successfully deleted`,
						variant: "success",
					});
				})
				.catch((error) => {
					handleNotification({
						message: error.response.data.error,
						variant: "error",
					});
				});
		}
	};

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({
				username,
				password,
			});

			window.localStorage.setItem(
				"loggedBlogAppUser",
				JSON.stringify(user)
			);

			blogService.setToken(user.token);

			handleNotification({
				message: `Welcome ${user.name}!`,
				variant: "success",
			});

			setUser(user);
			setUsername("");
			setPassword("");
		} catch (exception) {
			handleNotification({
				message: exception.response.data.error,
				variant: "error",
			});
		}
	};

	const handleLogout = async (event) => {
		event.preventDefault();

		try {
			handleNotification({
				message: `Logging ${user.name} out!`,
				variant: "success",
			});
			window.localStorage.clear();
			blogService.setToken(null);
			setUser(null);
		} catch (exception) {
			handleNotification({
				message: "Log out unsuccessful, please try again",
				variant: "error",
			});
		}
	};

	return (
		<div>
			<Notification notification={notification} />
			{!user ? (
				<LoginForm
					username={username}
					password={password}
					handleUsernameChange={({ target }) =>
						setUsername(target.value)
					}
					handlePasswordChange={({ target }) =>
						setPassword(target.value)
					}
					handleSubmit={handleLogin}
				/>
			) : (
				<div>
					<Header message="Blogs App" />
					<User handleLogout={handleLogout} user={user} />
					<div>
						<Header message="create new" />
						<Togglable
							buttonLabel="New blog"
							ref={blogFormRef}
							hideButtonLabel="Cancel"
						>
							<BlogForm createBlog={addBlog} />
						</Togglable>
					</div>

					<div>
						<ul>
							{blogs.map((blog) => (
								<Blog
									key={blog.id}
									blog={blog}
									user={user}
									handleLikeBlog={handleLikeBlog}
									handleDeleteBlog={handleDeleteBlog}
								/>
							))}
						</ul>
					</div>

					<Footer />
				</div>
			)}
		</div>
	);
};

export default App;
