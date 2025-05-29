const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
    // Add markdown support
    const md = new markdownIt({
        html: true,
        breaks: true,
        linkify: true
    });
    eleventyConfig.setLibrary("md", md);

    // Copy static assets
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/images");

    // Add posts collection
    eleventyConfig.addCollection("posts", function(collection) {
        return collection.getFilteredByGlob("src/posts/**/*.md");
    });

        // Add getCategories filter
    eleventyConfig.addFilter("getCategories", function(collections) {
        const categories = new Set();
        
        // Get all items from the posts collection
        collections.posts.forEach(item => {
            // Get the directory name from the file path
            const path = item.filePathStem.replace('/posts/', '');
            const category = path.split('/')[0];
            if (category) {
                categories.add(category);
            }
        });
        
        return Array.from(categories).sort();
    });

    return {
        dir: {
            input: "src",
            output: "docs"
        }
    };
};