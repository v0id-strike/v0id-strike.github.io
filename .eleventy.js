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
        
        collections.posts.forEach(item => {
            const path = item.filePathStem.replace('/posts/', '');
            const category = path.split('/')[0];
            if (category) {
                categories.add(category);
            }
        });
        
        return Array.from(categories).sort();
    });

    // Custom filter to sort by order and clean up titles
    eleventyConfig.addFilter("sortByOrder", function(collection) {
        return collection.sort((a, b) => {
            // Get the paths for comparison
            const pathA = a.filePathStem.replace('/posts/', '');
            const pathB = b.filePathStem.replace('/posts/', '');
            
            // Split paths into parts
            const partsA = pathA.split('/');
            const partsB = pathB.split('/');
            
            // Compare categories first
            if (partsA[0] !== partsB[0]) {
                return partsA[0].localeCompare(partsB[0]);
            }
            
            // If in same category, check for specific place
            const placeA = a.data.place || 999;
            const placeB = b.data.place || 999;
            
            if (placeA !== placeB) {
                return placeA - placeB;
            }
            
            // If same place, check for order
            const orderA = a.data.order || 999;
            const orderB = b.data.order || 999;
            
            if (orderA !== orderB) {
                return orderA - orderB;
            }
            
            // If all else is equal, sort by date
            return new Date(b.date) - new Date(a.date);
        });
    });

    // Clean up titles by removing numbers and special characters
    eleventyConfig.addFilter("cleanTitle", function(title) {
        if (!title) return "";
        // Remove numbers and special characters from the beginning
        return title.replace(/^[\d\s\-_]+/, '').trim();
    });

    return {
        dir: {
            input: "src",
            output: "docs",
            includes: "_includes",
            layouts: "_includes/layouts"
        }
    };
};