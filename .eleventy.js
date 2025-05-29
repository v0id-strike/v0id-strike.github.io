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

    // Custom filter for category extraction
    eleventyConfig.addFilter("getCategories", function(collections) {
        const categories = new Set();
        
        // Get all items from all collections
        Object.values(collections).flat().forEach(item => {
            if (item.data.categories) {
                item.data.categories.forEach(cat => categories.add(cat));
            } else if (item.data.category) {
                categories.add(item.data.category);
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