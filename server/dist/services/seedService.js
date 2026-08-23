"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSampleKnowledgeBase = seedSampleKnowledgeBase;
const documentProcessor_service_1 = require("./documentProcessor.service");
const inMemoryStore_1 = require("../storage/inMemoryStore");
const SAMPLE_DOCUMENTS = [
    {
        fileName: 'College Student Handbook 2026.pdf',
        datasetId: 'academic-policy',
        category: 'Academic Rules',
        text: `COLLEGE STUDENT HANDBOOK 2026
OFFICIAL ACADEMIC REGULATION MANUAL

CHAPTER 4: ATTENDANCE & EXAMINATION REGULATIONS

Section 4.1 - Mandatory Course Registration
All undergraduate and post-graduate students must register for their minimum required semester course load within the first two weeks of the semester. Late registration incurs a non-refundable administrative surcharge of $50.

Section 4.2 - Attendance & Examination Eligibility
Clause 4.2.1: Full eligibility for end-semester examinations mandates a minimum 75% aggregate physical/hybrid attendance across all lectures, lab tutorials, and practical seminars.
Clause 4.2.2: Condonation of Attendance Shortage: Students maintaining attendance between 65% and 74% due to documented medical emergencies or official university sports representation may submit a medical condonation application to the Dean of Academic Affairs within 7 days of semester conclusion.
Clause 4.2.3: Students falling below 65% aggregate attendance shall be awarded a 'W' (Withdrawn/Ineligible) grade and must re-register for the course in the subsequent academic term.

CHAPTER 5: CODE OF CONDUCT & INTEGRITY

Section 5.1 - Academic Integrity Code
Plagiarism, unapproved AI generation without explicit instructor disclosure, exam cheating, or falsification of experimental data will result in automatic zero credit for the assignment and immediate referral to the Disciplinary Committee.

Section 5.2 - Campus Housing Regulations
Quiet hours in all university residence halls begin at 10:00 PM on weekdays and 11:30 PM on weekends. Visitors must register at the reception desk and depart by 9:00 PM daily.`,
    },
    {
        fileName: 'Revised Academic Council Circular 2026.pdf',
        datasetId: 'academic-policy',
        category: 'Academic Rules',
        text: `REVISED ACADEMIC COUNCIL CIRCULAR 2026
CIRCULAR REF: ACAD-CIRC-2026-B

CHAPTER 4: REVISED ATTENDANCE REQUIREMENT AMENDMENT

Section 4.2 - Honours Program Attendance Rule
Clause 4.2.1-B: Effective for the 2026 Academic Session, students enrolled in Honours Degree Programs must maintain a minimum 80% aggregate physical attendance to be eligible for end-semester examinations. (This updates the standard 75% requirement for general degree programs).

Section 4.3 - Special Examination Fee
Clause 4.3.2: Re-examination registration for missed mid-term evaluations incurs a fee of $30 per course.`,
    },
    {
        fileName: 'Academic Evaluation & Grade Appeal Code.pdf',
        datasetId: 'academic-policy',
        category: 'Examination',
        text: `ACADEMIC EVALUATION & GRADE APPEAL CODE
DOCUMENT REF: ACAD-EVAL-2026-V2

SECTION 9: GRADING SCHEME & RE-EVALUATION

Section 9.1 - Letter Grade Scale
Grades are assigned on a 10.0 Grade Point Average (GPA) scale:
- A+ (10.0): Exceptional Performance (>= 90%)
- A (9.0): Outstanding Performance (80% - 89%)
- B (8.0): Very Good Performance (70% - 79%)
- C (7.0): Average Performance (60% - 69%)
- F (0.0): Fail (< 50%)

Section 9.2 - Formal Grade Re-Evaluation Policy
Clause 9.4.1: Official Grounds for Grade Re-Evaluation: Students may request a formal re-evaluation of final exam answer scripts within 10 calendar days of transcript issuance by submitting Form Academic-E4 and paying the evaluation processing fee of $25 per course.
Clause 9.4.2: Re-evaluation encompasses total re-summation verification and regrading of unassessed answers. If the revised grade score increases by more than 5%, the evaluation fee is fully refunded to the student account.

Section 9.3 - Course Withdrawal Policy
Students may withdraw from a enrolled elective course up to Week 6 of the 14-week semester without academic penalty. The course mark will appear as 'W' on the internal transcript and will not impact cumulative GPA calculation.`,
    },
    {
        fileName: 'Library & Learning Resource Policy 2026.pdf',
        datasetId: 'campus-facilities',
        category: 'Facilities',
        text: `LIBRARY & LEARNING RESOURCE CENTER GUIDELINES
KNOWSPHERE UNIVERSITY CENTRAL LIBRARY

SECTION 2: CIRCULATION & FINES

Section 2.1 - Borrowing Privileges
Undergraduate students may borrow up to 5 general circulation volumes for a duration of 14 calendar days. Graduate students and research fellows may borrow up to 10 volumes for 30 calendar days.

Section 2.2 - Renewal & Holds
Books may be renewed online up to 2 consecutive times provided no active hold reservation exists from another patron.

Section 2.3 - Overdue Fines & Penalties
Clause 2.3.4: Overdue textbook items trigger a daily assessment of $1.00 per item per day after the due date up to a maximum cap of $50. Reference volumes, high-demand reserve texts, and inter-library loan books incur a severe fine of $5.00 per day.
Clause 2.3.5: Borrowing privileges are suspended automatically if outstanding unpaid fines exceed $20.00. Lost library books incur a replacement fee equal to the current market cost of the book plus a $15 administrative processing charge.`,
    },
];
async function seedSampleKnowledgeBase() {
    try {
        const existingDocs = inMemoryStore_1.inMemoryStore.getDocuments();
        if (existingDocs.length > 0) {
            return; // Already populated
        }
        console.log('[SeedService] Seeding default knowledge base documents...');
        for (const sample of SAMPLE_DOCUMENTS) {
            await documentProcessor_service_1.DocumentProcessorService.processDocument({
                rawText: sample.text,
                fileName: sample.fileName,
                fileType: 'pdf',
                datasetId: sample.datasetId,
                category: sample.category,
            });
        }
        console.log(`[SeedService] Successfully seeded ${SAMPLE_DOCUMENTS.length} sample documents into Knowledge Base.`);
    }
    catch (err) {
        console.warn(`[SeedService Warning] Failed to seed default sample documents: ${err.message}`);
    }
}
