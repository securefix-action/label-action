# label-action

`label-action` is a GitHub Action that temporarily creates a label to trigger GitHub Actions workflows using the `labels:created` event.
It can be used to implement [our Client/Server Model](https://github.com/csm-actions/docs) in GitHub Actions, enhancing security.

## Features

- Enables implementation of [our Client/Server Model](https://github.com/csm-actions/docs)
- Requires only `issues:write` permission
- Easy to use

## Background

[About our Client/Server Model, please see the document](https://github.com/csm-actions/docs).
Since our Client/Server Model can be applied to many different use cases, it makes sense to create specialized actions for each.
However, label creation is a common step across all of them.
Rather than implementing it separately in each action, encapsulating it in a shared, standalone action improves maintainability.

That’s why we developed this action.

## Example Code

```yaml
- uses: actions/create-github-app-token@v2
  id: token
  with:
    app-id: ${{ vars.APP_ID }}
    private-key: ${{ secrets.PRIVATE_KEY }}
    permission-issues: write
    owner: ${{ github.repository_owner }}
    repositories: |
      server-repository
- uses: csm-actions/label-action@main
  with:
    prefix: update-branch-
    description: ${{github.repository}}/${{github.event.number}}
    repository: server-repository
    github_token: ${{steps.token.outputs.token}}
```

## Action's Inputs / Outputs

### Required Inputs

- `prefix`: The prefix for the label name. The actual label name will consist of this prefix plus a random string, resulting in a 50-character name. The random string helps avoid label name collisions.

### Optional Inputs

- `description`: The description of the label. Defaults to an empty string.
- `delete_label`: Whether to delete the label shortly after creation. Defaults to deleting it after 1 second.
- `repository`: The repository name where the label will be created. Please don't specify the repository owner. By default, the repository is the one where the workflow is running.
- `github_token`: The GitHub Access Token used to create the label. The default is a GitHub Actions token. The permission `issues:write` is required

### Outputs

- `label_name`: The name of the label that was created.
