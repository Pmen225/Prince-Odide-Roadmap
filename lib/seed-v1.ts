// Frozen baseline for non-destructive copy updates. Never render this copy.
// Only default planning proposals are stored here, not user data.
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

export const seedV1Items: WorkItem[] = [
  proposal({
    id: 'odide',
    title: '10 paying ITAD clients, monthly revenue, a working team',
    kind: 'goal',
    business: 'group',
    why: 'Proposed 12-month target: 10 paying ITAD clients, regular monthly revenue, and a functioning team. ITAD is the primary business. DeviceCare is secondary. This is a target, not a claim of results or a forecast.',
    steps: [
      'Agree the start date, monthly revenue target, currency, and team readiness checks.',
      'Review and approve the proposed ITAD work before execution.',
      'Use payment records, delivery records, and handover tests to check results.',
    ],
    acceptance: 'Within the agreed 12-month period, accepted evidence confirms 10 distinct paying ITAD clients, regular monthly revenue at the agreed target, and a team that passes the agreed handover checks. Reports distinguish recurring agreements from repeat one-off jobs. Junior accepts the evidence.',
    priority: 1,
  }),
  proposal({
    id: 'delivery',
    title: 'Prove ITAD delivery works',
    kind: 'milestone',
    business: 'itad',
    parentId: 'odide',
    why: 'An offer needs a delivery process that the business can perform and prove.',
    steps: [
      'Review existing assets, systems, and delivery arrangements.',
      'Document the delivery process and its open checks.',
      'Test a sample job and record the result.',
    ],
    acceptance: 'Junior accepts a tested delivery checklist, a sample evidence pack, and a record of resolved delivery gaps. Required legal and data-handling checks have named reviewers.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-review',
    title: 'Review what exists and define delivery',
    kind: 'project',
    business: 'itad',
    parentId: 'delivery',
    why: 'Keep useful existing work and identify only the changes needed.',
    steps: [
      'List the current website, documents, tools, and delivery arrangements.',
      'Mark each item keep, change, missing, or review needed.',
      'Map each delivery stage to an owner and a record.',
    ],
    acceptance: 'An asset review and delivery map are ready for Junior to approve. Each proposed change has a reason.',
    priority: 1,
  }),
  proposal({
    id: 'assets-review',
    title: 'Review existing ITAD assets',
    kind: 'task',
    business: 'itad',
    parentId: 'delivery-review',
    why: 'This proposed review prevents unnecessary rebuilding of existing sites and setup.',
    steps: [
      'Ask Junior for the current ITAD site, documents, and tools to review.',
      'Check the supplied items against the intended buyer and service.',
      'Record what to keep, change, or verify, with a reason for each change.',
    ],
    acceptance: 'A review lists each supplied asset, its current purpose, the proposed decision, and the next check. No rebuild is approved by default.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-process',
    title: 'Draft the ITAD job checklist',
    kind: 'task',
    business: 'itad',
    parentId: 'delivery-review',
    dependsOn: ['assets-review'],
    why: 'A clear checklist connects the customer promise to the work and records required.',
    steps: [
      'Map enquiry, quote, collection, asset receipt, processing, and customer reporting.',
      'Name the responsible role and required record at each stage.',
      'List security, data-handling, and legal questions for qualified review.',
      'Identify the delivery gaps that must close before a live job.',
    ],
    acceptance: 'A draft checklist names each stage, owner role, required record, exception path, and open review. It does not claim legal or security approval.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-proof',
    title: 'Test the delivery evidence',
    kind: 'project',
    business: 'itad',
    parentId: 'delivery',
    why: 'A sample test exposes gaps before a customer relies on the service.',
    steps: [
      'Choose an approved, non-customer sample job.',
      'Walk through the delivery checklist and create sample records.',
      'Review gaps and record the retest result.',
    ],
    acceptance: 'A sample job report links the checklist, sample records, gaps, and retest result for review.',
    priority: 1,
  }),
  proposal({
    id: 'delivery-check',
    title: 'Plan and review a sample ITAD job',
    kind: 'task',
    business: 'itad',
    parentId: 'delivery-proof',
    dependsOn: ['delivery-process'],
    why: 'This proposed test checks whether the process produces usable proof of delivery.',
    steps: [
      'Define a safe sample job and obtain approval for the test.',
      'Use the checklist to record each sample stage and exception.',
      'Check that the final customer report matches the sample records.',
      'Record gaps, fixes, and the evidence needed for a passed retest.',
    ],
    acceptance: 'An approved sample test has a completed checklist, a matching sample customer report, and a reviewed gap log. No live customer job is implied.',
    priority: 1,
  }),
  proposal({
    id: 'clients',
    title: 'Win 10 paying ITAD clients',
    kind: 'milestone',
    business: 'itad',
    parentId: 'odide',
    why: 'Paying clients are the primary commercial result, not outreach or lead counts.',
    steps: [
      'Approve a clear ITAD offer and its delivery economics.',
      'Approve and run a focused sales test through a separate execution decision.',
      'Count distinct clients only when their payments have evidence.',
    ],
    acceptance: 'Records show payment evidence for 10 distinct ITAD clients under the agreed counting rule. A proposal, lead, or unpaid invoice does not count.',
    sources: [offerSource, leadsSource, salesSource, coreFourSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'offer-project',
    title: 'Make the ITAD offer clear and viable',
    kind: 'project',
    business: 'itad',
    parentId: 'clients',
    why: 'The buyer, promise, service scope, and price must agree with delivery capacity.',
    steps: [
      'Review any existing offer before proposing changes.',
      'Define the buyer, result, service scope, and buying step.',
      'Check costs and the price approval rule.',
    ],
    acceptance: 'A one-page offer and cost worksheet are ready for Junior to approve. Unverified costs and delivery promises are clearly marked.',
    sources: [offerSource],
    priority: 1,
  }),
  proposal({
    id: 'offer',
    title: 'Define the first ITAD offer',
    kind: 'task',
    business: 'itad',
    parentId: 'offer-project',
    why: 'This proposed task defines what ODIDE will sell and who it will serve. It does not send an offer to anyone.',
    steps: [
      'Review the current offer with Junior and retain useful work.',
      'Choose one buyer type and the problem the service will solve.',
      'Draft the service scope, exclusions, required inputs, and buying step.',
      'List each delivery promise and the evidence needed to support it.',
    ],
    acceptance: 'Junior has a one-page draft that names the buyer, problem, result, scope, exclusions, and buying step. Every promise is supported or marked for review.',
    sources: [offerSource],
    priority: 1,
  }),
  proposal({
    id: 'offer-economics',
    title: 'Check price, costs, and payment terms',
    kind: 'task',
    business: 'itad',
    parentId: 'offer-project',
    dependsOn: ['offer', 'delivery-process'],
    why: 'A proposed sale needs a cost and payment check before a price is approved.',
    steps: [
      'List the cost inputs for collection, processing, reporting, and exceptions.',
      'Enter verified cost quotes and mark unknown inputs without estimates.',
      'Calculate the proposed gross profit and cash timing from those inputs.',
      'Ask Junior to approve price limits and payment terms.',
    ],
    acceptance: 'A cost worksheet shows its sources, unknowns, price, gross profit calculation, and payment timing. Junior has a clear price decision to make.',
    sources: [offerSource],
    priority: 1,
  }),
  proposal({
    id: 'sales-project',
    title: 'Prepare a focused client sales test',
    kind: 'project',
    business: 'itad',
    parentId: 'clients',
    why: 'A small, approved test gives useful sales evidence without mixing many channels.',
    steps: [
      'Define the target account rules and one proposed channel.',
      'Prepare messages, sales questions, and a delivery handover draft.',
      'Define payment proof and the review decision for the test.',
    ],
    acceptance: 'A sales test pack states the audience, channel, limits, draft messages, measures, handover, and approval required before contact.',
    sources: [leadsSource, salesSource, coreFourSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'target-list',
    title: 'Define the target account list',
    kind: 'task',
    business: 'itad',
    parentId: 'sales-project',
    dependsOn: ['offer'],
    why: 'Clear account rules keep the proposed sales test relevant to the ITAD offer.',
    steps: [
      'Set account fit rules from the approved buyer and service scope.',
      'Define permitted research sources and the fields needed in a list.',
      'Prepare a blank account list with a source and fit-reason field.',
    ],
    acceptance: 'A list template and written fit rules are ready for review. No personal contact data or researched account is included in this seed plan.',
    sources: [leadsSource, coreFourSource],
    priority: 1,
  }),
  proposal({
    id: 'sales-test',
    title: 'Draft the sales test for approval',
    kind: 'task',
    business: 'itad',
    parentId: 'sales-project',
    dependsOn: ['offer-economics', 'target-list', 'delivery-check'],
    why: 'This task prepares a bounded test. Contacting people requires a separate approval.',
    steps: [
      'Choose one proposed channel and ask Junior to set the test limits.',
      'Draft the message, sales questions, follow-up rule, and stop rule.',
      'Define how to record activity, replies, qualified calls, quotes, and payments.',
      'Prepare a sales-to-delivery handover and submit the pack for approval.',
    ],
    acceptance: 'Junior receives the full test pack, exact proposed messages, scope, limits, and measures. No outreach is sent and no agent run is started by this task draft.',
    sources: [leadsSource, salesSource, coreFourSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'paid-client-proof',
    title: 'Set the paying-client proof rule',
    kind: 'task',
    business: 'itad',
    parentId: 'sales-project',
    dependsOn: ['sales-test'],
    why: 'A consistent proof rule separates paid clients from leads, quotes, and unpaid invoices.',
    steps: [
      'Agree how to identify a distinct business client.',
      'Define the payment record and delivery reference required to count a client.',
      'Prepare a blank tracker with duplicate and refund checks.',
    ],
    acceptance: 'A blank tracker and counting rule are ready for approval. A counted client must link to accepted payment proof; the plan contains no claimed client total.',
    sources: [salesSource, closerSource],
    priority: 1,
  }),
  proposal({
    id: 'recurring',
    title: 'Establish regular monthly ITAD revenue',
    kind: 'milestone',
    business: 'itad',
    parentId: 'odide',
    why: 'Regular monthly revenue can come from recurring agreements, repeat one-off jobs, or both. Assess each route against buyer needs and delivery capacity.',
    steps: [
      'Agree the monthly revenue target, currency, and reporting basis.',
      'Assess recurring services and repeat one-off work as separate revenue routes.',
      'Check monthly revenue against the agreed evidence and reporting rules.',
    ],
    acceptance: 'Accepted records support regular monthly revenue at the agreed target and reporting basis. The report separates recurring agreements, repeat one-off jobs, invoices, and payments. Recurring contracts are not a requirement of this goal.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'recurring-project',
    title: 'Assess monthly revenue routes and proof',
    kind: 'project',
    business: 'itad',
    parentId: 'recurring',
    why: 'The monthly revenue plan needs a deliverable service and consistent evidence. A recurring offer is a proposed option, not an assumed requirement.',
    steps: [
      'Compare ongoing buyer needs with repeat one-off ITAD work.',
      'Assess a recurring service option with clear scope and terms.',
      'Define the monthly evidence and reporting rules.',
    ],
    acceptance: 'A review-ready plan records which revenue routes fit the service, why each route was selected or rejected, and how monthly revenue will be verified. Unknown commercial and legal inputs are marked.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'recurring-offer',
    title: 'Assess a recurring ITAD service option',
    kind: 'task',
    business: 'itad',
    parentId: 'recurring-project',
    dependsOn: ['offer-economics'],
    why: 'A recurring payment needs a specific ongoing service. Assess this option without treating it as the only route to regular monthly revenue.',
    steps: [
      'Identify an ongoing buyer need and compare it with repeat one-off demand.',
      'If the service fits, draft frequency, included work, limits, and exceptions.',
      'Check costs and proposed billing and cancellation terms, then record a go or no-go recommendation for review.',
    ],
    acceptance: 'A review-ready decision records whether a recurring service fits. A proposed offer includes scope, frequency, costs, billing, and cancellation terms; a no-go decision records the reason. Neither is an active customer agreement.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'revenue-proof',
    title: 'Define the monthly revenue record',
    kind: 'task',
    business: 'itad',
    parentId: 'recurring-project',
    dependsOn: [],
    why: 'A clear record distinguishes recurring agreements, invoices, and money received.',
    steps: [
      'Ask Junior to set the currency, target, and revenue reporting basis.',
      'Define the agreement, invoice, payment, refund, and cancellation fields.',
      'Prepare a blank monthly report that separates recurring and one-off revenue.',
    ],
    acceptance: 'A blank report and written rules state the currency, reporting basis, and required evidence. No revenue amount is claimed without records.',
    sources: [recurringSource],
    priority: 2,
  }),
  proposal({
    id: 'team',
    title: 'Build a team that can deliver the work',
    kind: 'milestone',
    business: 'group',
    parentId: 'odide',
    why: 'A functioning team needs clear responsibilities and tested handovers.',
    steps: [
      'Agree the roles needed for the approved ITAD service.',
      'Assign each role only after the person accepts it.',
      'Test handovers and exception handling against agreed checks.',
    ],
    acceptance: 'Named people accept their responsibilities and pass the agreed handover checks. A role list alone does not prove team readiness.',
    sources: [teamSource, managementSource],
    priority: 2,
  }),
  proposal({
    id: 'team-project',
    title: 'Define roles and test handovers',
    kind: 'project',
    business: 'group',
    parentId: 'team',
    why: 'Documented roles and sample tests show where Junior still needs to intervene.',
    steps: [
      'Map sales, delivery, reporting, and finance responsibilities.',
      'Write the inputs, outputs, and escalation rule for each handover.',
      'Plan a sample handover test and record the result.',
    ],
    acceptance: 'A role map, handover instructions, and sample test results are ready for review. No person is assigned without agreement.',
    sources: [teamSource, salesSource, managementSource, handoverSource],
    priority: 2,
  }),
  proposal({
    id: 'role-map',
    title: 'Draft the team responsibility map',
    kind: 'task',
    business: 'group',
    parentId: 'team-project',
    why: 'This proposed map defines responsibility without assuming a team already exists or needs hiring.',
    steps: [
      'List the responsibilities required for sales, delivery, reporting, and finance.',
      'Ask Junior which existing people or suppliers can cover each responsibility.',
      'Record the expected output, decision limit, and escalation route for each role.',
    ],
    acceptance: 'A draft role map lists every required responsibility, its expected output, and its decision limits. Unconfirmed owners remain unassigned.',
    sources: [teamSource, managementSource],
    priority: 2,
  }),
  proposal({
    id: 'handover-test',
    title: 'Plan and review a team handover test',
    kind: 'task',
    business: 'group',
    parentId: 'team-project',
    dependsOn: ['role-map', 'delivery-check'],
    why: 'A sample handover checks that another person can use the instructions and handle an exception.',
    steps: [
      'Agree the test participants and the pass criteria with Junior.',
      'Prepare a sample job with the inputs needed by each role.',
      'Record missed inputs, questions, and exception decisions during the approved test.',
      'Revise the instructions and record the retest evidence.',
    ],
    acceptance: 'A reviewed test record names participants, pass criteria, results, and remaining gaps. A successful result needs evidence from the agreed participants.',
    sources: [teamSource, salesSource, handoverSource],
    priority: 2,
  }),
  proposal({
    id: 'devicecare',
    title: 'Keep DeviceCare behind the ITAD priority',
    kind: 'milestone',
    business: 'device-care',
    parentId: 'odide',
    why: 'DeviceCare is secondary. Its work must fit the approved ITAD priorities and available capacity.',
    steps: [
      'Review existing DeviceCare work without assuming a rebuild.',
      'Agree the ITAD revenue and capacity conditions required to expand DeviceCare.',
      'Keep new DeviceCare execution subject to a separate approval.',
    ],
    acceptance: 'Junior accepts a DeviceCare decision with explicit ITAD revenue and capacity conditions. Expansion is not approved by this roadmap.',
    priority: 3,
  }),
  proposal({
    id: 'devicecare-project',
    title: 'Set the DeviceCare expansion gate',
    kind: 'project',
    business: 'device-care',
    parentId: 'devicecare',
    why: 'A written gate protects the primary ITAD work while retaining useful DeviceCare assets.',
    steps: [
      'Review the existing DeviceCare assets and obligations supplied by Junior.',
      'List the work required to maintain them and any proposed expansion.',
      'Prepare a capacity and revenue gate for Junior to approve.',
    ],
    acceptance: 'A review-ready decision separates maintenance from expansion and states the conditions for approving new DeviceCare work.',
    priority: 3,
  }),
  proposal({
    id: 'devicecare-gate',
    title: 'Review DeviceCare and set its start conditions',
    kind: 'task',
    business: 'device-care',
    parentId: 'devicecare-project',
    dependsOn: ['delivery-check', 'offer-economics'],
    why: 'This proposed review does not launch DeviceCare or divert capacity from ITAD.',
    steps: [
      'Ask Junior for the existing DeviceCare work and any current obligations.',
      'Separate required maintenance from proposed new work.',
      'Ask Junior to set measurable ITAD revenue and capacity conditions for expansion.',
      'Record the decision and the evidence needed to revisit it.',
    ],
    acceptance: 'Junior has a written review and expansion decision with measurable conditions. No launch, rebuild, outreach, or hiring action is authorized by this draft.',
    priority: 3,
  }),
];


