# Contributing to light-react-validator

First of all, thanks for taking interest into contributing to this repository, below is what you need to know about the project.

### Getting Started

Fork the repository, or clone it:

```bash
git clone https://github.com/thstamod/light-react-validator.git
```

Install dependencies using [npm](https://npmjs.com)

on root folder:
```bash
npm install
npm start
```

on example folder:
```bash
npm install
npm start
```

### Folder Structure

As you can see we have:

- `src` contains the working code for the repository:
  - `logic`: contains files with functions
  - `types`
  - `builtIn`: buildin validators.
- `dist`: contains the unminified and the minified build of the repository.
- `example`: contains an example which created with create-react-app.

### Issues

When creating issues, please provide as much details as possible. A clear explanation on the issue and a reliable production example can help us greatly in improving this project. Your issue may get closed if it cannot be easily reproduced so please provide a working example using either [Codesandbox](https://codesandbox.io/) or [jsfiddle](https://jsfiddle.net/). Your example should only focus on the issue, minimal and clearly produces the issue.

If your issue gets closed for not providing enough info or not responding to the maintainers' comments, do not consider it a hostile action. There are probably other issues that the maintainers are working on and must give priority to issues that are well investigated, you can always revisit the issue and address the reasons that it was closed and we will be happy to re-open it and address it properly. Sometimes a commit will close your issue without a response from the maintainers so make sure you read the issue timeline to prevent any misunderstandings.

### Code Style

Please follow the coding style of the project. light-react-validator uses `eslint` and `prettier`. If possible, enable their respective plugins in your editor to get real-time feedback. The linting can be run manually with the following command: `npm run lint`


### Testing

Each test file represents a unit test to the corresponding file in the src folder.

To run the tests:

```bash
npm run test:unit
```

To run the tests with watch option:

```bash
npm run test:watch
```

### Building

Use this command to build the project for production:

```bash
npm run build
```
