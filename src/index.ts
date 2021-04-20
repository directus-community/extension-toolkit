#!/usr/bin/env node

import commander from 'commander';
import path from 'path';
import chalk from 'chalk';
import fse from 'fs-extra';
import mustache from 'mustache';
import execa from 'execa';
import ora from 'ora';

import * as pkg from '../package.json';

const EXTENSION_TYPES = ['display', 'endpoint', 'hook', 'interface', 'layout', 'module'];

const TEMPLATE_ROOT = path.resolve(__dirname, '../../src/templates');

const program = new commander.Command(pkg.name);

program
	.version(pkg.version)
	.arguments('<type> <name>')
	.option('-j, --javascript', 'Use Javascript')
	.description('Create a new Directus project')
	.action(create)
	.parse(process.argv);

async function create(type: string, name: string, options: { [key: string]: boolean }) {
	const targetPath = path.resolve(name);

	if (!EXTENSION_TYPES.includes(type)) {
		console.log(`Extension type "${chalk.red(type)}" does not exist.`);
		console.log('Please choose one of the following:');
		console.log(EXTENSION_TYPES.join(', '));
		process.exit(1);
	}

	if (await fse.pathExists(targetPath)) {
		const stat = await fse.stat(targetPath);

		if (stat.isDirectory() === false) {
			console.log(`Destination ${chalk.red(name)} already exists and is not a directory.`);
			process.exit(1);
		}

		const files = await fse.readdir(targetPath);

		if (files.length > 0) {
			console.log(`Destination ${chalk.red(name)} already exists and is not an empty directory.`);
			process.exit(1);
		}
	}

	const projectLanguage = options.javascript ? 'javascript' : 'typescript';
	const templatePath = `${TEMPLATE_ROOT}/${projectLanguage}/${type}`;

	if (
		!(await fse.pathExists(`${templatePath}/index.js`)) &&
		!(await fse.pathExists(`${templatePath}/src/index.js`))
	) {
		console.log(`Bootstrapping ${chalk.red(type)}s in ${projectLanguage} is not yet supported.`);
		console.log('Follow the development of this toolkit here:');
		console.log('https://github.com/directus-community/extension-toolkit');
		process.exit(1);
	}
	const spinner = ora(`Setting up ${type} boilerplate`).start();
	await fse.ensureDir(targetPath);

	// Copy over files
	fse.copy(templatePath, targetPath, { filter: fileFilter }, (e) => e && console.error(e));
	fse.copy(
		`${TEMPLATE_ROOT}/common`,
		targetPath,
		{ filter: fileFilter },
		(e) => e && console.error(e),
	);
	fse.copy(
		`${TEMPLATE_ROOT}/${projectLanguage}/common`,
		targetPath,
		{ filter: fileFilter },
		(e) => e && console.error(e),
	);

	// Parse package.json from common, unique and template files
	const commonPackageJson = await fse.readJSON(
		`${TEMPLATE_ROOT}/${projectLanguage}/common/package.json.template`,
	);
	const uniquePackageJsonPath = `${templatePath}/package.json.template`;
	let templatePackageJson;
	if (await fse.pathExists(uniquePackageJsonPath)) {
		templatePackageJson = await fse.readJSON(uniquePackageJsonPath);
	} else {
		templatePackageJson = {};
	}

	const packageJsonTemplate = await fse.readFile(`${TEMPLATE_ROOT}/package.json.mustache`, 'utf-8');
	const mustacheView = {
		name,
		type,
		dependencies: JSON.stringify({
			...commonPackageJson.dependencies,
			...(templatePackageJson.dependencies || {}),
		}),
		devDependencies: JSON.stringify({
			...commonPackageJson.devDependencies,
			...(templatePackageJson.devDependencies || {}),
		}),
		scripts: JSON.stringify({
			...commonPackageJson.scripts,
			...(templatePackageJson.scripts || {}),
		}),
	};
	const renderedPackageJson = mustache.render(packageJsonTemplate, mustacheView);

	fse.writeJSON(`${targetPath}/package.json`, JSON.parse(renderedPackageJson), { spaces: 2 });

	await execa('npm', ['install'], { cwd: targetPath });

	spinner.stop();

	console.log(`Extension set up successfully! Start your development with "cd ${name}"`);
	process.exit(0);
}

function fileFilter(filename: string) {
	return !filename.endsWith('template');
}
