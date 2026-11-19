# MMK School
## Academic & School Structure Specification

**Version:** 1.0  
**Scope:** School Admin Web Portal and shared academic data model  
**Initial target:** Indian schools, Pre-KG to Class 10  
**Future scope:** Classes 11 and 12

---

## 1. Core Configuration Principles

MMK School will support configurable academic structures for every tenant (school).

The following decisions are finalized:

| Configuration | Product decision |
|---|---|
| Academic year structure | Custom per school |
| Class naming | Allow schools to define their own |
| Section naming | Custom names per school |
| Terms per academic year | Custom per school |
| Working days | Custom per school |
| Timetable periods | Configurable per school and shift |

### General rules

1. Each school manages its own academic configuration.
2. One school's configuration must never affect another school.
3. Academic structures must be versioned or associated with an academic year wherever appropriate.
4. Historical academic records must remain accessible.
5. Changes to an active academic structure must not silently modify historical records.
6. Configuration changes must respect dependencies across attendance, timetable, examinations, fees, admissions and student promotion.

---

## 2. School Academic Hierarchy

The primary academic hierarchy is:

**School → Academic Year → Terms → Grades/Classes → Sections → Student Enrollments**

Related academic entities include:

- Subjects
- Subject allocations
- Teacher allocations
- Working days
- School shifts
- Timetable periods
- Timetables
- Classrooms
- Examination schedules
- Academic calendar

A student has a permanent student profile and a separate enrollment for each academic year.

---

## 3. School Profile

Each school must have a configurable school profile.

Fields:

- School name
- School code
- School logo
- School address
- Contact information
- School email
- Website
- Affiliation/recognition details
- Education board
- Curriculum
- School type
- Timezone
- Default language
- Additional supported languages
- School status

The platform administrator creates the initial school profile. The School Admin manages routine school information according to permissions.

---

## 4. Academic Year Management

Each school can create its own academic years.

Examples:

- 2025–2026
- 2026–2027
- 2027–2028

The academic year must not have a hardcoded start or end month.

### Fields

- Academic year name
- Academic year code
- Start date
- End date
- Admission start date
- Admission end date
- Status
- Description
- Created by
- Created date

### Statuses

- Draft
- Upcoming
- Active
- Completed
- Archived

### Rules

1. A school can create multiple academic years.
2. Only one academic year should normally be designated as the primary active year for routine school operations.
3. The system must validate overlapping academic-year dates and require an explicit decision when overlaps are intentional.
4. Completed academic years must remain available for historical reporting.
5. The next academic year can be prepared before the current one ends.
6. Academic-year changes must not overwrite existing student enrollments, attendance or examination records.

---

## 5. Grade / Class Management

Class names must be configurable by each school.

Examples:

- Pre-KG
- LKG
- UKG
- Class 1
- Class 2
- Grade 1
- Grade 2
- Nursery
- Kindergarten

A school may use its own naming convention.

### Fields

- Class/grade name
- Class code
- Display order
- Academic level/category
- Description
- Active status

### Academic levels

Suggested categories:

- Pre-primary
- Primary
- Upper primary
- Secondary
- Higher secondary

These are classification labels, not compulsory grade names.

### Rules

1. Schools can create, edit and deactivate grade definitions.
2. Each grade has a unique code within its school.
3. Grades must have a defined display order.
4. Grade availability can be configured for an academic year.
5. A grade used by historical enrollments cannot be physically deleted.
6. Schools can add higher-secondary grades when the product supports that scope.

---

## 6. Section Management

Sections are subdivisions of grades/classes.

Examples:

- Class 5 → A, B, C
- Grade 6 → Red, Blue, Green
- Class 7 → Section 1, Section 2

### Fields

- Section name
- Section code
- Associated grade
- Academic year
- Student capacity
- Class teacher
- Classroom
- Status

### Rules

1. Section names are customizable per school.
2. Sections are associated with a grade and academic year.
3. Section names/codes must be unique within the relevant grade and academic year.
4. Each section can have its own class teacher.
5. Each section can have a student capacity.
6. Students are assigned through their academic-year enrollment.
7. Section changes must preserve previous enrollment history.
8. A section with historical records must be archived rather than deleted.

---

## 7. Terms / Semesters

Each school can configure its own number of terms or semesters.

Examples:

- Two terms
- Three terms
- Four terms
- Semester-based academic structure
- Custom examination periods

### Fields

- Term name
- Term code
- Academic year
- Start date
- End date
- Sequence/order
- Status
- Description

### Rules

1. Terms belong to an academic year.
2. Each academic year can have a different term structure.
3. Term dates must fall within the associated academic year unless an explicitly approved exception exists.
4. Terms must have a defined sequence.
5. Examination schedules can be associated with terms.
6. The system must support schools that do not use formal terms.

---

## 8. Working Days

Working days are configurable per school and can vary by academic year or school shift.

Examples:

- Monday to Friday
- Monday to Saturday
- Monday to Sunday
- Custom weekly schedule

### Fields

- Day of week
- Working/non-working status
- Applicable shift
- Effective date
- Academic year
- Description

### Rules

1. Schools define their weekly working days.
2. Different shifts can have different schedules.
3. Special working days and holidays must be managed through the school calendar.
4. Attendance and timetable generation must respect the configured working days.
5. Changes must have effective dates so historical attendance is not reinterpreted.

---

## 9. School Shifts

Schools can configure one or more shifts.

Examples:

- Morning Shift
- Afternoon Shift
- Evening Shift

### Fields

- Shift name
- Shift code
- Start time
- End time
- Applicable grades/sections
- Working-day configuration
- Status

### Rules

1. A school may operate one or multiple shifts.
2. Timetable configurations can differ between shifts.
3. A grade or section can be assigned to a shift.
4. Shift timings must be validated.
5. Shift changes must not silently alter historical timetable or attendance records.

---

## 10. Timetable Period Configuration

Timetable periods are configurable per school and shift.

A period represents a scheduled teaching slot.

### Fields

- Period name
- Period number/order
- Start time
- End time
- Period type
- Applicable shift
- Applicable working days
- Status

### Period types

- Regular class
- Short break
- Lunch break
- Assembly
- Activity period
- Library period
- Sports period
- Other configurable activity

### Rules

1. Different shifts can have different period structures.
2. Schools can configure different numbers of periods.
3. Period start and end times must be validated.
4. Periods must not overlap within the same applicable timetable schedule.
5. Breaks must be represented explicitly.
6. Timetable generation must use the applicable shift and period configuration.
7. Published timetable changes must create a new version or preserve the previous version.

---

## 11. Subject Management

Each school manages its own subject catalogue.

### Fields

- Subject name
- Subject code
- Description
- Subject category
- Maximum marks
- Passing marks
- Theory/practical classification
- Status

### Subject categories

- Language
- Mathematics
- Science
- Social Science
- Computer Studies
- Arts
- Physical Education
- Other

### Rules

1. Subjects can be assigned to selected grades.
2. Subjects can be compulsory or optional.
3. Subject assignments are academic-year-specific.
4. Teachers are allocated separately.
5. Assessment structures can vary by subject.

---

## 12. Teacher Allocation

Teachers can be assigned to multiple grades, sections and subjects.

### Allocation fields

- Teacher
- Academic year
- Grade
- Section
- Subject
- Shift
- Effective start date
- Effective end date
- Allocation status

### Rules

1. A teacher can have multiple allocations.
2. Allocation changes must preserve history.
3. Teacher timetable conflicts must be detected.
4. Substitute teachers must be supported.
5. Class teacher assignment must be managed separately from subject-teacher allocation.

---

## 13. Classroom and Infrastructure Management

Schools can configure physical facilities.

Examples:

- Classrooms
- Laboratories
- Computer labs
- Libraries
- Auditoriums
- Playgrounds
- Staff rooms

### Fields

- Room name
- Room code
- Room type
- Building
- Floor
- Capacity
- Availability
- Status

Classrooms can be assigned to sections and timetable periods.

Room conflicts must be checked when timetable schedules are created.

---

## 14. School Calendar

The school calendar manages important dates and events.

Examples:

- School reopening
- Holidays
- Festivals
- Parent-teacher meetings
- Sports day
- Annual day
- Examination dates
- Admission deadlines
- School functions

### Visibility

- Entire school
- Teachers
- Students
- Parents
- Selected grades
- Selected sections

Calendar events must support start/end dates, optional times, event categories and visibility permissions.

---

## 15. Student Enrollment and Academic Lifecycle

The permanent Student record must be separate from the academic-year-specific Student Enrollment record.

### Student profile

Contains permanent identity information:

- Student ID
- Admission number
- Name
- Date of birth
- Gender
- Contact information
- Parent/guardian relationships
- Documents
- Student status

### Student enrollment

Contains year-specific information:

- Student
- Academic year
- Grade
- Section
- Roll number
- Enrollment date
- Class teacher/section reference where applicable
- Enrollment status

### Lifecycle

1. Student application
2. Admission approval
3. Student profile creation
4. Academic-year enrollment
5. Grade and section assignment
6. Attendance, timetable, exams and fee operations
7. Promotion to the next academic year
8. Transfer, withdrawal or graduation

### Promotion rules

1. Promotion must create a new academic-year enrollment.
2. The previous enrollment must remain unchanged.
3. The next grade and section must be assigned explicitly.
4. Schools must be able to review promotion results before confirmation.
5. Students who repeat a grade must be supported.
6. Transferred and withdrawn students must retain historical records.

---

## 16. Configuration Dependency Rules

The following modules depend on the academic structure:

| Module | Required configuration |
|---|---|
| Admissions | Academic year, grades |
| Student Information System | Student profiles, enrollments, grades, sections |
| Attendance | Academic year, working days, shifts, sections |
| Timetable | Working days, shifts, periods, subjects, teachers, classrooms |
| Examinations | Academic year, terms, grades, sections, subjects |
| Learning/Classroom | Grades, sections, subjects, teachers |
| Digital Diary | Academic year, grades, sections, teachers, students |
| Fees | Academic year, student enrollment, fee structures |
| Reports | Academic year and relevant academic entities |
| Notifications | School, academic year, grades, sections and user groups |

---

## 17. School Admin Navigation

Recommended configuration navigation:

### School Setup
- School Profile
- Academic Years
- School Shifts
- Working Days
- School Calendar

### Academic Structure
- Grades / Classes
- Sections
- Terms / Semesters
- Subjects
- Subject Allocation
- Grading System

### Staff Configuration
- Departments
- Designations
- Teacher Allocation
- Class Teacher Assignment

### Timetable Configuration
- Periods
- Breaks
- Classrooms
- Timetable Management
- Timetable Versions

### Other Configuration
- Student Categories
- Houses and Groups
- Attendance Rules
- Leave Types
- Examination Types
- Transport Configuration
- Fee Configuration

---

## 18. Important Technical Requirements

1. Every tenant-owned academic record must include a school/tenant reference.
2. Academic-year-specific entities must reference the relevant academic year.
3. Student profiles and student enrollments must be separate.
4. Grade and section definitions must preserve historical references.
5. Published timetables must be versioned.
6. Configuration changes must be audited.
7. Deactivation and archival must be preferred over deletion when records are referenced.
8. All school operations must enforce tenant isolation and role permissions.
9. Time-based operations must use the school's configured timezone.
10. Academic configuration must be available to dependent modules through consistent APIs and database relationships.

---

## 19. Final Product Rule

MMK School must not assume that every Indian school follows the same academic calendar, grade naming, section naming, term structure, weekly schedule or timetable pattern.

The platform provides a consistent structure and workflow, while each school controls its own configuration.

The academic configuration is the foundation for all school operations. It must be established before the dependent modules are configured and used.
