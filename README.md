# add-remove-label-action
Add and/or remove labels from a pull-request or issue in a single action. Multiple labels supported.

## Credit
Based on the action-ecosystem label removal repo: https://github.com/actions-ecosystem/action-remove-labels

## Example usage
You can use the action in your jobs like this:

```
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: PauMAVA/add-remove-label-action@v1.0.0
        with:
          add: label1, label2
          remove: label3, label4
        env:
          GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}'
```
Removals are processed first. Then additions are done.

## Inputs

| Input | Required? | Description |
| ----- | --------- | ----------- |
| add | Partial (add or remove required) | A comma separated list of the labels to add |
| remove | Partial (add or remove required) | A comma separated list of the labels to remove |
| repository | No | The repository where the Issue/PR is found |
| issue_number | No | The PR or Issue number to be modified |
| github_token | No | The Github token to be used |
| fail_on_error | No | If the action should fail on error [true, false] |

On default the issue `issue_number`, `repository` and `github_token` are infered from the context. If one of the parameters could't be infered the action will fail independent of the `fail_on_error` parameter.

## Outputs
Nothing.
