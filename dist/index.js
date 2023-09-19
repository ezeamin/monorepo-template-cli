#!/usr/bin/env node
import { Command } from 'commander';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
// Hardcoded repository URL
const repositoryUrl = 'https://gitlab.justucuman.gov.ar/desarrollo/fe-template-next';
const program = new Command();
program
    .version('1.0.0')
    .description('Create a folder and clone the app-template repository there');
program
    .command('create <folder>')
    .description('Create a folder and clone the app-template repository there')
    .action(async (folder) => {
    const folderPath = path.join(process.cwd(), folder);
    // Check if the folder already exists
    if (fs.existsSync(folderPath)) {
        console.error('Folder already exists!');
        process.exit(1);
    }
    // Create the folder
    fs.mkdirSync(folderPath);
    // Clone the Git repository without history into the folder
    try {
        await execa('git', ['clone', '--depth', '1', repositoryUrl, folder], {
            cwd: process.cwd(),
            stdio: 'inherit',
        });
        // Delete the .git folder
        fs.rmSync(path.join(folderPath, '.git'), { recursive: true });
        // Run npm install inside the folder
        await execa('pnpm', ['install'], {
            cwd: folderPath,
            stdio: 'inherit',
        });
        console.log(chalk.green(`\nApp ${folder} started successfully! 😃\n`));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error cloning repository:', error.message);
        }
        else {
            console.error('Error cloning repository:', error);
        }
        process.exit(1);
    }
});
program.parse(process.argv);
