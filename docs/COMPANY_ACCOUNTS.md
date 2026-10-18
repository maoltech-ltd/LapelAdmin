# SharedDrive for Business (company accounts)

Companies can register on the landing site, fund a company ride wallet, invite their staff, and have
staff rides charged to the company at a discounted business rate. Platform admins approve companies and
set each company's discount.

This document is identical in every repo on the `v3` branch (Lapel, Lapel-Admin, LapelAdmin,
SharedDrive, share-drive-landing, maol_service, maol_payment). Section 6 says what changed in each repo.

---

## 1. The flow

```
 Landing site (/business)                 Lapel                                   Lapel-Admin / LapelAdmin
 ─────────────────────────                ─────                                   ────────────────────────
 1. Company fills the registration form ─► POST /companies/register
                                           • creates the owner's SharedDrive account
                                           • creates Company (PENDING_APPROVAL)
                                           • creates the company wallet holder + wallet
                                           • OWNER membership
                                           • "company-registered" email
                                                                                   2. Admin reviews the company,
                                                                                      sets its discount ("business
                                                                                      rate") and approves it → ACTIVE
                                                                                      • "company-status-changed" email
 3. Owner signs in to /business/dashboard
    • funds the company wallet ──────────► POST /companies/{id}/wallet/fund ──► maol_payment checkout
    • invites staff (one by one or CSV) ─► POST /companies/{id}/invites
                                           • "company-staff-invitation" email / SMS
                                           • in-app + push notice if the email already has an account

 SharedDrive app (staff)
 4. Staff open the invite link (https://sharedrive.ng/business/join?code=XXXX) or type the code
    in Account → My company ─────────────► POST /companies/join  { code }
 5. When booking, staff switch on "Pay with company" ─► POST /ride-bookings/book { …, paymentSource: "COMPANY" }
    • fare = gross fare − company discount (+ the usual device / notification charges)
    • checked against the staff member's monthly budget and the company wallet balance
 6. Driver approves the request ──────────► company wallet is debited (not the staff member's)
    Cancellations / never-started rides refund the company wallet.
```

### Statuses

| Company status      | Staff can join | Staff can charge rides | Wallet funding | Invites |
|---------------------|:-:|:-:|:-:|:-:|
| `PENDING_APPROVAL`  | yes | **no** | yes | yes |
| `ACTIVE`            | yes | yes | yes | yes |
| `SUSPENDED`         | no  | no  | yes | no  |
| `REJECTED`          | no  | no  | no  | no  |

Setting `COMPANY_AUTO_APPROVE=true` on Lapel skips review (new companies start `ACTIVE`). Use this for
dev and staging only.

### Roles inside a company

| Role    | Who | Can |
|---------|-----|-----|
| `OWNER` | the person who registered | everything, and is the only role that can change roles or remove admins |
| `ADMIN` | invited with role `ADMIN` by the owner | fund the wallet, invite/remove staff, set budgets, view reports |
| `STAFF` | everyone else | charge rides to the company within their budget |

A user can be an active member of **one** company at a time. The owner can't leave or be removed.
Ownership transfer isn't supported yet; support has to do it in the database.

---

## 2. Money model

* **Company wallet.** Every company gets a dedicated, non-login "wallet holder" user (`role = COMPANY_WALLET`,
  `Company.walletUserId`). Its ordinary Lapel wallet *is* the company wallet. Funding, debits, refunds and
  history therefore reuse the existing wallet code and the existing maol_payment checkout. maol_payment credits
  whichever user Lapel signs the request as (`X-User-Id`), so **maol_payment needs no changes** and holds no
  company logic (see the maol_payment scope rule).
  * The wallet holder's email is the company contact email. If that address already belongs to a user (usually
    the owner), it becomes a plus-address such as `billing+company-ab12cd34ef56@acme.com`, so provider receipts
    still land in the same inbox.
* **Business rate (discount).** Admin-only fields on `Company`:
  `discountActive`, `discountPercentage` (0–90), `maxDiscountPerRide` (₦, 0 = no cap),
  `discountStartsAt`, `discountEndsAt`, `discountNote`.
  The discount applies when it is active and `now` is inside the window:
  `discount = min(grossFare × pct / 100, maxDiscountPerRide if > 0, grossFare)`.
* **Fare for a company-paid ride:** `fare = (grossFare − companyDiscount) + deviceCharge + notificationCharge`.
  First-ride-free and coupons are **not** applied on company rides, because personal promos aren't stacked onto
  company money.
* **Driver earnings are unchanged.** Drivers are still paid on the gross fare minus commission, so the discount is
  a platform-funded cost, the same as coupons today.
* **Monthly budget per staff member.** `CompanyMember.monthlyBudget` overrides `Company.defaultMonthlyBudget`.
  `null` on both means unlimited. Spend is the sum of `fare` for that member's company-paid orders created this
  calendar month in any non-cancelled status (`CREATED`, `CONFIRMED`, `ONGOING`, `DRIVER_COMPLETED`, `COMPLETED`,
  `CANCEL_REQUESTED`, `DISPUTED`). Pending requests count, so parallel requests can't overshoot the budget.
* **Order fields** added to `orders`: `paymentSource` (`WALLET` | `COMPANY`; `null` on older orders means
  `WALLET`), `companyId`, `payerId` (the wallet that is debited/refunded), `companyDiscountAmount`.
  `Order.resolvePayerId()` falls back to `passengerId`.
* Wallet transaction IDs are unchanged (`order_<id>`, `refund_order_<id>`), so the company wallet's history
  categorises them as ride payments and refunds.

### Error codes (HTTP 402, in `meta.errorCode`)

| errorCode | When | Client behaviour |
|-----------|------|------------------|
| `INSUFFICIENT_WALLET_BALANCE` | personal wallet too low (existing) | offer top-up |
| `INSUFFICIENT_COMPANY_BALANCE` | company wallet too low, at booking or when the driver confirms | tell staff to ask their company admin; **don't** offer a personal top-up. `meta.requiredAmount` only, because staff never see the company balance |
| `COMPANY_BUDGET_EXCEEDED` | ride is more than the member's remaining monthly budget | show `meta.remainingBudget`; offer "pay from my wallet instead" |

Other company booking failures are 403/400 with a readable `message` (not a member, company pending or
suspended, removed before the driver confirmed).

---

## 3. Lapel API (`/api/v1/{device}/companies`)

All responses use the standard `ApiResponseDto` envelope (`code`, `message`, `success`, `data`, `meta`).
`{device}` is `web` for the landing site and the app's usual device segment for SharedDrive.

| Method & path | Auth | Who | Body / query → `data` |
|---|---|---|---|
| `POST /companies/register` | **public** | new owner | `RegisterCompanyRequest` → `{ token, user, company }`. 409 with `meta.errorCode=ACCOUNT_EXISTS` if the email already has an account (sign in, then use `POST /companies`) |
| `POST /companies` | JWT | any user not in a company | `CompanyProfileRequest` → `CompanyDto` |
| `GET /companies/me` | JWT | member | → `MyCompanyDto` (404 if not in a company) |
| `POST /companies/me/leave` | JWT | ADMIN/STAFF | → null |
| `GET /companies/join/{code}` | **public** | anyone | → `CompanyInvitePreviewDto` (company name, masked email, `valid`) |
| `POST /companies/join` | JWT | invitee | `{ code }` → `MyCompanyDto` |
| `PUT /companies/{id}` | JWT | OWNER/ADMIN | `CompanyProfileRequest` → `CompanyDto` (also sets `defaultMonthlyBudget`; `null` = unlimited) |
| `GET /companies/{id}/wallet` | JWT | OWNER/ADMIN | → `{ companyId, balance, availableBalance, currency, spentThisMonth }` |
| `POST /companies/{id}/wallet/fund` | JWT | OWNER/ADMIN | same payload as `/payments/wallet/fund` (`amount`, `provider`, `checkout_mode`, `redirect_url`, …) → checkout (`checkoutUrl`, `reference`, …) |
| `POST /companies/{id}/wallet/fund/verify` | JWT | OWNER/ADMIN | `{ provider, reference \| transaction_id }` |
| `GET /companies/{id}/wallet/transactions` | JWT | OWNER/ADMIN | same query as `/wallets/transactions/history` → `WalletTransactionPageDTO` |
| `GET /companies/{id}/members` | JWT | OWNER/ADMIN | → `CompanyMemberDto[]` (with `spentThisMonth`, `effectiveMonthlyBudget`, `remainingThisMonth`) |
| `PUT /companies/{id}/members/{memberId}` | JWT | OWNER/ADMIN (roles: OWNER only) | `{ role?, monthlyBudget?, useCompanyDefaultBudget?, department? }` → `CompanyMemberDto` |
| `DELETE /companies/{id}/members/{memberId}` | JWT | OWNER/ADMIN | → null |
| `POST /companies/{id}/invites` | JWT | OWNER/ADMIN | `{ invites: [{ email?, phoneNumber?, name?, role?, monthlyBudget?, department? }] }` (max 200) → `{ created: CompanyInviteDto[], skipped: [{ email, phoneNumber, reason }] }` |
| `GET /companies/{id}/invites` | JWT | OWNER/ADMIN | → `CompanyInviteDto[]` |
| `DELETE /companies/{id}/invites/{inviteId}` | JWT | OWNER/ADMIN | revoke a pending invite |
| `POST /companies/{id}/invites/{inviteId}/resend` | JWT | OWNER/ADMIN | re-sends, and re-opens an expired invite |
| `GET /companies/{id}/rides` | JWT | OWNER/ADMIN | `memberUserId?, from?, to? (yyyy-MM-dd), page, size` → `{ content: CompanyRideDto[], page, size, totalElements, totalPages, totalSpent }` |

Booking: `POST /ride-bookings/book` (and `/orders/book`) accept a new optional `paymentSource: "COMPANY"`.
`OrderDto` now includes `paymentSource`, `companyId` and `companyDiscountAmount`.

### Request shapes

```jsonc
// POST /companies/register
{
  "company": {
    "name": "Acme Logistics Ltd",          // required
    "registrationNumber": "RC123456",
    "industry": "Logistics",
    "companySize": "51-200",
    "address": "12 Admiralty Way", "city": "Lagos",
    "website": "https://acme.ng",
    "contactEmail": "billing@acme.ng",      // defaults to the owner email
    "contactPhone": "+2348000000000",
    "defaultMonthlyBudget": 50000           // optional, ₦ per staff per month
  },
  "firstName": "Ada", "lastName": "Obi",
  "email": "ada@acme.ng", "phoneNumber": "+2348011111111",
  "password": "Str0ng!pass"                 // same rules as normal signup
}
```

Invite codes are 8 characters from `A–Z` and `2–9` (no `0/O/1/I`). Codes are case-insensitive and single-use,
and expire after `COMPANY_INVITE_EXPIRY_DAYS` (default 14). An invite is not tied to a specific email
address: whoever redeems the code first joins. Admins can see who joined and remove them.

### Lapel configuration

| Env var | Default | Purpose |
|---|---|---|
| `COMPANY_INVITE_BASE_URL` | `https://sharedrive.ng/business/join` | link in invite emails (`?code=` is appended) |
| `COMPANY_INVITE_EXPIRY_DAYS` | `14` | invite lifetime |
| `COMPANY_PORTAL_URL` | `https://sharedrive.ng/business/dashboard` | link in the registration email |
| `COMPANY_AUTO_APPROVE` | `false` | skip admin review (dev/staging only) |

### Mongo collections

* `companies`: `Company` (owned by Lapel; Lapel-Admin writes status and discount fields)
* `company_members`: unique partial index on `userId` where `status = ACTIVE`
* `company_invites`: unique `code`
* `orders`: new fields above; `companyId` is indexed

---

## 4. Admin API (Lapel-Admin, `/api/v1/{device}/companies`)

Admins write directly to the shared Mongo collections, the same way as the other Lapel-Admin modules.
Permissions: `COMPANY_READ`, `COMPANY_UPDATE`.

| Method & path | Permission | Purpose |
|---|---|---|
| `GET /companies?search&status&from&to&page&size&sortBy&sortDirection` | COMPANY_READ | paged list |
| `GET /companies/stats/status` | COMPANY_READ | counts per status |
| `GET /companies/{id}` | COMPANY_READ | detail: profile, discount, owner, wallet balance, member count, spend this month |
| `GET /companies/{id}/members` | COMPANY_READ | active members with user details |
| `GET /companies/{id}/invites` | COMPANY_READ | invites |
| `GET /companies/{id}/rides?page&size` | COMPANY_READ | company-paid orders |
| `POST /companies/{id}/approve` `{ reason? }` | COMPANY_UPDATE | `PENDING_APPROVAL`/`REJECTED` → `ACTIVE` |
| `POST /companies/{id}/reject` `{ reason }` | COMPANY_UPDATE | `PENDING_APPROVAL` → `REJECTED` |
| `POST /companies/{id}/suspend` `{ reason }` | COMPANY_UPDATE | `ACTIVE` → `SUSPENDED` |
| `POST /companies/{id}/reactivate` | COMPANY_UPDATE | `SUSPENDED` → `ACTIVE` |
| `PUT /companies/{id}/discount` | COMPANY_UPDATE | `{ discountActive, discountPercentage (0–90), maxDiscountPerRide (≥0), discountStartsAt?, discountEndsAt?, discountNote? }` |

Each status change emails the owner with the `company-status-changed` template.

---

## 5. Notifications (maol_service templates)

| Template | Sent by | Data |
|---|---|---|
| `company-staff-invitation` | Lapel | name, inviterName, companyName, roleName, inviteCode, invitationLink, expiry, appName, supportName |
| `company-registered` | Lapel | name, companyName, statusMessage, portalLink, appName, supportName |
| `company-status-changed` | Lapel-Admin | name, companyName, statusLabel, statusMessage, portalLink, appName, supportName |

Invites sent to a phone number only go out as SMS through the existing `ride-notification` SMS template.
Push and in-app notification types: `COMPANY_INVITE` (metadata `companyId`, `inviteCode`),
`COMPANY_MEMBER_JOINED`, `COMPANY_MEMBER_REMOVED`.

---

## 6. What changed in each repo (v3)

### Lapel (core backend)
- New `company` package: models `Company`, `CompanyMember`, `CompanyInvite`; enums; repositories; `CompanyService(Impl)`; and
  `CompanyController` serving every endpoint in section 3.
- Registration creates the owner account (through `UserService.createUser`), the company, the wallet holder user
  (`role=COMPANY_WALLET`, a random password nobody knows, provisioned through `PaymentProvisioningService.ensureProvisioned`)
  and the OWNER membership. If wallet provisioning fails, the wallet holder is deleted and the request returns 502.
- `OrderServiceImpl`:
  - At **booking**, `paymentSource: COMPANY` resolves the membership (`resolveCompanyPayment`), applies the company
    discount in place of coupons/first-ride-free, checks the monthly budget and then the company wallet balance.
  - At **confirmation**, it re-checks the company and membership (`ensureCompanyCanStillPay`), then debits `order.resolvePayerId()`.
  - On **cancellation or refund**, it credits `order.resolvePayerId()`.
- `Order`/`OrderDto`/`OrderRequestDto` gained the company fields, and there is a new `order/enums/PaymentSource`.
- `NotificationPublisher`: `sendCompanyStaffInvitationEmail` and `sendCompanyRegisteredEmail`.
- `SecurityConfig` and `JwtRequestFilter`: `/companies/register` and `/companies/join/*` are public.
- `application.properties`: the `company.*` keys from section 3.

### Lapel-Admin (admin backend)
- New `company` package with mirror models of `companies`, `company_members` and `company_invites`, and `CompanyController` at
  `/api/v1/{device}/companies` covering every endpoint in section 4.
- The detail endpoint returns profile, status and approval, business rate, owner, company wallet balance (read from `wallets`,
  `_id = walletUserId`), active member and pending invite counts, and spend this month.
- Status and discount writes are targeted `$set` updates. The allowed starting status is checked inside the update (a lost race
  returns 409), and `version` is bumped so a stale Lapel save fails instead of undoing the change. The acting admin's email is recorded.
- Reject is allowed only from `PENDING_APPROVAL` (suspend an active company instead). Reject and suspend need a reason.
  Discount rules: 0–90 %, cap ≥ 0, end after start, and it can't be switched on at 0 %.
- Every status or business-rate change publishes `company-status-changed` to the owner (falling back to the contact email).
  A publish failure is logged and doesn't fail the request.
- `Order`/`OrderDto` gained the company fields. New permissions `COMPANY_READ` (all seeded roles) and `COMPANY_UPDATE`
  (SUPER_ADMIN, MANAGEMENT, ADMIN, FINANCE).

### LapelAdmin (admin dashboard)
- New **Companies** page (`/companies`, needs `COMPANY_READ`): status count cards, search/status/date filters, and a paged
  table (name, owner/contact, status, members, discount, wallet balance, created).
- Detail drawer: profile, owner, wallet balance, spend this month, counts, current business rate.
  - With `COMPANY_UPDATE`: status buttons (approve / reject / suspend / reactivate, each behind a confirmation modal) and the
    business-rate form (on/off, %, max per ride, start/end, note).
  - Activity tabs: members, invites, and paged company rides.
- `lib/api/services/companyService.ts`, `lib/types/company.types.ts`, and a nav item in `lib/utils/navItems.ts`.

### share-drive-landing (website)
- `/business`: marketing (hero, benefits, five steps) plus the registration form (`POST /companies/register`). A 409
  `ACCOUNT_EXISTS` sends the user to sign in, then register from the dashboard (`POST /companies`).
- `/business/login` (`POST /users/login`) and `/business/dashboard` (client-only, noindex). Owners and admins get these tabs:
  - **Overview:** status banner, rate, balance, spend, staff count.
  - **Wallet:** fund by payment link, verified when the user comes back to `?funding=1`; history.
  - **Staff:** edit budget, department and role; remove.
  - **Invites:** single, or bulk CSV sent in chunks of 200; copy link, resend, revoke.
  - **Rides:** filter by member and date range; total spent.
  - **Company profile.**

  STAFF members only see a pointer to the app.
- `/business/join?code=`: public invite preview, the code with a copy button, "Open in web app"
  (`https://app.sharedrive.ng/?companyInvite=CODE`) and store badges.
- `lib/businessApi.ts` keeps the JWT in localStorage `sd_business_token`; a 401 goes back to login. The API base comes from
  `NEXT_PUBLIC_LAPEL_API_URL` (default `https://api.sharedrive.ng/lapel/api/v1/web`), listed in `.env.example`.
- "For Business" is in the header and footer, `/business` and `/business/join` are in the sitemap, and the
  `apple-app-site-association` file includes `/business/join*`.
- The form's password rule matches Lapel's signup rule exactly. The only special characters allowed are `@ # $ % ^ & + =`.

### SharedDrive (Flutter app)
- Account → Settings → **My company / Join a company** (`lib/features/company/presentation/company_screen.dart`):
  - Join by invite code, with a preview before confirming, and a link to sharedrive.ng/business to register.
  - **Staff** see status, business rate, monthly budget used/remaining and whether they can charge rides, and can leave the company.
  - **Owners/admins** also get the company wallet (fund by payment link and verify), staff management, invites (create, share,
    resend, revoke) and company rides (`company_admin_sections.dart`).
- **Booking:** a "Pay with company" switch sends `paymentSource: "COMPANY"` and skips the personal wallet check. It shows the
  estimated company rate, the budget left and "Charged to <company>".
  - The two company 402 codes get company-specific dialogs (never the personal top-up), with "Pay from my wallet" as a fallback.
  - Orders show "Paid by company".
- **Invite links:** `https://sharedrive.ng/business/join?code=…` (Android App Link added in `AndroidManifest.xml`) and
  `?companyInvite=CODE` on web are queued until sign-in. They open My company with the code filled in, as do
  `COMPANY_INVITE` notifications.
- **Company funding return:** checkouts that come back through the OS deep link or a web reload are verified against the
  company endpoint. `PendingWalletPaymentStore` now records the companyId.
- Checkout parsing moved from `wallet_screen.dart` into `lib/features/payments/checkout_response.dart`. The personal wallet
  works the same as before.

### maol_service (notifications)
- New email templates `src/templates/email/company-staff-invitation.ts`, `company-registered.ts` and
  `company-status-changed.ts` (brand colours), listed with their required data in `docs/message-pattern.txt`.
  No queue or consumer changes.

### maol_payment (payments)
- **No code changes, on purpose.** Company wallets are ordinary user wallets that belong to the wallet holder user. Lapel signs
  funding requests as that user, and maol_payment credits it through the normal queue. Every company rule (approval, budgets,
  discounts) lives in Lapel. This document is the only change.

---

## 7. Deployment checklist

1. Deploy maol_service first so the templates exist, then Lapel, Lapel-Admin, LapelAdmin, the landing site and the app.
2. **Create the Mongo indexes by hand.** `spring.data.mongodb.auto-index-creation` isn't enabled, so `@Indexed` doesn't create them:
   ```js
   db.company_invites.createIndex({ code: 1 }, { unique: true })
   db.company_invites.createIndex({ companyId: 1 })
   db.company_members.createIndex({ userId: 1 }, { unique: true, partialFilterExpression: { status: "ACTIVE" } })
   db.company_members.createIndex({ companyId: 1, status: 1 })
   db.companies.createIndex({ walletUserId: 1 }, { unique: true })
   db.companies.createIndex({ status: 1 })
   db.orders.createIndex({ companyId: 1, paymentSource: 1, created_at: -1 })
   ```
3. **Lapel env:** set `COMPANY_INVITE_BASE_URL`, `COMPANY_PORTAL_URL` and, on staging only, `COMPANY_AUTO_APPROVE=true`.
   **Lapel-Admin env:** `COMPANY_PORTAL_URL`. **Landing env:** `NEXT_PUBLIC_LAPEL_API_URL`.
4. **Admin roles:** existing roles aren't re-seeded. Add `COMPANY_READ` / `COMPANY_UPDATE` under Roles & Permissions, then have
   admins log in again (permissions are cached in the session).
5. **Clocks:** run Lapel and Lapel-Admin in the same timezone (Africa/Lagos). Discount windows and "this month" use local server
   time, and the admin form sends local date-times.
6. **Universal links:** the landing site serves the updated `apple-app-site-association`. Android uses the existing `assetlinks.json`.

## 8. Known limitations / follow-ups

- Company pay covers single bookings (`/ride-bookings/book`). Recurring join requests and ride payment plans still charge the
  passenger's own wallet.
- **Budget gap:** when the company has a default monthly budget, an individual member can't be set to "unlimited". Either use
  the company default or set a custom amount.
- **Invites aren't tied to an email address:** whoever redeems the code first joins. Codes are single-use and admins can remove members.
- No ownership transfer, and the owner can't leave.
- Wallet holder users (`role=COMPANY_WALLET`) appear in the raw users collection and admin user lists. They can't log in.
- **App gaps:** no in-app company wallet history, profile/default-budget editing, company creation or bulk CSV invites. Those are
  on the web dashboard; the gateway methods exist.
- The discount shown at booking in the app is an estimate. The backend's figure is final, and `OrderDto.companyDiscountAmount`
  has it.
- **Not tested end to end:** nothing has been run against a live Mongo, RabbitMQ or maol_payment. The Java backends compile, the
  web projects type-check (the landing site also builds), and `flutter analyze` shows no new issues.
- **Possible pre-existing bug (not changed):** on web, `WalletScreen._fund` clears the pending provider right after
  `launchUrl(_self)`. Depending on timing, a personal top-up that returns by page reload may report "not completed".
