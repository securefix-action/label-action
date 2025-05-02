import fs from "fs";
import os from "os";
import path from "path";
import { Buffer } from "buffer";
import { setTimeout } from "timers/promises";
import * as core from "@actions/core";
import * as github from "@actions/github";
import YAML from "yaml";
import * as lib from "./lib";

export const run = async (input: lib.Input) => {
  if (!input.repo) {
    throw new Error("server_repository is not set");
  }
  const artifactPrefix = "secure-action-label--";
  const artifact = `${artifactPrefix}${Array.from({ length: 29 }, () => Math.floor(Math.random() * 36).toString(36)).join("")}`;
  await triggerWorkflowByLabel(input, artifact);
};

export const triggerWorkflowByLabel = async (
  input: lib.Input,
  label: string,
) => {
  const octokit = github.getOctokit(input.githubToken);
  core.info(
    `creating a label ${label} to ${github.context.repo.owner}/${input.repo}`,
  );
  await octokit.rest.issues.createLabel({
    owner: github.context.repo.owner,
    repo: input.repo,
    name: label,
    description: `${input.repo}/${process.env.GITHUB_RUN_ID}`,
  });
  await setTimeout(1000);
  core.info(`deleting a label ${label}`);
  await octokit.rest.issues.deleteLabel({
    owner: github.context.repo.owner,
    repo: input.repo,
    name: label,
  });
};
