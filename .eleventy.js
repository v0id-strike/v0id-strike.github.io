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

    // Custom filter to sort by order
    eleventyConfig.addFilter("sortByOrder", function(collection) {
        return collection.sort((a, b) => {
            // Get order values, default to 999 if not set
            const orderA = a.data.order || 999;
            const orderB = b.data.order || 999;
            
            // First sort by order
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            
            // If orders are equal, sort by date
            return new Date(b.date) - new Date(a.date);
        });
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            layouts: "_includes/layouts"
        }
    };
};