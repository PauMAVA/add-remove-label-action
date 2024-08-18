#!/usr/bin/env node

const core = require("@actions/core");
const { context, getOctokit } = require("@actions/github");

async function run() {
  try {
    const githubToken = core.getInput('github_token');

    let addLabels = core.getInput('add');
    let removeLabels = core.getInput('remove');

    if (!addLabels && !removeLabels) {
      core.setFailed("At least the add or remove parameter must be set!");
      return;
    }

    if (addLabels) {
      addLabels = addLabels.split(',')
      .filter(l => l !== '')
      .map(l => l.trim());
    }

    if (removeLabels) {
      removeLabels = removeLabels.split(',')
      .filter(l => l !== '')
      .map(l => l.trim());
    }
      
    const [owner, repo] = core.getInput('repository').split('/');
    const issueNumber =
      core.getInput('issue_number') === ''
        ? context.issue.number
        : parseInt(core.getInput('issue_number'));

    if (addLabels.length === 0 && removeLabels.length === 0) {
      core.setFailed("At least the add or remove parameter must be set!");
      return;
    }

    if (!issueNumber) {
      core.setFailed("Cannot infer the target issue parameter!");
      return;
    }

    const client = getOctokit(githubToken);

    const remainingRemove = [];
    for (const label of removeLabels) {
      try {
        await client.issues.removeLabel({
          name: label,
          owner,
          repo,
          issue_number: issueNumber
        });
      } catch (e) {
        core.warning(`failed to remove label: ${label}: ${e}`);
        remainingRemove.push(label);
      }
    }


    const remainingAdd = [];
    for (const label of addLabels) {
      try {
        await client.issues.addLabel({
          name: label,
          owner,
          repo,
          issue_number: issueNumber
        });
      } catch (e) {
        core.warning(`failed to add label: ${label}: ${e}`);
        remainingAdd.push(label);
      }
    }

    if (remainingAdd.length) {
      throw new Error(`failed to add labels: ${remaining}`);
    }

    if (remainingRemove.length) {
      throw new Error(`failed to remove labels: ${remaining}`);
    }
  } catch (e) {
    core.error(e);

    if (core.getInput('fail_on_error') === 'true') {
      core.setFailed(e.message);
    }
  }
}

run();
