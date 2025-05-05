import { setTimeout } from "timers/promises";
import * as core from "@actions/core";
import * as github from "@actions/github";

type Input = {
  prefix: string;
  description: string;
  deleteLabel: boolean;
  repositoryOwner: string;
  repositoryName: string;
  githubToken: string;
};

export const main = async () => {
  run({
    prefix: core.getInput("prefix", {
      required: true,
    }),
    description: core.getInput("description"),
    deleteLabel: core.getInput("delete_label") === "true",
    repositoryOwner: core.getInput("repository_owner"),
    repositoryName: core.getInput("repository_name"),
    githubToken: core.getInput("github_token"),
  });
};

export const run = async (input: Input) => {
  if (input.prefix.length > 30) {
    throw new Error("prefix must be less than 30 characters");
  }
  const label = `${input.prefix}${Array.from({ length: 50 - input.prefix.length }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`;
  core.setOutput("label_name", label);
  await triggerWorkflowByLabel(input, label);
};

export const triggerWorkflowByLabel = async (input: Input, label: string) => {
  const octokit = github.getOctokit(input.githubToken);
  core.info(
    `creating a label ${label} to ${input.repositoryOwner}/${input.repositoryName}`,
  );
  await octokit.rest.issues.createLabel({
    owner: input.repositoryOwner,
    repo: input.repositoryName,
    name: label,
    description: input.description,
  });
  if (input.deleteLabel) {
    await setTimeout(1000);
    core.info(`deleting a label ${label}`);
    await octokit.rest.issues.deleteLabel({
      owner: input.repositoryOwner,
      repo: input.repositoryName,
      name: label,
    });
  }
};
