# NetBox Automated Tests

This repository contains automated Playwright tests written in TypeScript to validate key functionalities in the NetBox demo application (https://demo.netbox.dev/). The test suite covers the following tasks:

- **Task 1: User Login** (`login.spec.ts`)
- **Task 2: Create Device Type** (`device-type.spec.ts`)
- **Task 3: Add Device to Rack** (`rack-add-device.spec.ts`)
- **Task 4: Delete Device and Device Type** (`delete-device-and-type.spec.ts`)

## Prerequisites

- Node.js (v14+)
- npm or yarn
- Playwright

## Configuration

- The tests use the demo credentials (`demo` / `demo`) by default. Update the credentials in the test fixtures if needed.
- Base URL is set to `https://demo.netbox.dev/`. Modify it in `playwright.config.ts` if you run against a different environment.

## Test Structure

- `tests/login.spec.ts`:
  - Validates successful and failed login scenarios.
- `tests/device-type.spec.ts`:
  - Covers creating a new device type with both positive and negative scenarios.
- `tests/rack-add-device.spec.ts`:
  - Automates adding devices to rack slots in both front and rear views, including error handling for occupied slots.
- `tests/delete-device-and-type.spec.ts`:
  - Tests deletion of a device and its associated device type, plus negative case for dependency enforcement.

## Assertions and Selectors

- Tests use Playwright's `expect` API for validating URLs, element visibility, and text content.
- Selectors are based on element attributes (`name`, `aria-label`, `data-u-height`, etc.) and text content.

## Extending the Suite

- Add more scenarios (e.g., edit device type, bulk operations, password reset).
- Refactor common flows into custom fixtures or helper functions.
- Integrate with CI/CD pipelines (GitHub Actions, Jenkins, etc.).

## License

This project is licensed under the MIT License.

