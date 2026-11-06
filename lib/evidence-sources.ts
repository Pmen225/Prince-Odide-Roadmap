export type ResearchSource = { id:number; key:string; title:string; url:string; date:string; dateScope:string; group:'itad'|'sales'|'execution'; kind:string; quote:string; change:string; limit:string; taskIds:string[] };

export const researchDate = '2026-11-06';
export const researchWindow = '6 Nov 2024 – 6 Nov 2026';
// Fifty distinct opened pages; reports and technical controls are not sales proof.
export const researchSources: ResearchSource[] = [
  {
    "id": 1,
    "key": "itad-01",
    "title": "eWaste frustrations due to lack of asset management",
    "url": "https://www.reddit.com/r/sysadmin/comments/1ngmmm8/ewaste_frustrations_due_to_lack_of_asset/",
    "date": "2025-09-14",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand internal IT operator report",
    "quote": "we literally have over 400 laptops to get rid of.",
    "change": "Ask for current disposal supplier, contract restrictions, decision-maker, batch size, packing responsibility and the specific unresolved problem before treating the account as a qualified opportunity.",
    "limit": "Anonymous worker report; no independent verification of inventory, contract or supplier charges. Large company is outside the initial small-batch pilot.",
    "taskIds": [
      "sales-04-qualify",
      "sales-05-costs"
    ]
  },
  {
    "id": 2,
    "key": "itad-02",
    "title": "E-Waste Vendor",
    "url": "https://www.reddit.com/r/sysadmin/comments/1uqketg/ewaste_vendor/",
    "date": "2026-07-08",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand enterprise buyer requirements",
    "quote": "Certificate of destruction is provided alongside detailed inventory list.",
    "change": "Record required proof before quoting. At delivery, reconcile the received item list with processing results and actual certificates. Do not promise unverified service coverage.",
    "limit": "Buyer request, not completed purchase. National multi-site need is not proof that ODIDE can fulfil it. Promotional recommendations in comments excluded.",
    "taskIds": [
      "sales-04-qualify",
      "sales-08-deliver"
    ]
  },
  {
    "id": 3,
    "key": "itad-03",
    "title": "What to do with old hardware?",
    "url": "https://www.reddit.com/r/sysadmin/comments/1rliunl/what_to_do_with_old_hardware/",
    "date": "2026-03-05",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand sole-IT-worker disposal need",
    "quote": "Some broken, some just old.",
    "change": "Collect count, model, approximate age, condition, power status and storage status. Split reusable, uncertain and failed items before estimating value or direct costs.",
    "limit": "Reported backlog at one startup. Replies disagree on recoverable value. No price or conversion inference.",
    "taskIds": [
      "sales-04-qualify",
      "sales-05-costs"
    ]
  },
  {
    "id": 4,
    "key": "itad-04",
    "title": "Recommendations for smart hands in Buffalo NY?",
    "url": "https://www.reddit.com/r/msp/comments/1iy2tfw/recommendations_for_smart_hands_in_buffalo_ny/",
    "date": "2025-02-25",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand ITAD operator subcontracting request",
    "quote": "Sign off on the provided report, note and set aside any failed drives",
    "change": "Separate AI coordination from physical work. Assign an authorised technician; specify supplied inputs, approved processing method, failure quarantine, report sign-off and handover evidence.",
    "limit": "Self-reported specialist job, not verified fulfilment. Its claimed processing duration is not a general erasure standard.",
    "taskIds": [
      "sales-05-costs",
      "sales-08-deliver"
    ]
  },
  {
    "id": 5,
    "key": "itad-05",
    "title": "What’re yall doing for eWaste & systems disposal?",
    "url": "https://www.reddit.com/r/msp/comments/1tx0lpm/whatre_yall_doing_for_ewaste_systems_disposal/",
    "date": "2026-06-04",
    "dateScope": "quoted comment",
    "group": "itad",
    "kind": "Firsthand MSP billing and disposal practice",
    "quote": "We never bill for e-recycle. It's either included in the monthly or the replacement project.",
    "change": "Ask an MSP prospect what is already bundled and what its recycler fails to do. Do not pitch a generic collection charge against a satisfactory existing free route.",
    "limit": "One MSP model. Other comments report hourly fees and chargeable secure disposal. Do not infer that all disposal is free or that every buyer will pay.",
    "taskIds": [
      "sales-03-local-demand",
      "sales-04-qualify"
    ]
  },
  {
    "id": 6,
    "key": "itad-06",
    "title": "Recycling vendors?",
    "url": "https://www.reddit.com/r/msp/comments/1j9ogc6/recycling_vendors/",
    "date": "2025-03-12",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand MSP procurement problem",
    "quote": "Problem is, these aren't offices with 50 computers in need of recycling, maybe 5-10 per location at a time.",
    "change": "Capture quantity at each address, access, packing and date. Price the actual journey and labour; get a confirmed partner minimum before offering a collection slot.",
    "limit": "One MSP's difficulty is not evidence that every local supplier rejects small batches. No numeric minimum has been transferred to ODIDE.",
    "taskIds": [
      "sales-04-qualify",
      "sales-05-costs",
      "sales-06-quote"
    ]
  },
  {
    "id": 7,
    "key": "itad-07",
    "title": "Where's all the E-waste gone? — school IT manager reply",
    "url": "https://www.reddit.com/r/AskUK/comments/1iy99j5/comment/mew1r5a/",
    "date": "2025-02-26",
    "dateScope": "quoted comment; original thread is 2025-02-25",
    "group": "itad",
    "kind": "Firsthand school IT manager disposal experience",
    "quote": "The company I use come all the way from Birmingham to Kent and charge nothing.",
    "change": "Ask what the current supplier collects, what evidence it provides, frequency and unresolved issue. If the current route works, mark no present need rather than forcing a pitch.",
    "limit": "Anonymous self-report. The provider and claimed compliance are not verified. Adjacent reply says another small IT firm pays, so neither free nor paid is universal.",
    "taskIds": [
      "sales-03-local-demand",
      "sales-04-qualify",
      "sales-06-quote"
    ]
  },
  {
    "id": 8,
    "key": "itad-08",
    "title": "Who does ITAD well?",
    "url": "https://www.reddit.com/r/sysadmin/comments/1ox0skb/who_does_itad_well/",
    "date": "2025-11-14",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand ongoing decommissioning buyer need",
    "quote": "We have ongoing hardware turnover and need to decommission.",
    "change": "After successful delivery, ask when the next replacement or clearance occurs. Record the actual date and permission to follow up; do not invent a monthly subscription.",
    "limit": "Stated need, not verified purchase or regular revenue. Vendor recommendations in replies are not endorsements.",
    "taskIds": [
      "sales-10-referral",
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 9,
    "key": "itad-09",
    "title": "How Do You Dispose of Old Electronics? — disposal/reuse report",
    "url": "https://www.reddit.com/r/sysadmin/comments/1irkw4a/how_do_you_dispose_of_old_electronics/",
    "date": "2025-02-17",
    "dateScope": "quoted comment",
    "group": "itad",
    "kind": "Firsthand company disposal/reuse workflow",
    "quote": "And we get a list back of what happened to each device...",
    "change": "Require each accepted device or storage identifier to resolve to an authorised outcome and evidence. Hold unresolved items open; do not mark the whole job done from a generic certificate.",
    "limit": "Operator description, not audited chain of custody. Technical erasure comments elsewhere on the thread are not used as standards.",
    "taskIds": [
      "sales-08-deliver"
    ]
  },
  {
    "id": 10,
    "key": "itad-10",
    "title": "Any good recs for enterprise ITAD companies?",
    "url": "https://www.reddit.com/r/sysadmin/comments/1nfdlct/any_good_recs_for_enterprise_itad_companies/",
    "date": "2025-09-12",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand enterprise decommissioning buyer request",
    "quote": "Budget is NOT the main concern here.",
    "change": "Ask the buyer to rank reliability, data proof, staff time, clearance date and recovered value. Route an unsupported enterprise job to a human rather than promising capacity.",
    "limit": "Anonymous requirement and account of past difficulties; not verified spending. Enterprise need does not establish small-business willingness to pay.",
    "taskIds": [
      "sales-04-qualify",
      "sales-06-quote"
    ]
  },
  {
    "id": 11,
    "key": "itad-11",
    "title": "Itad start up advice wanted — existing buyer reply",
    "url": "https://www.reddit.com/r/sysadmin/comments/1rtkjka/itad_start_up_advice_wanted/",
    "date": "2026-03-14",
    "dateScope": "quoted comment",
    "group": "itad",
    "kind": "Firsthand current customer report",
    "quote": "We use STS Recycling and they pickup up our equipment for free and provide CoD.",
    "change": "Validate the specific service gap before proposing a paid collection. Compare actual scope, collection convenience, evidence and exclusions rather than a generic free-versus-paid claim.",
    "limit": "Unverified brand-specific customer claim; no supplier endorsement or certification assertion. Cost allocation and resale economics are unknown.",
    "taskIds": [
      "sales-03-local-demand",
      "sales-04-qualify",
      "sales-06-quote"
    ]
  },
  {
    "id": 12,
    "key": "itad-12",
    "title": "What do you do with old tech? — replacement-cycle report",
    "url": "https://www.reddit.com/r/sysadmin/comments/1k9udgz/what_do_you_do_with_old_tech/",
    "date": "2025-04-28",
    "dateScope": "quoted comment",
    "group": "itad",
    "kind": "Firsthand IT replacement and disposal cycle",
    "quote": "We are currently on a 35 laptop per year replacement cycle.",
    "change": "Record the customer's next batch date and expected quantity after a successful job. Base the next follow-up on that date, not on an invented retainer model.",
    "limit": "One company's reported cadence. No guarantee of future supply or willingness to sign a service contract.",
    "taskIds": [
      "sales-10-referral",
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 13,
    "key": "itad-13",
    "title": "Laptop End-of-Life",
    "url": "https://www.reddit.com/r/msp/comments/1hv85og/laptop_endoflife/",
    "date": "2025-01-06",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand MSP retired-equipment owner request",
    "quote": "These laptops are typically 4-6 years old and mostly in fair to good condition and in working order.",
    "change": "Ask whether the prospect wants disposal, an upfront purchase or resale proceeds. Verify actual model and condition before selecting a processing route or estimating recoverable value.",
    "limit": "Owner-reported condition; no inspection or achieved resale evidence. Do not set prices from age alone.",
    "taskIds": [
      "sales-04-qualify",
      "sales-05-costs"
    ]
  },
  {
    "id": 14,
    "key": "itad-14",
    "title": "Looking for Advice: Selling Equipment to an ITAD Company",
    "url": "https://www.reddit.com/r/InformationTechnology/comments/1ha6p8r/looking_for_advice_selling_equipment_to_an_itad/",
    "date": "2024-12-09",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand equipment owner's proposed disposal transaction",
    "quote": "When did you get paid? Did you receive payment upfront, or did you have to wait until the equipment was sold?",
    "change": "In each quote state who owns the items, who receives money, upfront versus resale-contingent payment, deduction basis, approval thresholds and payment dates. Reconcile actual receipt rather than expected resale.",
    "limit": "Buyer questions, not completed transaction. Conflicting percentage estimates in sales replies are not comparable without condition, fee and gross/net definitions.",
    "taskIds": [
      "sales-06-quote",
      "sales-09-payment"
    ]
  },
  {
    "id": 15,
    "key": "itad-15",
    "title": "When your company recycles devices (through a third party), do you remove the Autopilot entry?",
    "url": "https://www.reddit.com/r/Intune/comments/1u2z116/when_your_company_recycles_devices_through_a/",
    "date": "2026-06-11",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand device-management handover question",
    "quote": "I'm under the assumption that it shouldn't be needed because these devices won't be reused or resold.",
    "change": "Get the authorised reuse/destruction route and the customer's account-release owner before handover. Do not remove management records or resell based on an assumption; use verified vendor instructions and explicit authority.",
    "limit": "The quoted assumption is the problem under discussion, not a technical fact. This thread is not authority for a Microsoft procedure.",
    "taskIds": [
      "sales-04-qualify",
      "sales-07-book",
      "sales-08-deliver"
    ]
  },
  {
    "id": 16,
    "key": "itad-16",
    "title": "Employee Buyback Storefront",
    "url": "https://www.reddit.com/r/ITManagers/comments/1ijw0py/employee_buyback_storefront/",
    "date": "2025-02-07",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand internal IT equipment resale process",
    "quote": "We have a stockpile of 3 year old laptops that we sell back to employees for $100.",
    "change": "Ask what the current disposal or resale process costs in staff effort, what outcome the buyer wants and what scope they would outsource. Do not assume stockpiles are abandoned or available free.",
    "limit": "Company-specific internal subsidised sale price; not a resale benchmark or UK price. No verified conversion to an external service.",
    "taskIds": [
      "sales-04-qualify",
      "sales-06-quote"
    ]
  },
  {
    "id": 17,
    "key": "itad-17",
    "title": "Secure hard drive destruction for consumers",
    "url": "https://www.reddit.com/r/DataHoarder/comments/1hv23d9/secure_hard_drive_destruction_for_consumers/",
    "date": "2025-01-06",
    "dateScope": "original post",
    "group": "itad",
    "kind": "Firsthand consumer secure-disposal need; boundary case",
    "quote": "Does anyone know of a consumer-friendly service that offers secure drive recycling, even if it comes at cost?",
    "change": "Check business-versus-consumer, device count and required data outcome at qualification. Route an out-of-scope consumer request to a human-approved referral instead of silently expanding the pilot.",
    "limit": "One consumer's request does not prove local B2B demand. Unsafe DIY advice and old price anecdotes in replies are excluded.",
    "taskIds": [
      "sales-04-qualify",
      "sales-05-costs"
    ]
  },
  {
    "id": 18,
    "key": "sales-e01",
    "title": "No new clients in nearly 2 years - how abnormal is this",
    "url": "https://www.reddit.com/r/msp/comments/1j9prlc/no_new_clients_in_nearly_2_years_how_abnormal_is/",
    "date": "2025-03-12",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator report",
    "quote": "We've had a handful of prospect meetings and nothing has panned out.",
    "change": "Track accepted quotes and paid jobs, not meetings alone. A long-established company can still have no new sales.",
    "limit": "One employee's report; no audited CRM. MSP contracts differ from one-off ITAD jobs.",
    "taskIds": [
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 19,
    "key": "sales-e02",
    "title": "For the guys doing commercial cleaning, HVAC, or commercial landscaping for office buildings and clinics: How are you actually getting the decision-maker on the phone?",
    "url": "https://af.reddit.com/r/sweatystartup/comments/1sbmess/for_the_guys_doing_commercial_cleaning_hvac_or/",
    "date": "2026-04-03",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand seller report",
    "quote": "The front desk receptionists and office managers are bulletproof.",
    "change": "Record the actual contact's role. Ask who handles unwanted business equipment; do not count receptionist contact as buyer access.",
    "limit": "Complaint from one payment-services seller, not evidence that all cold outreach fails. Other commenters describe warm-introduction success.",
    "taskIds": [
      "sales-03-local-demand",
      "sales-04-qualify"
    ]
  },
  {
    "id": 20,
    "key": "sales-e03",
    "title": "Do You Send Quotes/Estimates? How Do You Follow Up?",
    "url": "https://www.reddit.com/r/smallbusiness/comments/1j864s1/do_you_send_quotesestimates_how_do_you_follow_up/",
    "date": "2025-03-10",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator comment",
    "quote": "Always confirm by text when you agree on a price",
    "change": "Save the exact quote version, customer acceptance and tax treatment before booking. Verbal agreement is not the task's proof.",
    "limit": "Operator is in a different tax jurisdiction. Do not import their HST rules or software recommendation into UK ITAD.",
    "taskIds": [
      "sales-06-quote",
      "sales-07-book"
    ]
  },
  {
    "id": 21,
    "key": "sales-e04",
    "title": "How soon do you give up?",
    "url": "https://www.reddit.com/r/smallbusinessuk/comments/1ld270s/how_soon_do_you_give_up/",
    "date": "2025-06-16",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand seller report",
    "quote": "Today I got a response after email 5 - with increased scope of work.",
    "change": "Use the prospect's requested date and the approved follow-up policy. Silence is not a refusal; a refusal stops contact. Do not treat five touches as a proven optimum.",
    "limit": "Anecdote with no denominator. Same thread includes owners who stop earlier; cadence must not be inferred as universal.",
    "taskIds": [
      "sales-02-follow-up"
    ]
  },
  {
    "id": 22,
    "key": "sales-e05",
    "title": "First client",
    "url": "https://www.reddit.com/r/msp/comments/1oi5qkd/first_client/",
    "date": "2025-10-28",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator comment",
    "quote": "My first client was an old employer who was happy to pay me to do their IT.",
    "change": "Start the small demand test with authorized existing business contacts. Ask for a specific introduction when the contact is not the buyer.",
    "limit": "One successful warm lead; does not establish a guaranteed route or license contacting private employee lists.",
    "taskIds": [
      "sales-03-local-demand"
    ]
  },
  {
    "id": 23,
    "key": "sales-e06",
    "title": "Approaching a larger MSP for referral agreements: has anyone done this successfully?",
    "url": "https://www.reddit.com/r/SmallMSP/comments/1trls0u/approaching_a_larger_msp_for_referral_agreements/",
    "date": "2026-05-30",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator comment",
    "quote": "The last 3 years or so we've been consistently handing off our smaller fish as we've started chasing the larger ones...",
    "change": "When testing partner introductions, specify the job size and area ODIDE can serve. Ask permission before sharing customer details.",
    "limit": "Different market; no evidence that any particular local MSP wants this arrangement. Service quality is the reported condition, not a guaranteed commission.",
    "taskIds": [
      "sales-03-local-demand",
      "sales-10-referral"
    ]
  },
  {
    "id": 24,
    "key": "sales-e07",
    "title": "Commercial Cleaning Owners: If You Had to Start Over, What Would Be Your Blueprint?",
    "url": "https://www.reddit.com/r/sweatystartup/comments/1jg8dui/commercial_cleaning_owners_if_you_had_to_start/",
    "date": "2025-03-21",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator report",
    "quote": "Spent $800+ on ads that didn’t convert (Thumbtack, Yelp, and Bark were a waste).",
    "change": "Measure results by channel before increasing spend. Reuse the active route; do not add paid lead platforms just to create activity.",
    "limit": "Self-reported campaign with no creative, targeting or attribution audit. Not proof those platforms never work.",
    "taskIds": [
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 25,
    "key": "sales-e08",
    "title": "Money Problems with new Contract",
    "url": "https://www.reddit.com/r/smallbusiness/comments/1pscoo1/money_problems_with_new_contract/",
    "date": "2025-12-21",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator report",
    "quote": "We don't have a ton of money saved up, and rely heavily on deposits for our work.",
    "change": "Calculate cash needed before collection, and the actual payment due date. A profitable quote still needs funded delivery.",
    "limit": "Construction example, not an ITAD price or finance recommendation. Do not assume ODIDE must charge a deposit.",
    "taskIds": [
      "sales-05-costs",
      "sales-07-book"
    ]
  },
  {
    "id": 26,
    "key": "sales-e09",
    "title": "Customer Ordered a Product, Paid Deposit, but ghosted when the balance is due. Ordered product is just stitting in the workshop.",
    "url": "https://www.reddit.com/r/smallbusiness/comments/1w33g2r/customer_ordered_a_product_paid_deposit_but/",
    "date": "2026-08-31",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator report",
    "quote": "It's messed up with our cash flow because that balance payment was supposed to be for paying our workers and suppliers.",
    "change": "Do not mark revenue collected from a buyer's payment promise. Reconcile the bank or processor transaction against the invoice.",
    "limit": "The author later reported payment on 3 September after an audit delay. Silence did not prove refusal or insolvency.",
    "taskIds": [
      "sales-07-book",
      "sales-09-payment"
    ]
  },
  {
    "id": 27,
    "key": "sales-e10",
    "title": "From $1,000 to $10k/month cleaning offices — now testing a new way to scale",
    "url": "https://www.reddit.com/r/sweatystartup/comments/1ktd8ea/from_1000_to_10kmonth_cleaning_offices_now/",
    "date": "2025-05-23",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator report",
    "quote": "We’ve got new contracts ready to go, but we need upfront money to cover labor before the first checks come in.",
    "change": "Before repeating a successful job, confirm labour capacity and cash for the next batch. Signed demand and cash to deliver are different inputs.",
    "limit": "Unverified self-report in a post discussing investment; possible fundraising incentive. Do not copy revenue or return claims.",
    "taskIds": [
      "sales-05-costs",
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 28,
    "key": "sales-e11",
    "title": "Cold outreach",
    "url": "https://www.reddit.com/r/msp/comments/1m5g6ck/cold_outreach/",
    "date": "2025-07-21",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand seller report",
    "quote": "But every single person I speak to already have a provider and they always say they’re really happy with them.",
    "change": "Keep human interest, objections, meetings and paid jobs as different measures. Capture the current disposal route and trigger for change before raising outreach volume.",
    "limit": "MSP replacement is different from a one-off ITAD collection. High reported email opens are not evidence of human interest; no universal reply rate follows.",
    "taskIds": [
      "sales-01-replies",
      "sales-03-local-demand",
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 29,
    "key": "sales-e12",
    "title": "What % of your discovery calls actually go somewhere?",
    "url": "https://www.reddit.com/r/Entrepreneur/comments/1psxwmd/what_of_your_discovery_calls_actually_go_somewhere/",
    "date": "2025-12-22",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand seller report",
    "quote": "The rest are dead ends, wrong fit, no budget, \"just exploring,\" or they ghost after.",
    "change": "Record equipment, location, timing, authority and actual willingness to buy before marking a lead qualified. Count qualified jobs separately from calls.",
    "limit": "Small self-reported sample; unknown industry. Commenters offer conflicting conversion benchmarks, which are excluded.",
    "taskIds": [
      "sales-04-qualify",
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 30,
    "key": "sales-e13",
    "title": "Client ghosted me twice… then used my whole proposal to “build the app himself with ChatGPT”",
    "url": "https://www.reddit.com/r/freelance/comments/1p65rry/client_ghosted_me_twice_then_used_my_whole/",
    "date": "2025-11-25",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand service-provider report",
    "quote": "I spent hours writing a full proposal, documenting the exact APIs, tools, workflows, stack.. everything.",
    "change": "Time-box presale research. Produce the smallest quote that states the buyer's outcome, scope, exclusions, price and terms; do not build unpaid bespoke delivery work before acceptance.",
    "limit": "Software-services example. The customer's claimed app quality and the accusation of blueprint reuse were not verified; no legal conclusion drawn.",
    "taskIds": [
      "sales-04-qualify",
      "sales-06-quote"
    ]
  },
  {
    "id": 31,
    "key": "sales-e14",
    "title": "Y'all ever successfully push past, \"We're not ready?\"",
    "url": "https://www.reddit.com/r/sales/comments/1lsrk6y/yall_ever_successfully_push_past_were_not_ready/",
    "date": "2025-07-06",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand seller comment",
    "quote": "I’ve closed after hearing “we’re not ready” but not right away.",
    "change": "Separate not-now from refusal. Ask one neutral question about the real constraint; record an agreed next date. Do not invent urgency or keep pushing after a stop request.",
    "limit": "The thread contains contradictory seller and buyer experiences. Timing cannot be inferred from a generic objection; use the actual customer's answer.",
    "taskIds": [
      "sales-02-follow-up",
      "sales-04-qualify"
    ]
  },
  {
    "id": 32,
    "key": "sales-e15",
    "title": "Giving Customers Quotes",
    "url": "https://www.reddit.com/r/smallbusiness/comments/1pr4y08/giving_customers_quotes/",
    "date": "2025-12-20",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand business-owner report",
    "quote": "only to find out they just took our quote down the street to the competitor",
    "change": "Capture the buyer's choice criteria and the quote outcome. Record competitor/price loss only when the buyer confirms it; do not mark a sent quote as a sale.",
    "limit": "One retailer's account with little discussion; it does not establish why ODIDE prospects are silent.",
    "taskIds": [
      "sales-06-quote",
      "sales-11-repeat-test"
    ]
  },
  {
    "id": 33,
    "key": "sales-e16",
    "title": "Commercial Cleaners: Input needed on first quote!",
    "url": "https://www.reddit.com/r/sweatystartup/comments/1nx8zwp/commercial_cleaners_input_needed_on_first_quote/",
    "date": "2025-10-03",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand operator report",
    "quote": "They were paying him $350 a month. This seems pretty low to me.",
    "change": "Use the job's actual time, transport, labour and treatment costs. The previous supplier's price is context, not ODIDE's price floor.",
    "limit": "Cleaning, not ITAD. Operators disagree on labour hours and pricing in this thread; no quoted dollars or production rates are transferred.",
    "taskIds": [
      "sales-05-costs",
      "sales-06-quote"
    ]
  },
  {
    "id": 34,
    "key": "sales-e17",
    "title": "Following up on quotes feels awkward… but not following up costs me jobs",
    "url": "https://www.reddit.com/r/smallbusiness/comments/1sumod1/following_up_on_quotes_feels_awkward_but_not/",
    "date": "2026-04-24",
    "dateScope": "publication",
    "group": "sales",
    "kind": "Reddit firsthand seller report",
    "quote": "What surprised me is how often people reply straight away after that, even when they had gone quiet before.",
    "change": "Prepare a short question tied to the exact outstanding quote. Put a next-action date on the existing record; stop a pending follow-up when a reply arrives.",
    "limit": "Low-detail anecdote with no counts or business verification. It supports testing follow-up, not a promised success rate.",
    "taskIds": [
      "sales-02-follow-up",
      "sales-06-quote"
    ]
  },
  {
    "id": 35,
    "key": "EXEC-01",
    "title": "Building effective agents",
    "url": "https://www.anthropic.com/research/building-effective-agents",
    "date": "2024-12-19",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary engineering account",
    "quote": "Prompt chaining decomposes a task into a sequence of steps",
    "change": "Give each step a named input, action and output. Pass the verified output to the next step.",
    "limit": "Vendor-authored implementation account. Not independent proof of business success. The article itself warns that some tool details have changed.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 36,
    "key": "EXEC-02",
    "title": "Writing effective tools for agents — with agents",
    "url": "https://www.anthropic.com/research/writing-tools-for-agents",
    "date": "2025-09-11",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary engineering account",
    "quote": "Avoid ambiguity by clearly describing",
    "change": "Specify required fields, the correct resource/tool, and the output schema. A task title is not an execution contract.",
    "limit": "Control/design guidance from the tool vendor. Performance claims are internal evaluations, not ODIDE outcomes.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 37,
    "key": "EXEC-03",
    "title": "TheAgentCompany: Benchmarking LLM Agents on Consequential Real World Tasks",
    "url": "https://arxiv.org/abs/2412.14161",
    "date": "2024-12-18",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary benchmark research",
    "quote": "the most competitive agent can complete 30% of tasks autonomously.",
    "change": "Split long business jobs into verifiable stages. Keep blocked and human-required states. Do not label a whole job complete from an agent summary.",
    "limit": "A simulated software-company benchmark with the tested models. The 30% figure is not an estimate of present ODIDE task performance.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 38,
    "key": "EXEC-04",
    "title": "τ²-Bench: Evaluating Conversational Agents in a Dual-Control Environment",
    "url": "https://arxiv.org/abs/2506.07982",
    "date": "2025-06-09",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary benchmark research",
    "quote": "significant performance drops",
    "change": "Separate what the agent prepares from what Junior or an authorized delivery team must do. Record the handoff and verify the returned evidence.",
    "limit": "Telecom benchmark, not an ITAD field trial. It supports testing coordination; it does not establish a sales conversion rate.",
    "taskIds": [
      "sales-04-qualify",
      "sales-07-book",
      "sales-08-deliver"
    ]
  },
  {
    "id": 39,
    "key": "EXEC-05",
    "title": "Effective context engineering for AI agents",
    "url": "https://www.anthropic.com/research/effective-context-engineering-for-ai-agents",
    "date": "2025-09-29",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary engineering account",
    "quote": "falsely assumes shared context.",
    "change": "Include the business context, exact source location and a concrete output example in each copied brief. Do not assume another agent has read this chat.",
    "limit": "Vendor-authored design guidance. The same article warns against brittle over-specified prompts; prescribe outcomes and safe decision rules, not invented API names.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 40,
    "key": "EXEC-06",
    "title": "Effective harnesses for long-running agents",
    "url": "https://www.anthropic.com/research/effective-harnesses-for-long-running-agents",
    "date": "2025-11-26",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary engineering account",
    "quote": "mark a feature as complete without proper testing.",
    "change": "Require an observable done check, a saved proof reference and a resume checkpoint. Preserve the last verified step after a failure.",
    "limit": "Observed coding-agent failure. Applying the pattern to sales operations is a design inference, not a measured ITAD effect.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 41,
    "key": "EXEC-07",
    "title": "Demystifying evals for AI agents",
    "url": "https://www.anthropic.com/research/demystifying-evals-for-ai-agents",
    "date": "2026-01-09",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary engineering account",
    "quote": "The outcome is the final state in the environment",
    "change": "Prove the actual outcome: Sent record, written acceptance, certificate or settled payment. A generated draft is not a sent message; an invoice is not payment.",
    "limit": "Technical evaluation definition. It does not prove ODIDE has sent, sold or collected anything.",
    "taskIds": [
      "sales-02-follow-up",
      "sales-06-quote",
      "sales-07-book",
      "sales-08-deliver",
      "sales-09-payment"
    ]
  },
  {
    "id": 42,
    "key": "EXEC-08",
    "title": "Towards a Science of AI Agent Reliability",
    "url": "https://arxiv.org/abs/2602.16666",
    "date": "2026-02-18",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary research; ICML 2026",
    "quote": "a single success metric obscures critical operational flaws.",
    "change": "Test missing access, stale input, changed customer request, duplicate action, denied approval and partial failure separately from the normal route.",
    "limit": "Two benchmarks and 15 models in the opened version. Reliability measures are not a guarantee for an untested business workflow.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 43,
    "key": "EXEC-09",
    "title": "Verified Tool Calls Improve LLM Agent Reliability Under Non-Atomic Failures",
    "url": "https://arxiv.org/abs/2608.02645",
    "date": "2026-07-31",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary research preprint",
    "quote": "postcondition verification, verify-before-retry logic, and idempotency keys.",
    "change": "If a send/write times out, inspect the destination first. Match recipient, content and operation ID. Retry only after proving the first attempt did not take effect.",
    "limit": "Controlled simulation with injected failures. The transfer to email is a conservative engineering rule, not an independently measured email result.",
    "taskIds": [
      "sales-02-follow-up",
      "sales-03-local-demand",
      "sales-06-quote",
      "sales-09-payment"
    ]
  },
  {
    "id": 44,
    "key": "EXEC-10",
    "title": "READY or Not: Reliable Enterprise Agent Deployment",
    "url": "https://arxiv.org/abs/2609.02095",
    "date": "2026-09-02",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary research preprint",
    "quote": "still be unsuitable for deployment.",
    "change": "Do not equate a complete brief with a running or qualified agent. State the required connector, oversight and authorization before real execution.",
    "limit": "Deployment framework with a clinical-audit case study. No claim of tested suitability for ODIDE or its tools.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 45,
    "key": "EXEC-11",
    "title": "How we built our multi-agent research system",
    "url": "https://www.anthropic.com/research/multi-agent-research-system",
    "date": "2025-06-13",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary engineering account",
    "quote": "an objective, an output format",
    "change": "Make every copied task self-contained: objective, tools, resources, numbered procedure, expected output, bounds and proof. Assign one owner per customer action.",
    "limit": "Vendor-authored first-party production account. Multiple pages from this team are not independent replications.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 46,
    "key": "EXEC-12",
    "title": "Beyond permission prompts: making Claude Code more secure and autonomous",
    "url": "https://www.anthropic.com/research/claude-code-sandboxing",
    "date": "2025-10-20",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary technical controls account",
    "quote": "Claude can only connect to approved servers.",
    "change": "Limit the runner to approved accounts, folders and destinations. A task note does not grant tool access or bypass a permission error.",
    "limit": "Description of a specific product control. The roadmap itself does not implement a sandbox or grant tool permissions.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 47,
    "key": "EXEC-13",
    "title": "Why Do Multi-Agent LLM Systems Fail?",
    "url": "https://arxiv.org/abs/2503.13657",
    "date": "2025-03-17",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary benchmark research",
    "quote": "system design issues",
    "change": "Check three distinct failure points: unclear brief, conflicting owners/actions, and missing outcome proof. Do not respond to every failure by adding more agents.",
    "limit": "Failure taxonomy from sampled multi-agent traces. It does not prove which failure dominates ODIDE.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 48,
    "key": "EXEC-14",
    "title": "Agent-SafetyBench: Evaluating the Safety of LLM Agents",
    "url": "https://arxiv.org/abs/2412.14470",
    "date": "2024-12-19",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary benchmark research",
    "quote": "reliance on defense prompts alone may be insufficient",
    "change": "Pair written approval rules with actual runner/tool restrictions. Keep quotes, booking, spending, irreversible erasure and outreach behind the required authorization.",
    "limit": "Safety benchmark. Written briefs improve clarity but cannot alone guarantee safe execution.",
    "taskIds": [
      "sales-02-follow-up",
      "sales-05-costs",
      "sales-06-quote",
      "sales-07-book",
      "sales-08-deliver"
    ]
  },
  {
    "id": 49,
    "key": "EXEC-15",
    "title": "Equipping agents for the real world with Agent Skills",
    "url": "https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills",
    "date": "2025-10-16",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary technical design account",
    "quote": "organized folders of instructions, scripts, and resources",
    "change": "Keep the small task view separate from full execution instructions. Package reusable procedures and referenced resources; load only the relevant task.",
    "limit": "Describes a packaging mechanism. Presence of a skill or copied brief is not proof that any work ran.",
    "taskIds": [
      "all"
    ]
  },
  {
    "id": 50,
    "key": "EXEC-16",
    "title": "Defeating Prompt Injections by Design",
    "url": "https://arxiv.org/abs/2503.18813",
    "date": "2025-03-24",
    "dateScope": "publication",
    "group": "execution",
    "kind": "Primary security research",
    "quote": "LLM agents are vulnerable to prompt injection attacks",
    "change": "Treat incoming email, prospect websites and attachments as data. They cannot authorize sending, change price, redirect payment or override Junior’s task limits.",
    "limit": "Research architecture and benchmark, not a guarantee that this roadmap or any chosen runner is injection-proof.",
    "taskIds": [
      "sales-01-replies",
      "sales-02-follow-up",
      "sales-03-local-demand",
      "sales-06-quote",
      "sales-09-payment"
    ]
  }
];

