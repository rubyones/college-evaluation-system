# Student Enrollment Enhancement Plan

## Objective
Enable students to self-manage their enrollment by selecting their Year Level and Section. This is particularly useful for irregular students to place themselves correctly, though a fully flexible subject selection might be needed for advanced irregular cases.

## Current State
- Students are created with a `course` (Program) but lack `year_level` and `section` in the `users` table.
- Enrollment is currently manual or assumed to be handled by admin (which is not scalable/flexible enough).
- `course_enrollments` table links students to courses.
- `courses` table has `course_program`, `year_level`, and `section` fields.

## Proposed Changes

### 1. Database Schema
- **Modify `users` table**:
  - Add `year_level` INT DEFAULT NULL
  - Add `section` VARCHAR(10) DEFAULT NULL
  - *Note*: This allows persisting the student's current academic standing.

### 2. Backend Logic (`/api/users/profile` & `/api/enrollments`)
- **Update Profile API**:
  - Allow `PATCH` to update `year_level` and `section`.
- **Auto-Enrollment Logic**:
  - When a student updates their Year/Section:
    1. Identify the **Active Academic Period**.
    2. Fetch all `courses` that match:
       - `course_program` == User's Program (e.g., BSIT)
       - `year_level` == Selected Year
       - `section` == Selected Section
       - `academic_period` == Active Period
    3. **Upsert Enrollments**:
       - Register the student for these courses in `course_enrollments`.
       - *Consideration*: Should we remove old enrollments if they change sections?
         - *Approach*: Yes, for the current period, clear previous block enrollments and apply new ones to avoid duplicates/conflicts.
         - *Irregular Handling*: If they select "Irregular", maybe we don't auto-enroll? Or we provide a UI to pick subjects manually?
         - *Refinement*: For this iteration, we focus on **Block Enrollment**. If a student selects "Irregular", they might need a separate "Add Subject" interface (out of scope for this immediate plan, but noted).

### 3. Frontend Implementation (`app/student/profile/page.tsx`)
- **UI Additions**:
  - Add "Academic Information" card (editable).
  - **Dropdowns**:
    - **Year Level**: 1st, 2nd, 3rd, 4th
    - **Section**: A, B, C, D... (Maybe fetch active sections from DB? or hardcode common ones)
  - **Action**: "Save & Update Enrollment"
    - Saves profile data.
    - Triggers the enrollment logic.
    - Shows success message: "You have been enrolled in [N] subjects."

## Integration Steps
1.  **Schema Update**: Run migration to add columns.
2.  **API Dev**: Implement the enrollment service/function.
3.  **UI Dev**: Build the Profile controls.
4.  **Testing**: Verify a student can switch sections and see their "My Courses" list update (if that page exists) or see their Evaluations populate correctly.

## Risks & Mitigations
- **Data Loss**: Changing sections might wipe grades?
  - *Mitigation*: `course_enrollments` are just links. Grades (evaluations) are linked to `course_id`. If they unenroll, they might lose access, but the evaluation record exists. We should warn them.
- **Irregular Complexity**: Irregulars might take Math (Year 1) and Programming (Year 2).
  - *Mitigation*: Allow them to select a "Primary" block, then potentially add individual subjects later. This feature handles the "Primary" block assignment.
