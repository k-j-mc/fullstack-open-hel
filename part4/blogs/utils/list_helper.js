const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const sumLikes = (sum, blog) => {
		return sum + blog.likes;
	};

	return blogs.length > 0 ? blogs.reduce(sumLikes, 0) : 0;
};

const mostLiked = (blogs) => {
	const maxLikes = blogs.reduce((max, blog) =>
		max.votes < blog.votes ? blog : max
	);

	return maxLikes;
};

module.exports = {
	dummy,
	mostLiked,
	totalLikes,
};
