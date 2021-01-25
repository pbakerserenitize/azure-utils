@nhsllc/azure-utils / [Exports](modules.md)

# @nhsllc/azure-utils

Private utilitiy classes and methods for use with Microsoft Azure projects.

## Usage

Install via npm:

```shell
# If needed, generate a personal access token. Go to ['github.com'], login, click your profile > Settings > Developer Settings > Personal access tokens > Generate new token. Name the token and check the checkboxes for `repo` and `write:packages`.
# If not already logged in, make sure to log in using your github username and a personal token.
# Note the the registry URL is different from that used by the install command.
# Alternatively, a .npmrc file could be stored in the project root, or environment variables.
# Using powershell, run:
npm login --registry=https://npm.pkg.github.com/
# Use the personal access token as your password
# Using the organization registry URL allows pass-through of packages from npmjs.com.
npm install --registry=https://npm.pkg.github.com/nhsllc @nhsllc/azure-utils
```

In JavaScript:

```js
const { TableWriter } = require('@nhsllc/azure-utils')
```

In TypeScript:

```ts
import { TableWriter } from '@nhsllc/azure-utils'
```

## Documentation

Can be found at the root of the repository under [docs](./docs/README.md).
