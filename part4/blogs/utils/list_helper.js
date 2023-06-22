const _ = require("lodash");

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const sumLikes = _.sumBy(blogs, "likes");

	return sumLikes;
};

const favoriteBlog = (blogs) => {
	const maxBlogLikes = _.maxBy(blogs, "likes");

	return maxBlogLikes;
};

const mostBlogs = (blogs) => {
	const maxBlogs = _(blogs)
		.countBy("author")
		.map((blogs, author) => ({
			author: author,
			blogs: blogs,
		}))
		.sortBy("blogs")
		.reverse()
		.value();

	return maxBlogs[0];
};

const mostLikes = (blogs) => {
	const maxLikes = _(blogs)
		.groupBy("author")
		.map((likes, author) => ({
			author: author,
			likes: _.sumBy(likes, "likes"),
		}))
		.sortBy("likes")
		.reverse()
		.value();

	return maxLikes[0];
};

module.exports = {
	dummy,
	favoriteBlog,
	mostBlogs,
	mostLikes,
	totalLikes,
};
