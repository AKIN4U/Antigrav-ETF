# ADR 001: Package Manager Migration to PNPM

**Date**: 2025-01-13

**Status**: Accepted

## Context and Problem Statement

The project was previously using npm and its `package-lock.json` for dependency management. While functional, npm can lead to slower installation times and large `node_modules` directories, especially as the project scales. We needed a more performant, disk-efficient, and strict package manager to ensure consistency and speed up our CI/CD pipelines and local development setup.

## Decision Drivers

1.  **Performance**: `pnpm` is significantly faster than npm and yarn due to its content-addressable storage and symlinking strategy.
2.  **Disk Space Efficiency**: Dependencies are stored in a global, on-disk store and linked into projects. This means we don't duplicate packages across different projects on the same machine.
3.  **Strictness**: `pnpm` creates a non-flat `node_modules` directory, preventing packages from accessing dependencies they don't explicitly declare in `package.json`. This avoids phantom dependency issues.

## Considered Options

-   **npm**: The default, but slower and less efficient.
-   **Yarn**: A solid alternative, but pnpm's performance and efficiency advantages are more pronounced.
-   **pnpm**: Chosen for its superior speed, disk efficiency, and strict dependency resolution.

## Decision Outcome

We have officially migrated the project to use `pnpm` as the sole package manager.

### Consequences

-   **Positive**:
    -   Faster dependency installation for both local development and CI/CD environments.
    -   Reduced disk space usage.
    -   Improved reliability by eliminating phantom dependency risks.
-   **Negative**:
    -   All developers must now have `pnpm` installed and use `pnpm` commands (e.g., `pnpm add`, `pnpm install`, `pnpm dev`). The old `npm` commands will not work correctly with the `pnpm-lock.yaml` file.

## Implementation Steps

1.  The `package-lock.json` file was removed from the project.
2.  The `node_modules` directory was deleted to ensure a clean slate.
3.  `pnpm install` was run to generate a `pnpm-lock.yaml` file and install dependencies.
4.  All team members have been notified of the change and instructed to use `pnpm`.