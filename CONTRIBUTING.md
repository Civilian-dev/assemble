Contributions are welcome. Please look at current issues first and comment or create a new issue
when required. We ask that you follow the code of conduct in all communication.

## Development

If you're new to open source, please see this guide on
[How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)

To develop and make contributions to this project...

1. First fork and clone the repo
2. Make a branch for your fix or feature
3. Make changes and create or update tests
4. Run `yarn test` and `yarn lint`
5. Commit changes to your branch
6. Submit a PR referencing the issue

If you need more detail, read [this great reference](https://medium.com/@jenweber/your-first-open-source-contribution-a-step-by-step-technical-guide-d3aca55cc5a6) by
[Jen Weber](http://jenweber.github.io/portfolio/).

## Testing

### dts-jest

Utility types are tested with snapshots using [dts-jest](https://github.com/ikatyang/dts-jest).
- `yarn test:watch` while developing or `yarn test:update` when finished to update snapshots
- `yarn test` will check that tests match the snapshots and fails if snapshots haven't been updated

Snap files are generated alongside test files to make definitions and diffs more readable. Unfortunately [manually checking these snaps](https://github.com/ikatyang/dts-jest/issues/290#issuecomment-814583606) is the best way to ensure expected behaviour from custom types. e.g:

`test/dts-jest/util/Only.test.ts` is where test is written
```ts
// @dts-jest:snap
testType<Only<{ a: any, b: any, c: any }, 'a' | 'b'>>()
```

`test/dts-jest/util/Only.test.snap.ts` is generated from the snapshot

```ts
// @dts-jest:snap -> Only<ABC, "a" | "b">
testType<Only<{ a: any, b: any, c: any }, 'a' | 'b'>>()
```

☝️ see appended type output `-> Only<ABC, "a" | "b">` 

### dts-lint

There's also a partial setup to test type definitions with [`dtslint`](https://github.com/microsoft/dtslint). Run with `yarn test:types`. This is experimental but open for enhancements.

## Publishing

Approved contributors can accept PRs or make changes to publish a release. All it takes is a commit
including an incremented package version to trigger a GitHub action to publish to NPM.

Please follow [semantic versioning](https://semver.org/) for the type of changes being published.

Before merging a new version, you can test the bundle with a consuming project to ensure any change
to package config doesn't break builds (which can happen even if tests pass).

From this package root:
1. `yarn link` to register the local dependency
2. `yarn build` to compile the package files (or `yarn dev` to watch changes)

In your consuming project:
1. `yarn link @os-gurus/pipe-type` to link the local dependency
2. Run project or tests, assuming a broken build would throw it
3. Ensure exported types available in the project IDE
4. `yarn unlink @os-gurus/pipe-type` resume consuming the published package
