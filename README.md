# label-action

`label-action` is a GitHub Action that temporarily creates a label to trigger GitHub Actions workflows using the `labels:created` event.
It can be used to implement a Client/Server Model in GitHub Actions, enhancing security.

## Features

- Enables implementation of the Client/Server Model
- Requires only `issues:write` permission
- Easy to use

## Background

Operations such as generating commits in CI or auto-approving PRs from Renovate require powerful permissions.
To prevent abuse of such elevated permissions, it is important to adopt a secure architecture.
By restricting actual changes to a protected workflow (referred to as the **server workflow**), and having other workflows (the **clients**) merely request changes, we can enforce security through a **Client/Server Model**.
By triggering the server workflow via `label:created` event, you can achieve this model.
Creating a label requires only the `issues:write` permission, which is weaker and less abusable compared to `contents:write` or `pull_requests:write`, thereby maintaining a higher level of security.

Since the Client/Server Model can be applied to many different use cases, it makes sense to create specialized actions for each.
However, label creation is a common step across all of them.
Rather than implementing it separately in each action, encapsulating it in a shared, standalone action improves maintainability.

That’s why this action was developed.

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
- uses: securefix-action/label-action@main
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
