CONSTRUCTION ERP – DETAILED BUSINESS REQUIREMENT DOCUMENT (BRD)

For Contractor / Builder (B2B Project Execution Focus)

1. Business Context

The system is intended for a construction contractor organization executing projects for clients (not selling directly to end customers).

The ERP must act as a central control system for:

Multi-site project execution
Cost control and margin protection
Material and procurement management
Document governance and approvals
Workforce and contractor handling

The system must eliminate:

Manual tracking (Excel, WhatsApp, paper)
Uncontrolled purchases and payments
Material leakage and stock mismatch
Version confusion in drawings
Lack of real-time project visibility
2. Core System Objectives

The ERP must ensure:

2.1 Financial Control
Every rupee spent is linked to:
Project
Material
Vendor
Approval
2.2 Real-Time Visibility
Management must see:
Site progress
Budget vs actual
Delays
Risks
2.3 Process Standardization
Defined workflows for:
Procurement
Approvals
Document handling
Payments
2.4 Audit & Accountability
Every action must be:
Logged
Traceable
Attributed to a user
3. Functional Requirements (Module-wise Deep Breakdown)
3.1 PROJECT / SITE MANAGEMENT
Core Requirement

System must maintain each construction site as a complete operational entity.

Detailed Requirements
Project Setup
Unique project/site ID auto-generated
Capture:
Client details
Location (multi-level: city, state, GPS optional)
Project type (residential, commercial, infra)
Contract value
Start & end date
Project Structuring
Support Work Breakdown Structure (WBS):
Phase → Activity → Task
Each task must support:
Planned start/end
Dependencies
Assigned team
Progress Tracking
Progress must be trackable:
% completion per activity
Weighted project completion
Manual and measurable tracking supported
Budget Management
Define:
Total project budget
Budget per activity/category
Track:
Committed cost
Actual cost
Variance
Delay Tracking
Identify:
Delayed activities
Critical path impact
Highlight delay reasons
Site-Level Cost Visibility
Show cost split:
Material
Labour
Machinery
Overheads
3.2 MATERIALS & INVENTORY MANAGEMENT
Core Requirement

System must maintain central + site-level inventory control with full traceability.

Detailed Requirements
Material Master
Unique SKU
Category classification
Unit of measurement (multiple units supported)
HSN + GST %
Stock Management
Maintain:
Central warehouse stock
Site-level stock
Real-time quantity update
Stock Movements

Every movement must capture:

Type:
Purchase receipt
Site transfer
Consumption
Return
Source & destination
Linked project/site
User and timestamp
Consumption Tracking
Material consumption must be:
Linked to project activity
Measured vs planned usage
Reorder Management
Define:
Minimum stock level
System must:
Auto-flag low stock
Provide reorder suggestions
Stock Accuracy Controls
Physical vs system stock reconciliation
Adjustment entries with approval
3.3 PROCUREMENT & VENDOR MANAGEMENT
Core Requirement

Ensure controlled purchasing with cost validation and audit trail.

Detailed Requirements
Vendor Management
Maintain:
Vendor profile
GSTIN
Material categories
Payment terms
Vendor classification:
Approved / Blocked / Under Review
Purchase Requisition
Raised by site/user
Must include:
Material
Quantity
Required date
Project/site
Purchase Order (PO)
Generated only after approval
Must include:
Rate
Taxes
Delivery location
Must support:
Partial deliveries
Goods Receipt (GRN)
Record actual received quantity
Capture:
Shortage / excess
Quality remarks
3-Way Matching

System must match:

PO vs GRN vs Vendor Invoice
Rate Analysis
Maintain historical pricing
Compare vendor rates
Vendor Performance

Track:

Delivery delays
Quality issues
Order fulfillment %
3.4 FINANCIAL & COST CONTROL
Core Requirement

Provide accurate project-level financial tracking and control.

Detailed Requirements
Cost Allocation

Every cost must be linked to:

Project
Cost head
Vendor/material/labour
Budget vs Actual
Real-time variance calculation
Alert on budget breach
Commitment Tracking
Track:
Approved POs
Pending liabilities
Payment Tracking
Track:
Due payments
Paid amounts
Overdue liabilities
Cash Flow Visibility
Project-wise cash requirement view
3.5 DOCUMENT & DRAWING MANAGEMENT
Core Requirement

Provide single source of truth for all project documents.

Detailed Requirements
Document Storage
Site-wise document repository
Categories:
Drawings
Contracts
Permits
Reports
Version Control
Maintain:
Revision history
Current active version
Approval Status
Each document must have:
Draft / Review / Approved / Rejected
Expiry Tracking
Track validity of:
Licenses
Approvals
Alert before expiry
Access Control
Role-based visibility
Search Capability
Search by:
Project
Document type
Version
3.6 APPROVAL WORKFLOW SYSTEM
Core Requirement

Ensure no critical action happens without authorization.

Detailed Requirements
Approval Configuration
Define workflows based on:
Document type
Amount thresholds
Project
Approval Types
Purchase approvals
Payment approvals
Drawing approvals
Budget approvals
Workflow Behavior
Sequential approvals
Parallel approvals (if needed)
Status Tracking
Pending / Approved / Rejected / Returned
Audit Trail
Capture:
Approver
Time
Comments
Notifications
Notify pending approvers
Escalate delays
3.7 HUMAN RESOURCE & LABOUR MANAGEMENT
Core Requirement

Manage employees, site staff, and contractor labour efficiently.

Detailed Requirements
Employee Management
Maintain:
Personal details
Role
Salary structure
Site Allocation
Assign employees to sites
Attendance Management
Daily attendance tracking:
Staff
Labour
Labour Handling Models
Individual labour tracking
Contractor-based labour tracking
Payroll Calculation
Based on:
Attendance
Wage rate
Overtime
Contractor Billing
Compare:
Actual labour vs billed labour
Compliance Tracking
PF, ESIC, labour laws
3.8 DASHBOARD & REPORTING
Core Requirement

Provide real-time decision-making insights.

Detailed Requirements
Management Dashboard
Project status summary
Budget vs actual
Delayed projects
Cost overrun alerts
Inventory Dashboard
Low stock items
High consumption materials
Financial Reports
Project profitability
Expense breakdown
Operational Reports
Material usage reports
Vendor performance reports
Labour productivity
4. Non-Functional Requirements
4.1 Security
Role-based access control
Data access restrictions per role
Secure authentication
4.2 Auditability
Every action must be logged
No data deletion without trace
4.3 Scalability
Support:
Multiple projects
Multiple locations
Large data volume
4.4 Performance
Real-time updates for:
Inventory
Dashboard
Fast search and retrieval
4.5 Data Integrity
Prevent duplicate entries
Validation rules for all inputs
5. User Roles (Indicative)
Admin / Management
Project Manager
Site Engineer
Procurement Officer
Accountant
HR Manager

Each role must have controlled access based on responsibility.

6. Key Business Risks Addressed

The system must reduce:

Material theft / wastage
Unapproved purchases
Payment leakage
Project delays due to miscommunication
Cost overruns
Document mismanagement
7. Success Criteria

System is considered successful if:

Real-time project visibility is achieved
Budget overruns are reduced
Procurement leakage is minimized
Manual tracking is eliminated
Decision-making becomes data-driven