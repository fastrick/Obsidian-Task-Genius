import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import fs from "fs";
import path from "path";

import inlineWorkerPlugin from "esbuild-plugin-inline-worker";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

// Custom plugin to add CSS settings comment at the top of the CSS file
const cssSettingsPlugin = {
	name: "css-settings-plugin",
	setup(build) {
		build.onEnd(async (result) => {
			// Path to the output CSS file
			const cssOutfile = "styles.css";

			// The settings comment to prepend
			const settingsComment =
				fs.readFileSync("src/styles/index.css", "utf8").split("*/")[0] +
				"*/\n\n";

			if (fs.existsSync(cssOutfile)) {
				// Read the current content
				const cssContent = fs.readFileSync(cssOutfile, "utf8");

				// Check if the settings comment is already there
				if (!cssContent.includes("/* @settings")) {
					// Prepend the settings comment
					fs.writeFileSync(cssOutfile, settingsComment + cssContent);
				}
			}
		});
	},
};

const renamePlugin = {
	name: "rename-styles",
	setup(build) {
		build.onEnd(() => {
			const { outfile } = build.initialOptions;
			const outcss = outfile.replace(/\.js$/, ".css");
			const fixcss = outfile.replace(/main\.js$/, "styles.css");
			if (fs.existsSync(outcss)) {
				console.log("Renaming", outcss, "to", fixcss);
				fs.renameSync(outcss, fixcss);
			}
		});
	},
};

const prod = process.argv[2] === "production";

esbuild
	.build({
		banner: {
			js: banner,
		},
		minify: prod ? true : false,
		entryPoints: ["src/index.ts"],
		plugins: [
			inlineWorkerPlugin({ workerName: "Task Genius Indexer" }),

			renamePlugin,
			cssSettingsPlugin,
		],
		bundle: true,
		external: [
			"obsidian",
			"electron",
			"codemirror",
			"@codemirror/autocomplete",
			"@codemirror/closebrackets",
			"@codemirror/collab",
			"@codemirror/commands",
			"@codemirror/comment",
			"@codemirror/fold",
			"@codemirror/gutter",
			"@codemirror/highlight",
			"@codemirror/history",
			"@codemirror/language",
			"@codemirror/lint",
			"@codemirror/matchbrackets",
			"@codemirror/panel",
			"@codemirror/rangeset",
			"@codemirror/rectangular-selection",
			"@codemirror/search",
			"@codemirror/state",
			"@codemirror/stream-parser",
			"@codemirror/text",
			"@codemirror/tooltip",
			"@codemirror/view",
			"@lezer/common",
			"@lezer/lr",
			"@lezer/highlight",
			...builtins,
		],
		format: "cjs",
		watch: !prod,
		target: "es2018",
		logLevel: "info",
		sourcemap: prod ? false : "inline",
		treeShaking: true,
		outfile: "main.js",
		pure: prod ? ["console.log"] : [],
	})
	.catch(() => process.exit(1));
