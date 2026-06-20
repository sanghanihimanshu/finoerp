**CONSTRUCTION ERP**

**Feature & Module Reference**

*A complete breakdown of every module — built and proposed — for a site-based construction company: project tracking, material inventory, document & approval workflow, sales & purchase, and HR.*

# **Overview**

This document lists every module proposed for the construction ERP, grouped by what's already built and working in the demo, and what's scoped for the next phase. Each module is broken down feature by feature, with a plain-English explanation of what it does and why a construction company specifically needs it.

| STATUS | MODULES |
| :---- | :---- |
| Requirement Only – now make prototype | 1\. Projects (Site Management) 2\. Materials & Inventory 3\. Overview Dashboard 4\. Site Documents & Drawing Management 5\. Approvals Workflow 6\. Sales (Client/Booking) 7\. Purchase (Vendor/Procurement) 8\. Human Resources |

**MODULE 1**

## **Module 1: Projects (Site Management)**

Purpose: track every construction site as a live record — budget, timeline, progress, and material usage in one place.

| Feature | What it does |
| :---- | :---- |
| **Site registry** | Every project gets a unique site code (e.g. SITE-014), client name, location, and status. |
| **Status tracking** | Four states: Planning → Active → On Hold → Completed, colour-coded so a manager can scan the list and know what's live. |
| **Budget vs. spend** | Each site has a sanctioned budget and a running “spent” total — shows remaining budget and flags overspend. |
| **Progress tracking** | A 0–100% completion marker per site, shown as a progress bar. |
| **Timeline** | Start date and target completion date, so delays are visible at a glance. |
| **Material allocation per site** | Drill into any site and see which materials are committed to it, how much was allocated vs. actually consumed, and usage %. |
| **Sorted site list** | Active sites surface first, so the team isn't scrolling past completed/on-hold sites to find what matters today. |

| WHY IT MATTERS *This is the screen a site manager opens every morning to know how every site is doing, without compiling a manual status report.* |
| :---- |

**MODULE 2**

## **Module 2: Materials & Inventory**

Purpose: a live stock register for every material used across all sites — what's in stock, what's low, what's been used where, and at what cost.

| Feature | What it does |
| :---- | :---- |
| **Material catalog** | Every material has an SKU, name, category (Cement, Steel, Aggregate, Bricks, Electrical, Plumbing, Finishing) and unit of measure. |
| **GST & HSN compliance fields** | Each material carries its HSN code and applicable GST% — built for Indian tax compliance, not a foreign template. |
| **Dual pricing display** | Rate shown both excluding and including GST — quick costing without manual tax math. |
| **Stock level tracking** | Current quantity on hand per material, always up to date. |
| **Reorder alerts** | Each material has a reorder threshold; anything at or below it is flagged automatically across the dashboard and inventory list. |
| **Category filtering** | Filter the full inventory by material type — useful when an engineer only cares about, say, plumbing stock. |
| **Stock movement ledger** | Every stock-in (delivery) and stock-out (site consumption) is logged with date, quantity, site, and a note — a full audit trail, not just a snapshot. |
| **Live stock recording** | A simple form to record a delivery or consumption event — quantity updates immediately and the ledger updates in real time. |
| **Supplier tracking** | Each material is linked to its supplier, so a low-stock alert tells you who to call, not just what's short. |

| WHY IT MATTERS *Material shortages and over-ordering are universal pain points on Indian sites. The GST/HSN fields also signal the system was built for the Indian market specifically.* |
| :---- |

**MODULE 3**

## **Module 3: Overview Dashboard**

Purpose: a single screen that answers “what needs my attention today” across every site and every material — the first thing anyone sees on login.

| Feature | What it does |
| :---- | :---- |
| **Site status summary** | Count of sites in each status (active/planning/on-hold/completed) at a glance. |
| **Budget burn snapshot** | Total committed budget vs. total spent across active/planning sites, with a visual burn-rate bar. |
| **Reorder watchlist** | Materials currently at or below reorder level, pulled live — no digging through the full inventory list. |
| **Recent activity feed** | The latest stock movements across the whole company — who moved what, where, and when. |

| WHY IT MATTERS *This is the proof-of-concept moment in a demo — a stock movement recorded on the Materials page shows up here instantly, proving the system is connected end-to-end.* |
| :---- |

**MODULE 4**

## **Module 4: Site Documents & Drawing Management**

Purpose: a central, version-controlled place for every paper a construction site generates — so nobody works off an outdated drawing or a document forwarded on WhatsApp.

| Feature | What it does |
| :---- | :---- |
| **Document repository per site** | Every site has its own folder: architectural drawings, structural drawings, soil test reports, site photos, contracts. |
| **Version control** | Each drawing/document keeps a revision history (Rev 0, Rev 1, Rev 2...) so the team always knows which version is current and what changed. |
| **Document categories** | Drawings, legal/land documents, government permits (RERA registration, building plan sanction, fire NOC, environment clearance), contracts, site photos and progress reports. |
| **Approval status per document** | Each document shows whether it is Draft, Submitted, Under Review, Approved, or Rejected. |
| **Expiry tracking** | Licenses and permits (labour licence, fire NOC, pollution clearance, etc.) often need renewal — the system flags upcoming expiries before they lapse. |
| **Access by role** | Site engineers see drawings; only admin/management see contracts and legal documents. |
| **Linked to site record** | Every document is tagged to its project, so opening a site shows its complete document trail in one place. |
| **Search & retrieval** | Find any document by site, category, or revision number instead of digging through email threads or shared drives. |

| WHY IT MATTERS *Lost or outdated drawings cause rework, disputes, and compliance risk. A single source of truth for site paperwork is one of the most requested features by construction clients moving off manual systems.* |
| :---- |

**MODULE 5**

## **Module 5: Approvals Workflow**

Purpose: route plans, drawings, purchase requests, and payments through a defined sign-off chain — so nothing moves forward without the right person's say.

| Feature | What it does |
| :---- | :---- |
| **Configurable approval chains** | Define who must approve what — e.g. a drawing needs Site Engineer → Project Manager → Architect sign-off in sequence. |
| **Plan & drawing approvals** | Architectural and structural drawing revisions go through formal approval before being marked “for construction”. |
| **Purchase approval thresholds** | Purchase orders above a set value automatically require a senior approval before the order is released to the vendor. |
| **Payment release approvals** | Vendor and contractor payments are held for approval before disbursal, reducing unauthorised payouts. |
| **Approval status tracking** | Every item shows where it currently sits in the chain — Pending, Approved, Rejected, Returned for revision. |
| **Notifications & reminders** | Approvers are notified when something is waiting on them, and reminded if it sits too long. |
| **Audit trail** | Every approval decision is logged with who approved it, when, and any comments — useful for audits and dispute resolution. |

| WHY IT MATTERS *Construction companies lose money to unauthorised purchases and unapproved design changes. A formal approval trail protects the business and gives management real control without slowing down daily work.* |
| :---- |

**MODULE 6**

## **Module 6: Sales (Client & Booking Management)**

Purpose: manage the commercial side of a project from the buyer's perspective — bookings, payment milestones, and client communication.

| Feature | What it does |
| :---- | :---- |
| **Lead & enquiry tracking** | Capture enquiries for units/plots/projects and track them from first contact through to booking. |
| **Unit/plot inventory** | For a real-estate-linked construction business: track which units, plots, or flats are available, booked, or sold per project. |
| **Booking & agreement records** | Record booking amount, buyer details, and link to the sale agreement document. |
| **Payment milestone schedule** | Define a construction-linked payment plan (e.g. 10% on booking, 20% on plinth, 20% on slab) and track what's due, paid, and overdue per client. |
| **Invoicing with GST** | Generate GST-compliant invoices for each milestone payment, with correct HSN/SAC codes for real estate/construction services. |
| **Outstanding dues dashboard** | See which clients are behind on payments across all projects, sorted by how overdue they are. |
| **Client communication log** | Track calls, site visits, and follow-ups per client/lead in one place instead of scattered notes. |

| WHY IT MATTERS *For builders who sell units as they build, cash flow depends entirely on collecting milestone payments on time. A live overdue-dues view is often the single most valuable screen for the finance team.* |
| :---- |

**MODULE 7**

## **Module 7: Purchase (Vendor & Procurement Management)**

Purpose: manage the buying side — vendors, purchase orders, and incoming material costs — tightly linked to the Materials module.

| Feature | What it does |
| :---- | :---- |
| **Vendor/supplier directory** | Master list of suppliers with contact details, GSTIN, material categories supplied, and payment terms. |
| **Purchase requisition** | Site staff raise a request for material; it routes through approval (see Module 5\) before becoming a purchase order. |
| **Purchase order generation** | Auto-generate a PO with quantities, agreed rate, GST, and delivery site — ready to send to the vendor. |
| **Goods receipt note (GRN)** | Record what actually arrived against the PO, flagging shortages or excess deliveries before payment is released. |
| **Vendor bill matching** | Match the vendor's invoice against the PO and GRN (3-way match) to catch billing discrepancies before payment. |
| **Vendor payment tracking** | Track what's owed to each vendor, payment due dates, and payment history. |
| **Rate comparison history** | See historical rates paid to different vendors for the same material — useful leverage in future negotiations. |
| **Vendor performance log** | Track delivery delays or quality issues per vendor over time, informing future vendor selection. |

| WHY IT MATTERS *Procurement is where construction companies most often lose margin — through inflated rates, undocumented shortages, or paying for goods never received. A PO → GRN → invoice match closes that gap.* |
| :---- |

**MODULE 8**

## **Module 8: Human Resources**

Purpose: manage the people side of the business — office staff, site engineers, and labour/contractor workforce — including attendance and payroll.

| Feature | What it does |
| :---- | :---- |
| **Employee master records** | Profile for every employee: role, site assignment, contact details, joining date, salary structure, and documents (Aadhaar, PAN, etc.). |
| **Site-wise staff assignment** | See which engineers, supervisors, and staff are currently assigned to which site. |
| **Labour/contractor attendance** | Daily attendance marking for site labour — either individually or via a contractor headcount, depending on how the client manages workforce. |
| **Wage & payroll calculation** | Calculate wages based on attendance, daily rate, or piece-rate work, and generate a payroll run for office staff and direct labour. |
| **Contractor labour billing** | For labour supplied via a contractor, track agreed rate per worker/day and reconcile against the contractor's bill at month-end. |
| **Leave management** | Track leave requests and balances for permanent/office staff. |
| **Statutory compliance records** | Track PF, ESIC, and labour licence details where applicable — relevant for sites above the threshold headcount requiring compliance. |
| **HR documents** | Store offer letters, ID proofs, and contracts per employee, similar in spirit to the site document module but scoped to people. |

| WHY IT MATTERS *Labour cost is typically the second-largest cost on a construction site after materials. Accurate attendance-to-payroll tracking, especially for contractor-supplied labour, directly protects margin and reduces disputes over wages.* |
| :---- |

# **Module Summary Table**

| \# | Module | Core Focus |
| :---: | :---- | :---- |
| 1 | **Projects (Site Management)** | Budget, progress, timeline per site |
| 2 | **Materials & Inventory** | Stock, GST/HSN, reorder, ledger |
| 3 | **Overview Dashboard** | Cross-site live summary |
| 4 | **Site Documents & Drawings** | Version control, permits, expiry alerts |
| 5 | **Approvals Workflow** | Sign-off chains for plans, POs, payments |
| 6 | **Sales (Client & Booking)** | Bookings, milestone payments, dues |
| 7 | **Purchase (Vendor & Procurement)** | PO, GRN, vendor bill matching |
| 8 | **Human Resources** | Attendance, payroll, contractor labour |

*Prepared for client demo and proposal purposes. Modules marked “Phase 2” can be scoped and quoted individually based on the client's priority order.*