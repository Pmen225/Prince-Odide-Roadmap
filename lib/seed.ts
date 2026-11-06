import type { WorkItem } from './work-model.ts';

const youtube = 'https://github.com/Pmen225/hormozi-youtube-channel-skill/blob/main/';
const course = 'https://github.com/Pmen225/Junior-Built-skills/blob/main/skills/alex-hormozi-full-course/';
const leads = { label: 'YouTube skill: one channel, real replies', url: youtube + 'chapters/ch02-leads-and-content.md' };
const sales = { label: 'YouTube skill: understand the buyer, agree the next step', url: youtube + 'chapters/ch03-sales-and-handover.md' };
const constraint = { label: 'YouTube skill: fix the step losing customers', url: youtube + 'chapters/ch06-constraints-and-team.md' };
const retention = { label: 'YouTube skill: deliver value, then ask for a referral', url: youtube + 'chapters/ch05-activation-and-retention.md' };
const profit = { label: 'Money Models: price less direct delivery costs', url: course + 'chapters/ch04-gross-profit.md' };
const payback = { label: 'Money Models: when the customer pays', url: course + 'chapters/ch05-payback-period.md' };
const offers = { label: 'Money Models: each offer must solve a real need', url: course + 'chapters/ch07-money-models-and-offer-stacks.md' };
const continuity = { label: 'Money Models: repeat value before repeat charges', url: course + 'chapters/ch26-continuity-offers.md' };

type SeedInput = Pick<WorkItem, 'id' | 'title' | 'kind' | 'business' | 'why' | 'acceptance' | 'priority' | 'owner'> & {
  parentId?: string;
  dependsOn?: string[];
  steps: string[];
  sources: WorkItem['sources'];
};

function proposal(input: SeedInput): WorkItem {
  return {
    ...input,
    dependsOn: input.dependsOn ?? [],
    steps: input.steps.map((text, index) => ({ id: `${input.id}-step-${index + 1}`, text, done: false })),
    status: 'not-started',
    evidence: [],
    origin: 'proposal',
    approved: false,
  };
}

// A plan, not imported customer records or an agent run. Keep private mail,
// campaign settings, prices and personal information out of public source.
export const seedItems: WorkItem[] = [
  proposal({
    id: 'sales-goal',
    title: '10 paying ITAD customers. Start with one.',
    kind: 'goal', business: 'group', owner: 'Junior', priority: 1,
    why: 'The next result is one paid, profitable ITAD job. Use the business, campaign and tools already in place.',
    steps: [
      'Turn a real equipment-disposal need into an accepted quote.',
      'Deliver the agreed job, collect payment and check the actual costs.',
      'Repeat the route that wins paying customers. Add a team and regular service only when demand supports them.',
    ],
    acceptance: 'Payment and job records support each customer counted. Ten distinct paying ITAD customers is the longer-term target; messages, documents and unchecked CRM examples are not customers.',
    sources: [constraint, profit, offers],
  }),
  proposal({
    id: 'sales-conversations',
    title: 'Get a real buyer to ask for a quote',
    kind: 'milestone', business: 'itad', parentId: 'sales-goal', owner: 'Junior', priority: 1,
    why: 'Work existing replies first. If there is no interested buyer, test a small set of reachable local businesses.',
    steps: [
      'Check actual replies and the existing contact record.',
      'Ask a suitable business about equipment it needs removed.',
      'Confirm enough job details to prepare a useful quote.',
    ],
    acceptance: 'One named business confirms an equipment-disposal need, a decision-maker, location and timing. An automatic reply or a sent email does not meet this result.',
    sources: [leads, sales],
  }),
  proposal({
    id: 'sales-01-replies',
    title: 'Check replies from businesses already contacted',
    kind: 'task', business: 'itad', parentId: 'sales-conversations', owner: 'Agent', priority: 1,
    why: 'ODIDE already has an outreach campaign. Deal with interested replies first. First work block: 15 minutes.',
    steps: [
      'Open the current ODIDE outreach inbox. Match new replies to Sent and the existing prospect register.',
      'Separate interested people, questions, refusals, automatic replies and delivery failures. Never count an automatic reply as interest.',
      'For each interested person, record the missing job detail and prepare the next reply in the existing conversation.',
      'If there are no interested replies, move to the local-business test. If mailbox access is unavailable, state the access gap; do not report zero replies.',
    ],
    acceptance: 'The current inbox was checked with a time and message references. Each real buyer has a next action; refusals and failed deliveries are excluded from contact. Zero interest, if verified, moves work to the local-business test.',
    sources: [leads, constraint],
  }),
  proposal({
    id: 'sales-02-follow-up',
    title: 'Prepare follow-ups for eligible existing contacts',
    kind: 'task', business: 'itad', parentId: 'sales-conversations', owner: 'Agent', priority: 1,
    dependsOn: ['sales-01-replies'],
    why: 'Use conversations and contacts already started. Prepare a short next message, not another campaign plan.',
    steps: [
      'Check the last actual Sent message, reply and follow-up date. Remove refusals, bounces, duplicates and contacts not yet due.',
      'Use the existing follow-up template. Ask one useful question about equipment, postcode or timing; answer any question the buyer asked first.',
      'Give Junior the exact recipient and message for approval. Existing campaign rules keep replies and follow-ups as drafts.',
      'After an authorised send, attach the Sent reference and next review date to the existing record. A draft is not a sent message.',
    ],
    acceptance: 'Every eligible contact has a checked recipient and a ready-to-send draft, or a recorded reason not to contact them. The sending result is recorded separately; this task never claims a sale.',
    sources: [leads, sales],
  }),
  proposal({
    id: 'sales-03-local-demand',
    title: 'Ask 5 local businesses about equipment they need removed',
    kind: 'task', business: 'itad', parentId: 'sales-conversations', owner: 'Junior', priority: 1,
    why: 'If current replies give no buyer, test local demand with a small set of real contacts. Five contacts is a test size, not a promised result.',
    steps: [
      'Choose five reachable businesses inside the confirmed collection area from existing contacts or the current prospect register. Prefer a known introduction when available.',
      'Before contact, check prior messages, objections and the active campaign owner. Do not start a second sender or repeat an email already sent.',
      'Use an approved message or call: “Do you have old laptops or desktops to remove, or know who handles this? What equipment, postcode and timing?” Make no blanket free-collection or data-erasure promise.',
      'Contact only through the approved channel and permissions. Record each real answer in the existing record. Stop new prospecting to deal with an interested buyer immediately.',
      'After five contacts, compare replies and actual disposal needs. If there is no useful interest, change one thing—buyer type or message—before another test. Do not just increase volume.',
    ],
    acceptance: 'Five permitted contact attempts have real records, or an interested buyer has moved to job qualification sooner. Replies, confirmed needs and quotes are counted separately. This target does not change any existing automation or sending limit.',
    sources: [leads, constraint],
  }),
  proposal({
    id: 'sales-04-qualify',
    title: 'Confirm the details of one real ITAD job',
    kind: 'task', business: 'itad', parentId: 'sales-conversations', owner: 'Junior', priority: 1,
    why: 'A real buyer can move here immediately. They do not need to wait for the five-contact test to finish.',
    steps: [
      'Ask what equipment needs removing, how many items there are, their condition and whether they contain data.',
      'Confirm the collection postcode, access, preferred date and who can authorise disposal and the purchase.',
      'Ask how they handle this now and what needs to change. Confirm the data-handling result and records they need.',
      'Agree the next action with the buyer: send an inventory, arrange a short call or receive a scoped quote. Record their words in the existing CRM.',
    ],
    acceptance: 'One real buyer supplies equipment, location, timing, authority and data requirements, with a named next step. Missing details remain missing; a company name alone is not a qualified job.',
    sources: [sales, offers],
  }),
  proposal({
    id: 'sales-first-job',
    title: 'Quote, deliver and get paid',
    kind: 'milestone', business: 'itad', parentId: 'sales-goal', owner: 'Junior', priority: 1,
    why: 'Check the work needed for this buyer. Make only promises ODIDE can fulfil.',
    steps: [
      'Check this job’s direct costs, data handling, partner capacity and required cover.',
      'Agree the scope, price, date and payment terms with the buyer.',
      'Complete the job, collect payment and compare actual cost with the quote.',
    ],
    acceptance: 'The buyer accepted the quote, received the agreed service and paid. Actual revenue less actual direct delivery costs is positive. This is not a claim about operating or net profit.',
    sources: [sales, profit, payback],
  }),
  proposal({
    id: 'sales-05-costs',
    title: 'Check that this job can be delivered at a profit',
    kind: 'task', business: 'itad', parentId: 'sales-first-job', owner: 'Agent', priority: 1,
    dependsOn: ['sales-04-qualify'],
    why: 'Use the existing service and price rules for a real job. A general operations manual is not required to start a buyer conversation.',
    steps: [
      'Use the buyer’s inventory and address to confirm the supported work, access and collection route. Do not infer coverage from a prospect’s location.',
      'Get the actual transport, labour, erasure and recycling costs. Confirm partner rates, capacity, insurance and the required data-handling method for this job.',
      'Resolve unsupported drives or devices before promising a result. Get the responsible person to approve any legal, security or insurance requirement.',
      'Compare the existing price rule with verified costs. Show price, direct costs, gross profit and when cash is paid. Do not count an estimated resale value as received money.',
    ],
    acceptance: 'The actual job has an approved delivery route and a checked cost calculation. Scope, VAT, payment timing and service limits are clear. If a required capability is unconfirmed, no firm quote or collection is approved.',
    sources: [profit, offers, payback],
  }),
  proposal({
    id: 'sales-06-quote',
    title: 'Send an approved quote for the real job',
    kind: 'task', business: 'itad', parentId: 'sales-first-job', owner: 'Junior', priority: 1,
    dependsOn: ['sales-05-costs'],
    why: 'Give this buyer a clear decision: the work, price, date and how to accept.',
    steps: [
      'Fill the existing quote template with the confirmed equipment, work, exclusions, price, VAT treatment, proposed date and payment terms.',
      'Ask Junior to approve the exact quote and recipient. Do not add an untested guarantee, free collection or optional charge.',
      'Send through the authorised account. Ask for acceptance or the specific question stopping a decision.',
      'Record the actual response and next follow-up date in the existing CRM. If price is the issue, check scope and costs before proposing a smaller real job.',
    ],
    acceptance: 'An approved quote was sent to the verified decision-maker and has a Sent record. Accepted, declined and awaiting decision are distinct states. A draft or unread quote is not a sale.',
    sources: [sales, profit, offers],
  }),
  proposal({
    id: 'sales-07-book',
    title: 'Get quote acceptance and agree the collection',
    kind: 'task', business: 'itad', parentId: 'sales-first-job', owner: 'Junior', priority: 1,
    dependsOn: ['sales-06-quote'],
    why: 'Turn the quote into a confirmed job with a clear owner and date.',
    steps: [
      'Get the authorised buyer’s written acceptance. Answer the actual objection if they have not agreed; do not mark a silent buyer as won.',
      'Confirm the collection slot with the buyer and delivery owner, within the checked capacity.',
      'Confirm payment terms. If an agreed deposit is required before collection, verify receipt before booking the job.',
      'Give the delivery owner the accepted scope, equipment list, data requirements, access details and named customer contact.',
    ],
    acceptance: 'Written acceptance, an agreed collection slot, a named delivery owner and payment terms are recorded. Any required advance payment is verified. Booking is not full payment or completed delivery.',
    sources: [sales, payback],
  }),
  proposal({
    id: 'sales-08-deliver',
    title: 'Complete the customer’s agreed ITAD job',
    kind: 'task', business: 'itad', parentId: 'sales-first-job', owner: 'Junior', priority: 1,
    dependsOn: ['sales-07-book'],
    why: 'The buyer needs the equipment handled as agreed and the records promised in the quote.',
    steps: [
      'Use the approved job instructions and authorised delivery team. Check equipment and authority at handover.',
      'Keep the required custody, data-handling and recycling records. Escalate failed or unsupported equipment instead of claiming success.',
      'Give the buyer only reports and certificates supported by the actual completed work.',
      'Ask the buyer to confirm receipt and identify any unresolved problem. Save actual delivery costs against this job.',
    ],
    acceptance: 'The agreed service and required records reached the buyer. Exceptions are resolved or explicitly accepted. Actual job costs are recorded; no invented certificate or assumed successful erasure is used.',
    sources: [sales, retention, profit],
  }),
  proposal({
    id: 'sales-09-payment',
    title: 'Verify payment and the money left from the job',
    kind: 'task', business: 'itad', parentId: 'sales-first-job', owner: 'Agent', priority: 1,
    dependsOn: ['sales-08-deliver'],
    why: 'An invoice is not money received. Count a paid customer only from the payment record.',
    steps: [
      'Match the agreed invoice, any deposit and final payment. Follow the agreed terms for any unpaid balance.',
      'Subtract actual direct delivery costs from the job revenue. Show acquisition costs separately and record when cash arrived.',
      'Exclude unpaid invoices, template deals, refunds and unverified resale income from the paid-customer total.',
      'Update the existing customer record. If the job lost money, correct the cause before repeating the same price and scope.',
    ],
    acceptance: 'The payment record and actual direct costs establish whether this completed job made gross profit. A partial payment, unpaid balance or unknown cost is shown explicitly. No new revenue tracker is required.',
    sources: [profit, payback],
  }),
  proposal({
    id: 'sales-repeat',
    title: 'Win the next paying customer',
    kind: 'milestone', business: 'itad', parentId: 'sales-goal', owner: 'Junior', priority: 2,
    why: 'Build from a job that worked. Ask for introductions and repeat work the buyer actually needs.',
    steps: [
      'After a successful job, ask for one relevant introduction and the next disposal date.',
      'Use the channel and message that produced a profitable customer.',
      'Keep counting paid customers and actual job profit until the longer-term target is met.',
    ],
    acceptance: 'New paid jobs are linked to real introductions, repeat demand or a tested acquisition route. A contact list or subscription proposal is not recurring revenue.',
    sources: [retention, continuity, constraint],
  }),
  proposal({
    id: 'sales-10-referral',
    title: 'Ask the satisfied buyer for an introduction or next job',
    kind: 'task', business: 'itad', parentId: 'sales-repeat', owner: 'Junior', priority: 2,
    dependsOn: ['sales-09-payment'],
    why: 'Ask after the buyer has received a useful result. Do not design a subscription before checking repeat need.',
    steps: [
      'Check that the buyer is satisfied and unresolved delivery issues are closed.',
      'Ask: “Who else handles old business IT equipment and would welcome an introduction?” Respect their answer and permission.',
      'Ask when they next expect equipment to leave service. Offer a repeat service only if their need and ODIDE’s costs support it.',
      'Record the actual introduction or next date. Ask separate permission before using their name, job or testimonial publicly.',
    ],
    acceptance: 'The customer gave a real answer. An accepted introduction or agreed next step is recorded; a refusal is respected. No assumed referral, forced subscription or invented testimonial is counted.',
    sources: [retention, continuity],
  }),
  proposal({
    id: 'sales-11-repeat-test',
    title: 'Repeat the sales route that produced a profitable job',
    kind: 'task', business: 'itad', parentId: 'sales-repeat', owner: 'Agent', priority: 2,
    dependsOn: ['sales-09-payment'],
    why: 'Keep one buyer type, service and channel stable while testing whether the result repeats.',
    steps: [
      'Use the paid job to identify the buyer type, contact route, message and useful proof that led to the sale.',
      'Prepare the next small eligible batch from existing sources. Confirm delivery capacity and existing campaign permissions before any send or extra spend.',
      'Use actual attempts, real replies, qualified jobs, quotes, payments and direct costs to find the step losing customers.',
      'Change one limiting factor for the next test. Add a channel, hire staff or increase spend only after approval and evidence support it.',
    ],
    acceptance: 'The next test has a specific buyer, approved channel and a measured result. Scaling decisions use paying customers, delivery capacity and gross profit—not document count or raw email volume.',
    sources: [leads, constraint, profit],
  }),
];

export const initialExpanded: string[] = ['sales-goal', 'sales-conversations'];
export const sourceInfo = 'Customer-first suggestions. Reuses existing work. No live CRM sync or automatic outreach.';
export const businessLabels: Record<WorkItem['business'], string> = {
  group: 'ODIDE',
  itad: 'ITAD',
  'device-care': 'Device Care',
};
