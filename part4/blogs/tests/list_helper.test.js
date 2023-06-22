const listHelper = require("../utils/list_helper");
const testData = require("./testData");
const noBlog = [];

test("dummy returns one", () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	expect(result).toBe(1);
});

describe("total likes", () => {
	test("when list has only one blog, equals the likes of that", () => {
		const result = listHelper.totalLikes(testData);
		expect(result).toBe(36);
	});

	test("when list has no blogs", () => {
		const result = listHelper.totalLikes(noBlog);
		expect(result).toBe(0);
	});
});

describe("most liked blog from list", () => {
	test("test most liked blog", () => {
		const result = listHelper.favoriteBlog(testData);
		expect(result).toEqual(testData[2]);
	});
});

describe("most common blogger from list", () => {
	test("test most liked blog", () => {
		const result = listHelper.mostBlogs(testData);
		expect(result).toEqual({ author: "Robert C. Martin", blogs: 3 });
	});
});

describe("most liked blogger", () => {
	test("test most liked blogger", () => {
		const result = listHelper.mostLikes(testData);
		expect(result).toEqual({ author: "Edsger W. Dijkstra", likes: 17 });
	});
});
