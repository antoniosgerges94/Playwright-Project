# 🚀 Playwright Automation Framework

A scalable End-to-End (E2E) test automation framework built with **Playwright** and **TypeScript**. The framework follows the **Page Object Model (POM)** design pattern and combines **UI** and **API** testing to create fast, maintainable, and reliable automated tests.

This project demonstrates modern QA automation practices, including reusable page objects, API integration, cookie-based authentication, dynamic test data generation, and a clean, scalable architecture.

---

## Features

* End-to-End UI Automation
* API Testing using Playwright APIRequestContext
* Page Object Model (POM)
* TypeScript
* Dynamic Test Data with Faker
* Cookie-Based Authentication
* Reusable Page Objects and API Classes
* Cross-Browser Testing
* Parallel Test Execution
* HTML Test Reports
* Clean and Scalable Architecture

---

## Tech Stack

* Playwright
* TypeScript
* Node.js
* Faker
* Playwright Test Runner

---

## Project Structure

```text
Playwright-Project
│
├── pages/
│   ├── RegisterPage.ts
│   ├── TodoPage.ts
│   └── NewTodoPage.ts
│
├── api/
│   ├── UserApi.ts
│   └── TodoApi.ts
│
├── models/
│   └── User.ts
│
├── tests/
│   ├── user.spec.ts
│   └── todo.spec.ts
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Framework Architecture

The framework is designed using the **Page Object Model (POM)** to separate test logic from page interactions and API operations.

The project is organized into dedicated layers:

* **Pages** – UI elements and user actions
* **API** – Backend requests and authentication
* **Models** – Test data and user objects
* **Tests** – End-to-End test scenarios

This architecture improves:

* Maintainability
* Readability
* Reusability
* Scalability

---

## Test Scenarios

### User Registration

* Register a new user through the UI
* Verify successful registration
* Validate the welcome message

### Todo Management

* Register a user through the API
* Authenticate using browser cookies
* Create a new Todo item
* Verify the Todo is displayed
* Delete the Todo item
* Verify the empty state

---

## Authentication

Authentication is performed through the application's API.

After a successful registration:

* The Access Token is captured.
* The User ID is stored.
* Authentication cookies are added to the browser context.

Using API authentication reduces execution time while allowing the UI tests to start from an authenticated state.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/antoniosgerges94/Playwright-Project.git
```

Navigate to the project directory:

```bash
cd Playwright-Project
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Running Tests

Run all tests:

```bash
npx playwright test
```

Run a specific test:

```bash
npx playwright test tests/user.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

Run tests on a specific browser:

```bash
npx playwright test --project=chromium
```

Open the HTML report:

```bash
npx playwright show-report
```

---

## Reports

Playwright automatically generates an HTML report after each execution.

To open the latest report:

```bash
npx playwright show-report
```

---

## Design Principles

* Page Object Model (POM)
* Separation of UI and API layers
* Single Responsibility Principle
* Reusable Components
* Clean Code Practices
* Maintainable Test Architecture

---

## Future Improvements

* GitHub Actions CI/CD
* Docker Support
* Environment Configuration (.env)
* Data-Driven Testing
* Allure Reporting
* Visual Regression Testing
* GitHub Pages Report Publishing

---

## Author

**Antonios Gerges Hakim Eskandar**

Senior QA Engineer

**GitHub**
https://github.com/antoniosgerges94

**LinkedIn**
https://www.linkedin.com/in/antonios-eskandar/

---


