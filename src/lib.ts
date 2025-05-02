import * as core from "@actions/core";
import * as github from "@actions/github";

export type Input = {
  prefix: string;
  description: string;
  deleteLabel: boolean;
  repository: string;
  githubToken: string;
};
