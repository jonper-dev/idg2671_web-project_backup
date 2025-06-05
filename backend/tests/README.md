# Backend Testing Plan

This folder contains all tests related to the **backend** of our project.

## What We Need to Test

We must include **two test suites** in the backend:

---

### 1. Unit Tests

Folder: `/backend/tests/unit/`  
Author: 

**Goal**: Test individual functions (pure logic, services, or utils).

#### Example Functions to Test:
- Input validation functions
- Slug generator, string formatters
- Business logic 

#### Required Test Cases:
-  Positive cases (e.g., "John Doe", "john doe")
-  Boundary cases (e.g., max length allowed)
-  Edge cases (e.g., empty string, long input)
-  Negative cases (e.g., `null`, `undefined`, wrong types)
-  At least **one** unit test must include **mocking** (e.g., mocking a database call or a helper function)

---

### 2. API Integration Tests

 Folder: `/backend/tests/integration/`  
 Author: 

**Goal**: Test Express API endpoints and backend integration.

#### Example Endpoints to Test:
- `POST /quizzes/`
- `GET /quizzez`
- `PUT /users`
- `DELETE /quizzes/:id`

#### Required Test Cases:
-  Positive cases (correct data saves or fetches)
-  Boundary cases (e.g., max allowed characters in a field)
-  Edge cases (e.g., very old date, empty arrays)
-  Negative cases:
  - Missing fields
  - Unauthorized access
  - SQL/NoSQL injection
  - External service down (can be mocked)



---

##  Tools

Check blackboard slides 

## ▶ How to Run

Whoever has the responsibility can write it here


## Notes

- Each test should include clear describe() and it() messages.
- Don’t test unused code — focus only on what’s actually used in the app.
- Link each test file in the final report.
