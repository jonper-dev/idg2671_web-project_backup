#  Frontend Testing Plan

This folder contains all tests related to the **frontend** of our project.

##  What We Need to Test

We must include **two test suites** in the frontend:

---

### 1. Component Integration Tests

 Folder: `/frontend/tests/components/`  
 Author:

**Goal**: Test React components and how they interact (UI + logic).

#### Example Components to Test:
- CreateStudy
- Dashboard
etc 

#### Required Test Cases:
-  Positive cases (expected props and user actions)
-  Boundary cases (e.g., input exactly at character limit)
-  Edge cases (e.g., empty lists, long strings)
-  Negative cases:
  - Missing or invalid props
  - Failed fetch (can be mocked)
  - User interaction errors


---

### 2. End-to-End (E2E) Tests

 Folder: `/frontend/tests/e2e/`  
 Author: 

**Goal**: Simulate full user flows, from start to finish.

#### Example Flows to Test:
- User signs up, logs in, creates a post
- User updates profile and sees confirmation
- User adds comment, deletes it

#### Required Test Cases:
-  2–4 full user flows
- Focus on realistic use, not edge inputs
- Optional: E2E error case (e.g., invalid login)


---

##  Tools

- Jest (unit/component)
- React Testing Library (for components)
- Cypress or Playwright (E2E)
- Mocking: Use `jest.mock()` or mock service worker for failed fetches

## ▶ How to Run

Whoever has the responsibility can write it here


## Notes

- One suite should use mocking, especially for failed fetch or API delay.
- Each test must have clear and meaningful test case names.
- Only test real, active parts of the app.
