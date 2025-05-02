import fs from "fs";
import { Buffer } from "buffer";
import * as core from "@actions/core";
import * as github from "@actions/github";
import * as lib from "./lib";
import * as trigger from "./trigger";

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

const run = async (input: lib.Input) => {
};
