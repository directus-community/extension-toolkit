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
	.option('-t, --typescript', 'Use TypeScript')
	.description('Create a new Directus project')
	.action(create)
	.parse(process.argv);

async function create(type: string, name: string, options: { [key: string]: boolean }) {
	const rootPath = path.resolve(name);

	if (!EXTENSION_TYPES.includes(type)) {
		console.log(`Extension type "${chalk.red(type)}" does not exist.`);
		console.log('Please choose one of the following:');
		console.log(EXTENSION_TYPES.join(', '));
		process.exit(1);
	}

	if (await fse.pathExists(rootPath)) {
		const stat = await fse.stat(rootPath);

		if (stat.isDirectory() === false) {
			console.log(`Destination ${chalk.red(name)} already exists and is not a directory.`);
			process.exit(1);
		}

		const files = await fse.readdir(rootPath);

		if (files.length > 0) {
			console.log(`Destination ${chalk.red(name)} already exists and is not an empty directory.`);
			process.exit(1);
		}
	}

	const spinner = ora(`Setting up ${type} boilerplate`).start();

	const projectType = options.typescript ? 'typescript' : 'javascript';
	const templatePath = `${TEMPLATE_ROOT}/${type}/${projectType}`;

	await fse.ensureDir(rootPath);
	await fse.copy(templatePath, rootPath, { filter: fileFilter }, (e) => e && console.error(e));
	await fse.copy(
		`${TEMPLATE_ROOT}/common`,
		rootPath,
		{ filter: fileFilter },
		(e) => e && console.error(e),
	);

	const common = await fse.readJSON(`${TEMPLATE_ROOT}/common.${projectType}.json`);
	const templateLocation = `${templatePath}/package.json.template`;
	let template;
	if (await fse.pathExists(templateLocation)) {
		template = await fse.readJSON(templateLocation);
	} else {
		template = {};
	}

	const packageTemplate = await fse.readFile(`${TEMPLATE_ROOT}/package.json.mustache`, 'utf-8');
	const mustacheView = {
		name,
		type,
		dependencies: JSON.stringify({ ...common.dependencies, ...(template.dependencies || {}) }),
		scripts: JSON.stringify({ ...common.scripts, ...(template.scripts || {}) }),
	};
	const renderedPackage = mustache.render(packageTemplate, mustacheView);

	fse.writeJSON(`${rootPath}/package.json`, JSON.parse(renderedPackage), { spaces: 2 });

	await execa('npm', ['install'], { cwd: rootPath });

	spinner.stop();

	console.log(`Extension set up successfully! Start your development with "cd ${name}"`);
	process.exit(0);
}

function fileFilter(filename: string) {
	return !filename.endsWith('template');
}
