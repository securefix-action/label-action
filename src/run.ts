import fs from "fs";
import os from "os";
import path from "path";
import { Buffer } from "buffer";
import YAML from "yaml";
import { setTimeout } from "timers/promises";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as lib from "./lib";

export const main = async () => {
  run({
    prefix: core.getInput("prefix", {
      required: true,
    }),
    description: core.getInput("description"),
    deleteLabel: core.getInput("delete_label") === "true",
    repository: core.getInput("repository"),
    githubToken: core.getInput("github_token"),
  });
};

export const run = async (input: lib.Input) => {
  if (!input.repository) {
    input.repository = github.context.repo.repo;
  }
  if (input.prefix.length > 30) {
    throw new Error("prefix must be less than 30 characters");
  }
  const label = `${input.prefix}${Array.from({ length: 50 - input.prefix.length }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`;
  await triggerWorkflowByLabel(input, label);
};

export const triggerWorkflowByLabel = async (
  input: lib.Input,
  label: string,
) => {
  const octokit = github.getOctokit(input.githubToken);
  core.info(
    `creating a label ${label} to ${github.context.repo.owner}/${input.repository}`,
  );
  await octokit.rest.issues.createLabel({
    owner: github.context.repo.owner,
    repo: input.repository,
    name: label,
    description: input.description,
  });
  if (input.deleteLabel) {
    await setTimeout(1000);
    core.info(`deleting a label ${label}`);
    await octokit.rest.issues.deleteLabel({
      owner: github.context.repo.owner,
      repo: input.repository,
      name: label,
    });
  }
};
