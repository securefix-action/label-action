# label-action

`label-action` is a GitHub Action that temporarily creates a label to trigger GitHub Actions workflows using the `labels:created` event.
It can be used to implement a Client/Server Model in GitHub Actions, enhancing security.
This action is designed to be a reusable, standalone component for creating labels—common logic that can be shared across various Actions built with the Client/Server Model.

## Features

* Enables implementation of the Client/Server Model
* Requires only `issues:write` permission
* Easy to use

## Background

Operations such as generating commits in CI or auto-approving PRs from Renovate require powerful permissions.
To prevent abuse of such elevated permissions, it is important to adopt a secure architecture.
By restricting actual changes to a protected workflow (referred to as the **server workflow**), and having other workflows (the **clients**) merely request changes, we can enforce security through a **Client/Server Model**.
This model allows a client workflow to trigger the server workflow by creating a label.
Creating a label requires only the `issues:write` permission, which is weaker and less abusable compared to `contents:write` or `pull_requests:write`, thereby maintaining a higher level of security.

Since the Client/Server Model can be applied to many different use cases, it makes sense to create specialized actions for each.
However, label creation is a common step across all of them.
Rather than implementing it separately in each action, encapsulating it in a shared, standalone action improves maintainability.

That’s why this action was developed.

## Example Code

```yaml
uses: securefix-action/label-action
with:
  prefix: update-branch-
  description: ${{github.repository}}/${{github.event.number}}
  repo: server-repository
  github_app_id: ${{vars.APP_ID}}
  github_app_private_key: ${{secrets.APP_PRIVATE_KEY}}
```
