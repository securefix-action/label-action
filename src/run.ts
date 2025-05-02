import fs from "fs";
import { Buffer } from "buffer";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as lib from "./lib";
import * as trigger from "./trigger";

export const main = async () => {
  run({
    githubToken: core.getInput("github_token"),
    repo: core.getInput("repository"),
  });
};

const run = async (input: lib.Input) => {
};
