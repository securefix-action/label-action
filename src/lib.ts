import * as core from "@actions/core";
import * as github from "@actions/github";

export type Input = {
  githubToken: string;
  repo: string;
};
