// Frozen default plan from the clarity release. Used only to recognise untouched saved drafts.
import type { WorkItem } from './work-model.ts';

const offerSource = {
  label: 'Money models and offer stacks',
  url: 'https://github.com/Pmen225/Junior-Built-skills/blob/main/skills/alex-hormozi-full-course/chapters/ch07-money-models-and-offer-stacks.md',
  chapter: 'Chapter 7',
};

const recurringSource = {
  label: 'Continuity offers',
  url: 'https://github.com/Pmen225/Junior-Built-skills/blob/main/skills/alex-hormozi-full-course/chapters/ch26-continuity-offers.md',
  chapter: 'Chapter 26',
};

const leadsSource = {
  label: 'Leads and content',
  url: 'https://github.com/Pmen225/hormozi-youtube-channel-skill/blob/main/chapters/ch02-leads-and-content.md',
  chapter: 'Chapter 2',
};

const salesSource = {
  label: 'Sales and handover',
  url: 'https://github.com/Pmen225/hormozi-youtube-channel-skill/blob/main/chapters/ch03-sales-and-handover.md',
  chapter: 'Chapter 3',
};

const teamSource = {
  label: 'Constraints and team',
  url: 'https://github.com/Pmen225/hormozi-youtube-channel-skill/blob/main/chapters/ch06-constraints-and-team.md',
  chapter: 'Chapter 6',
};

const coreFourSource = {
  label: 'Core Four — source video',
  url: 'https://www.youtube.com/watch?v=VBoRLJimVzc&t=1686s',
  chapter: '28:06',
};

const closerSource = {
  label: 'CLOSER — source video',
  url: 'https://www.youtube.com/watch?v=oi7bnS8uyJM&t=169s',
  chapter: '02:49',
};

const managementSource = {
  label: 'Management Diamond — source video',
  url: 'https://www.youtube.com/watch?v=s6tkRztZwYc&t=26s',
  chapter: '00:26',
};

const handoverSource = {
  label: 'Document, demonstrate, duplicate — source video',
  url: 'https://www.youtube.com/watch?v=Nh8Oc7ERdIU&t=2425s',
  chapter: '40:25',
};

type SeedInput = Pick<
  WorkItem,
  'id' | 'title' | 'kind' | 'business' | 'why' | 'acceptance' | 'priority'
> & {
  parentId?: string;
  dependsOn?: string[];
  steps: string[];
  sources?: WorkItem['sources'];
};

function proposal(input: SeedInput): WorkItem {
  return {
    ...input,
    dependsOn: input.dependsOn ?? [],
    steps: input.steps.map((text, index) => ({
      id: `${input.id}-step-${index + 1}`,
      text,
      done: false,
    })),
    sources: input.sources ?? [],
    status: 'not-started',
    owner: 'Unassigned',
    evidence: [],
    origin: 'proposal',
    approved: false,
  };
}

export const seedV2Items: WorkItem[] = [
  proposal({
    id: 'odide',
    title: '10 paying clients, monthly revenue, a working team',
    kind: 'goal',
    business: 'group',
    why: 'Your goal is 10 paying ITAD clients, regular monthly revenue and a team that can do the work. ITAD is the first priority. These are targets, not results already achieved.',
    steps: [
      'Confirm the start date for the 12-month plan, the monthly revenue target and the currency.',
      'Review the suggested tasks. Keep only the work ODIDE needs.',
      'Check client payments, completed jobs and a test of the team before reporting success.',
    ],
    acceptance: 'Junior accepts payment records for 10 different ITAD clients, monthly revenue at the agreed target, and a passed team handover test within the agreed 12-month period. The report separates ongoing contracts from repeat one-off jobs.',
    priority: 1,
  }),
  proposal({
    id: 'delivery',
    title: 'Test how ODIDE will handle old IT equipment',
    kind: 'milestone',
    business: 'itad',
    parentId: 'odide',
    why: 'ITAD covers old business IT equipment: collection, data handling, reuse or recycling. Check what ODIDE can provide before promising it to a customer.',
    steps: [
      'Find any existing website, service documents, tools and collection arrangements.',
      'Write the steps for a job and name what still needs checking.',
      'Test those steps on an approved sample job and record what worked.',
    ],
    acceptance: 'Junior has a tested job checklist, sample customer report and list of problems fixed. Legal and data-handling questions name the qualified person who must check them.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-review',
    title: 'Check existing documents and write the job steps',
    kind: 'project',
    business: 'itad',
    parentId: 'delivery',
    why: 'Use work that already exists. Then write how a customer request becomes a completed ITAD job.',
    steps: [
      'List links to any available ODIDE website, service documents, tools and collection arrangements.',
      'For each item, write keep, change, missing or needs checking.',
      'Write the job steps, the person or role for each step, and the record they must keep.',
    ],
    acceptance: 'Two drafts are ready: a list of existing links with keep-or-change decisions, and a job checklist showing who does each step. Missing information is clearly marked.',
    priority: 1,
  }),
  proposal({
    id: 'assets-review',
    title: 'Find ODIDE’s website, documents and tools',
    kind: 'task',
    business: 'itad',
    parentId: 'delivery-review',
    why: 'Avoid making a new website or document if ODIDE already has one. Look for service descriptions, price sheets, job instructions and tools; do not assume they exist.',
    steps: [
      'Look in the shared ODIDE sources for the website, service documents and tools. Mark anything not found as missing.',
      'For each item found, record its link, what it is used for and what needs checking.',
      'Make a keep, change or missing list. Give a reason for each proposed change.',
    ],
    acceptance: 'A short list gives each link, its use, a keep-or-change decision and the next check. Missing means not found; it does not give permission to rebuild anything.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-process',
    title: 'Write the steps from collection to customer report',
    kind: 'task',
    business: 'itad',
    parentId: 'delivery-review',
    dependsOn: ['assets-review'],
    why: 'A customer needs to know what happens to their equipment. The team needs one checklist for the job and the records that prove each step.',
    steps: [
      'Write the steps for enquiry, quote, collection, equipment receipt, processing and customer reporting.',
      'For each step, name the role that does it and the record they must keep.',
      'List legal, security and data-handling questions for a qualified person to check.',
      'Mark the missing arrangements that must be fixed before taking a customer job.',
    ],
    acceptance: 'One draft checklist states each job step, who does it, what record they keep and what to do if it fails. Open legal and security checks remain marked as unapproved.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-proof',
    title: 'Test the job checklist and customer report',
    kind: 'project',
    business: 'itad',
    parentId: 'delivery',
    why: 'A practice job shows missing steps before a customer relies on the service.',
    steps: [
      'Agree a safe practice job that does not use a live customer job.',
      'Follow the checklist and make sample job records and a customer report.',
      'List problems, fix the instructions and record the result of the next test.',
    ],
    acceptance: 'A test report links the checklist, sample records, problems found and the result after fixes. Junior can check the whole practice job in one place.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-check',
    title: 'Run an approved practice ITAD job',
    kind: 'task',
    business: 'itad',
    parentId: 'delivery-proof',
    dependsOn: ['delivery-process'],
    why: 'Check that the job instructions produce a complete record and a customer report that matches it. This is a practice job, not a live customer collection.',
    steps: [
      'Write the sample job, test limits and safety checks. Get approval before running it.',
      'Follow the checklist and record each practice step and any problem.',
      'Check the sample customer report against the job records.',
      'List the fixes and record whether the repeat test passes.',
    ],
    acceptance: 'The approved practice job has a completed checklist, a matching sample customer report and a reviewed list of problems and fixes. A real customer job is not claimed.',
    priority: 1,
  }),
  proposal({
    id: 'clients',
    title: 'Get 10 ITAD customers who have paid',
    kind: 'milestone',
    business: 'itad',
    parentId: 'odide',
    why: 'The goal is customers who pay for the service. A contact list, reply or quote does not count as a paying client.',
    steps: [
      'Agree what ODIDE will sell, what it costs to provide and the selling price.',
      'Prepare a small sales test. Get separate approval before contacting anyone.',
      'Count a business as a client only when its payment record has been checked.',
    ],
    acceptance: 'Checked payment records show 10 different ITAD business clients under the agreed counting rule. Contacts, quotes and unpaid invoices are excluded.',
    sources: [offerSource, leadsSource, salesSource, coreFourSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'offer-project',
    title: 'Decide what ODIDE will sell and charge',
    kind: 'project',
    business: 'itad',
    parentId: 'clients',
    why: 'Before looking for customers, make clear who the service is for, what they get and whether the price covers the work.',
    steps: [
      'Read any existing service description or price sheet before drafting a replacement.',
      'Write who the customer is, what is included and how they would buy.',
      'Check the job costs and the price Junior must approve.',
    ],
    acceptance: 'Junior has a one-page service description and a cost sheet to review. Missing prices and unproven service promises are marked, not guessed.',
    sources: [offerSource],
    priority: 1,
  }),
  proposal({
    id: 'offer',
    title: 'Write what an ITAD customer will pay for',
    kind: 'task',
    business: 'itad',
    parentId: 'offer-project',
    why: 'An offer means the service a customer buys: who it helps, what is included and the result they get. Write a draft for review; do not send it to a customer.',
    steps: [
      'Read any available ODIDE service description. Keep useful details and mark missing information.',
      'Propose one type of business customer and the problem ODIDE will solve for it.',
      'Draft what the customer gets, what is not included, what they must supply and how they order.',
      'List each service promise and what must be checked before ODIDE can make it.',
    ],
    acceptance: 'One page states who buys, the problem solved, what is included, what is excluded and how to order. Each promise has support or a clear needs-checking label.',
    sources: [offerSource],
    priority: 1,
  }),
  proposal({
    id: 'offer-economics',
    title: 'Calculate what one ITAD job costs and earns',
    kind: 'task',
    business: 'itad',
    parentId: 'offer-project',
    dependsOn: ['offer', 'delivery-process'],
    why: 'A selling price is useful only if it covers the job costs. Check when ODIDE must pay suppliers and when the customer will pay ODIDE.',
    steps: [
      'List collection, processing, reporting and extra-work costs for the draft service.',
      'Add checked supplier quotes or other cost records. Leave unknown amounts marked as unknown.',
      'Subtract direct job costs from the proposed price. Show when each payment is due.',
      'Give Junior the proposed price, minimum acceptable price and customer payment dates to approve.',
    ],
    acceptance: 'A cost sheet shows the proposed price, direct costs, money left after those costs and payment dates. Each cost has a source or an unknown label. Junior can see the price decision required.',
    sources: [offerSource],
    priority: 1,
  }),
  proposal({
    id: 'sales-project',
    title: 'Prepare a small test to find paying customers',
    kind: 'project',
    business: 'itad',
    parentId: 'clients',
    why: 'Test one way of finding customers so the result is easy to check. Prepare the plan and messages before asking permission to send them.',
    steps: [
      'Write which businesses fit the service and how to contact them in the proposed test.',
      'Draft the message, questions for a sales call and details to pass to the job team.',
      'Write how to check replies, quotes and customer payments before deciding whether to continue.',
    ],
    acceptance: 'One test plan names the businesses to target, contact method, limits, exact messages and results to record. It includes job handover details and requires approval before contact.',
    sources: [leadsSource, salesSource, coreFourSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'target-list',
    title: 'Make a list template for suitable business customers',
    kind: 'task',
    business: 'itad',
    parentId: 'sales-project',
    dependsOn: ['offer'],
    why: 'A target account means a business that fits the service. Make clear what qualifies before collecting names or contact details.',
    steps: [
      'Use the agreed service description to write which businesses qualify and which do not.',
      'List permitted research sources and the details needed for each business.',
      'Create a blank customer-list table with business name, source link and reason it fits.',
    ],
    acceptance: 'A blank business-customer table and short qualification rules are ready to review. This draft does not contain researched businesses or personal contact details.',
    sources: [leadsSource, coreFourSource],
    priority: 1,
  }),
  proposal({
    id: 'sales-test',
    title: 'Draft the customer message and sales test',
    kind: 'task',
    business: 'itad',
    parentId: 'sales-project',
    dependsOn: ['offer-economics', 'target-list', 'delivery-check'],
    why: 'Junior must be able to see exactly what would be sent, to whom and how often. This task prepares that plan; it does not contact anyone.',
    steps: [
      'Propose one contact method and ask Junior to approve the number of contacts and test dates.',
      'Write the message, sales-call questions, follow-up message and when to stop contacting a business.',
      'Make a table for messages sent, replies, suitable sales calls, quotes and payments.',
      'List what the job team needs after a sale. Submit the full plan for approval.',
    ],
    acceptance: 'Junior has the exact messages, target rules, contact limits, result tracker and job handover list. Nothing is sent and no agent is started by this task draft.',
    sources: [leadsSource, salesSource, coreFourSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'paid-client-proof',
    title: 'Make a tracker for customers who have paid',
    kind: 'task',
    business: 'itad',
    parentId: 'sales-project',
    dependsOn: ['sales-test'],
    why: 'Count paying clients accurately. Do not count one business twice or count a quote as a payment.',
    steps: [
      'Agree which business details identify one client, even when it places more than one order.',
      'Write which checked payment record and job reference are needed to count that client.',
      'Create a blank tracker with columns for the business, payment, job, duplicate check and refund check.',
    ],
    acceptance: 'A blank tracker and short counting rules are ready to approve. Every counted client must have a checked payment link. No client total is claimed in this draft.',
    sources: [salesSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'recurring',
    title: 'Bring in ITAD revenue each month',
    kind: 'milestone',
    business: 'itad',
    parentId: 'odide',
    why: 'Regular sales can come from repeat jobs or an ongoing paid service. Compare both; a subscription is not required.',
    steps: [
      'Confirm the monthly target, currency and whether the report counts invoices or payments.',
      'Compare repeat collection jobs with an ongoing paid service that customers actually need.',
      'Check the monthly report against the agreed records before reporting revenue.',
    ],
    acceptance: 'Checked records show regular monthly revenue at the agreed target and on the agreed reporting basis. Ongoing contracts, repeat one-off jobs, invoices and payments are shown separately.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'recurring-project',
    title: 'Compare repeat jobs with a regular service',
    kind: 'project',
    business: 'itad',
    parentId: 'recurring',
    why: 'Choose a way to earn regular revenue that fits real customer needs and the work ODIDE can provide.',
    steps: [
      'Compare jobs customers need from time to time with work they need on a regular schedule.',
      'Check one possible regular service: what is included, how often it happens and what it costs.',
      'Write which sales and payment records the monthly report needs.',
    ],
    acceptance: 'A short comparison recommends repeat jobs, a regular service or both, with a reason. It includes a monthly report template and marks unknown cost, contract and legal details.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'recurring-offer',
    title: 'Check if customers need a regular ITAD service',
    kind: 'task',
    business: 'itad',
    parentId: 'recurring-project',
    dependsOn: ['offer-economics'],
    why: 'Customers need a reason to pay regularly. Check for real repeat work before proposing a recurring charge.',
    steps: [
      'Identify a customer need that repeats. Compare it with buying separate ITAD jobs when needed.',
      'If a regular service fits, write what is included, how often it happens and what costs extra.',
      'Check costs, payment dates and cancellation terms. Recommend whether to offer it, with a reason.',
    ],
    acceptance: 'A written recommendation says whether to offer a regular service and why. If yes, the draft states the work, schedule, costs, billing and cancellation terms. It is not a signed customer agreement.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'revenue-proof',
    title: 'Make a monthly sales and payments tracker',
    kind: 'task',
    business: 'itad',
    parentId: 'recurring-project',
    dependsOn: [],
    why: 'Show what customers were invoiced, what they paid and which month each amount belongs to. Keep repeat jobs separate from ongoing contracts.',
    steps: [
      'Confirm the currency, monthly target and whether the report counts invoices or payments.',
      'Create columns for customer, agreement, invoice date, amount, payment date, refund and cancellation.',
      'Add a monthly summary with separate totals for ongoing contracts and one-off jobs. Keep it blank until records are supplied.',
    ],
    acceptance: 'A blank monthly tracker states the currency, what is counted and the records needed. It keeps invoices and payments separate. No revenue amount appears without supporting records.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'team',
    title: 'Build a team that can complete ITAD jobs',
    kind: 'milestone',
    business: 'group',
    parentId: 'odide',
    why: 'The team must know who does each job step and what to pass to the next person. A list of roles alone is not a working team.',
    steps: [
      'List the roles needed for the agreed ITAD service.',
      'Name a person for each role only after they accept the work.',
      'Test whether the team can pass a job between people and handle a problem.',
    ],
    acceptance: 'Named people have accepted their work and passed the agreed job handover test. The test record shows what happened, not just a list of roles.',
    sources: [teamSource, managementSource],
    priority: 2,
  }),
  proposal({
    id: 'team-project',
    title: 'Write who does each job step and test it',
    kind: 'project',
    business: 'group',
    parentId: 'team',
    why: 'Make the job clear enough for another person to follow, without Junior explaining every step again.',
    steps: [
      'List who handles sales, equipment collection, processing, reports and payments.',
      'Write what each person receives, what they pass on and who they ask if stuck.',
      'Plan an approved practice handover and record where the instructions failed.',
    ],
    acceptance: 'A responsibility list, handover instructions and practice-test results are ready to review. Nobody is assigned work without their agreement.',
    sources: [teamSource, salesSource, managementSource, handoverSource],
    priority: 2,
  }),
  proposal({
    id: 'role-map',
    title: 'Write who handles sales, collections and reports',
    kind: 'task',
    business: 'group',
    parentId: 'team-project',
    why: 'Make each part of the job someone’s responsibility. Start with the work needed; do not assume staff already exist or that hiring is approved.',
    steps: [
      'List the work for sales, collection, equipment processing, customer reports and payments.',
      'Ask Junior which people or suppliers are available. Leave unconfirmed names unassigned.',
      'For each role, write what it must produce, what it can decide and who to ask if stuck.',
    ],
    acceptance: 'A draft table states each job, the role responsible, the result it must produce and decisions that need approval. Unconfirmed people remain unassigned.',
    sources: [teamSource, managementSource],
    priority: 2,
  }),
  proposal({
    id: 'handover-test',
    title: 'Test whether someone else can follow the job steps',
    kind: 'task',
    business: 'group',
    parentId: 'team-project',
    dependsOn: ['role-map', 'delivery-check'],
    why: 'Check whether another person can use the instructions, continue the job and deal with a problem without missing key details.',
    steps: [
      'Agree who will join the practice test and what must happen for it to pass.',
      'Prepare a sample job with the information and documents each role needs.',
      'During the approved test, record missing details, questions and how problems were handled.',
      'Fix the instructions and record the result of a repeat test.',
    ],
    acceptance: 'A checked test record names the people involved, pass conditions, results and remaining problems. The people who took part confirm the result.',
    sources: [teamSource, salesSource, handoverSource],
    priority: 2,
  }),
  proposal({
    id: 'devicecare',
    title: 'Keep Device Care separate from the ITAD priority',
    kind: 'milestone',
    business: 'device-care',
    parentId: 'odide',
    why: 'The proposed plan puts ITAD first. Check existing Device Care commitments separately before starting extra work.',
    steps: [
      'Check any existing Device Care work. Do not assume it needs a rebuild.',
      'Agree how much ITAD revenue and available team time are needed before adding Device Care work.',
      'Get separate approval before starting new Device Care work.',
    ],
    acceptance: 'Junior has agreed when new Device Care work can start, using clear ITAD revenue and team-time conditions. This roadmap does not approve that work.',
    priority: 3,
  }),
  proposal({
    id: 'devicecare-project',
    title: 'Decide when to start new Device Care work',
    kind: 'project',
    business: 'device-care',
    parentId: 'devicecare',
    why: 'Separate work needed to keep existing Device Care commitments from extra work that would take time away from ITAD.',
    steps: [
      'Review any Device Care website, documents, services and commitments supplied by Junior.',
      'List what must be maintained and what would be new work.',
      'Write the ITAD revenue and available-time conditions Junior must approve before new work starts.',
    ],
    acceptance: 'A short decision separates existing commitments from new work. It states exactly what must be true before Junior approves extra Device Care work.',
    priority: 3,
  }),
  proposal({
    id: 'devicecare-gate',
    title: 'Check Device Care work before adding more',
    kind: 'task',
    business: 'device-care',
    parentId: 'devicecare-project',
    dependsOn: ['delivery-check', 'offer-economics'],
    why: 'Find out what Device Care work already needs attention, if any. Keep extra work separate so it does not take time from the agreed ITAD tasks.',
    steps: [
      'Check shared Device Care information for existing work and commitments. Ask Junior only for missing details.',
      'Separate work needed to keep those commitments from proposed new work.',
      'Ask Junior to confirm the ITAD revenue and available team time required before adding more work.',
      'Write the decision and which records would justify reviewing it later.',
    ],
    acceptance: 'A short review lists current commitments, proposed new work and the conditions for starting it. This draft does not approve a launch, rebuild, customer contact or hiring.',
    priority: 3,
  }),
];

export const initialExpanded: string[] = ['odide'];

export const sourceInfo = 'AI-suggested starting plan. Review before use. Not imported from Notion.';

export const businessLabels: Record<WorkItem['business'], string> = {
  group: 'ODIDE',
  itad: 'ITAD',
  'device-care': 'Device Care',
};
