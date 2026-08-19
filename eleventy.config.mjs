export default async function(eleventyConfig) {
	// copy folders to _site
  eleventyConfig.addPassthroughCopy({"public/css": "css"});
  eleventyConfig.addPassthroughCopy({"public/img": "img"});
  eleventyConfig.addPassthroughCopy({"public/js": "js"});
  // eleventyConfig.addPassthroughCopy({"api": "api"});

  // enable inserting HTML in markdown
  eleventyConfig.setNunjucksEnvironmentOptions({
		throwOnUndefined: true,
		autoescape: false, // warning: don’t do this! <- NEVER! <- No.
	});
};

export const config = {
	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data"
	},
	markdownTemplateEngine: 'njk',
  htmlTemplateEngine: "njk"
};
