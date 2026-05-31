<h1 align="center">
  <img src="https://drive.google.com/uc?export=view&id=1k3M2aIN6iLAGwOemHoExV5qD2-9IP5j1" alt="HiddenGems Logo" width="36" />
  &nbsp;HiddenGems
</h1>

<p align="center">
  Discover and support Singapore's home-based businesses.
</p>

<p align="center">
  <a href="https://hiddengems-five.vercel.app/">Live App</a> -
  <a href="https://github.com/Ruitingg/hiddengems">GitHub Repo</a>
</p>

<p align="center">
  NUS Orbital 2026 - Apollo 11
  <br/>
  Charlize Nicole Sia | Tan Rui Teng
</p>

---

## Table of Contents

1. [Motivation](#motivation)
2. [Aim](#aim)
3. [Proposed Level of Achievement](#proposed-level-of-achievement)
4. [User Stories](#user-stories)
5. [Features](#features)
6. [Tech Stack](#tech-stack)
7. [System Architecture](#system-architecture)
8. [Database Schema](#database-schema)
9. [Wireframes and Mockups](#wireframes-and-mockups)
10. [Software Engineering Practices](#software-engineering-practices)
11. [Testing Plan](#testing-plan)
12. [Known Limitations](#known-limitations)
13. [Planned Features - Milestone 2 and 3](#planned-features---milestone-2-and-3)
14. [Live Deployment](#live-deployment)
15. [Running Locally](#running-locally)

---

## Motivation

Home-based businesses (HBBs) in Singapore - bakers, nail artists, craft sellers, and private dining hosts - are hard to discover and even harder to trust. They rely entirely on Instagram and TikTok algorithms they cannot control, take orders through informal WhatsApp DMs, and have no formal payment, review, or scheduling system. Customers who find a great HBB have no reliable way to find them again, and HBB owners have no tools to manage orders, track performance, or build a loyal customer base.

There is currently no platform in Singapore built specifically for HBBs. Carousell is built for secondhand goods. Facebook Marketplace lacks trust signals. Instagram is a social feed, not a marketplace. HiddenGems aims to fill that gap - giving every HBB a professional presence and giving every customer a trustworthy place to discover and support local businesses.

## Aim

HiddenGems is a mobile-first Progressive Web App that helps people in Singapore discover home-based businesses, and gives HBB owners the tools they need to run and grow their business without needing a developer or a social media following.

We aim to:
- Give every HBB a free, verified profile page with their services, portfolio, reviews, and contact information - discoverable by any customer in Singapore
- Replace informal DM-based ordering with a structured in-app order flow that handles availability, lead times, and deposit collection automatically
- Build customer trust through business verification, verified buyer reviews, and a transparent performance metric called the Charm Score
- Reward customers for supporting local businesses through a platform-wide Gem Points loyalty system with linked cross-business loyalty pools
- Enable CDC Voucher payments so HBBs benefit from Singapore's government-supported local spending scheme
- Give owners a simple analytics dashboard to track orders, identify best-sellers, and plan for peak periods

## Proposed Level of Achievement

Apollo 11

## User Stories

**As a customer, I want to:**
1. Search and filter HBBs by name, category, area, and price so that I can find businesses relevant to what I need
2. View a verified HBB profile with photos, reviews, menu, and contact details so that I can decide whether to order
3. Place an order in-app with a chosen date, time slot, and pickup or delivery option so that I do not need to DM the owner separately
4. Earn Gem Points on every completed order and redeem them for discounts so that I am rewarded for supporting local businesses
5. Leave a review only after a confirmed completed order so that I can contribute trustworthy feedback to the platform
6. Apply CDC Vouchers at checkout so that I can support local HBBs using the government voucher scheme

**As an HBB owner, I want to:**
1. Create a profile page with my products, portfolio photos, and contact details so that customers can discover my business
2. Set my availability slots so that customers can only book times I am actually free
3. Receive and manage orders in a dashboard so that I can track what needs to be fulfilled and by when
4. See analytics on my views, orders, and best-sellers so that I can make informed decisions about my business
5. Post announcements and stories so that I can keep my followers updated on new batches, promotions, and availability
6. Receive a verified badge on my profile so that customers trust my listing is legitimate

**As a platform admin, I want to:**
1. Review and approve or reject HBB verification requests so that only legitimate businesses are listed on the platform

## Features

### Core Features - Built in Milestone 1

| Feature | Description |
|---|---|
| HBB Discovery Directory | Searchable, filterable listings with real-time name search, category filter (Food / Beauty / Crafts), and area dropdown. Each card shows business name, category, area, Charm Score, and verified badge. Data fetched live from Supabase. |
| HBB Profile Page | Individual profile showing business name, category, area, about section, contact and socials, portfolio photo gallery, menu or services with prices, and Charm Score. |
| User Authentication | Email and password login and registration via Supabase Auth. Role-based access - owners see the Owner Dashboard, customers see the Discovery page. |
| Owner Dashboard | Authenticated dashboard for owners. Coming Soon sections for Orders, Products, and Analytics planned for Milestone 2. |
| Charm Score | Composite trust score shown on every HBB listing card. Calculated from completed orders, review ratings, response rate, and verification status. |
| Verified Badge | Displayed on HBB cards and profile pages for businesses approved through the admin verification flow. |
| PWA Installation | Web App Manifest and Service Worker configured. App can be installed from the live Vercel URL on iOS and Android home screens |

### Core Features - Planned for Milestone 2

| Feature | Description |
|---|---|
| Business Verification and Onboarding | Owner submits a verification request. Admin reviews and approves. Verified badge displayed on approved profiles. |
| In-App Ordering Flow | Customer selects items, picks a date and time slot, selects pickup or delivery, and confirms with a deposit. Lead time and slot availability validated automatically. |
| Availability Calendar and Batch Slots | Owner sets available dates and slot limits. Customers see a live availability calendar. Slots auto-close when full. |
| Verified Buyer Reviews | Reviews gated to customers with a confirmed completed order. Photo upload supported. |
| Owner Profile Management | Owners can create and edit their own HBB profile, products, portfolio, and availability from within the app. |
| Announcements and Stories | Owners can post updates, new batch announcements, and short-form stories visible to followers and on their profile. |

### Extension Features - Planned for Milestone 3

| Feature | Description |
|---|---|
| Gem Points Loyalty System | Points earned on every completed order, redeemable for discounts. Linked loyalty pools allow partner HBBs to share a rewards pool across businesses. |
| CDC Voucher Payments | Customers can pay using Singapore CDC Vouchers at checkout. |
| Stripe and PayNow Payments | Card payments via Stripe and PayNow QR code at checkout. |
| Owner Analytics Dashboard | Revenue charts, best-seller rankings, demand heatmap by month, and exportable order summaries. |
| Admin Verification Panel | In-app admin interface for reviewing and actioning HBB verification requests. |
| Google Maps Integration | Area-based discovery with map view showing nearby HBBs. |
| Push Notifications | Followers receive push notifications when an HBB posts a new batch or promotion. |
| Smart Recommendation Engine | Recommends HBBs based on customer preferences, occasion, and Charm Score to reduce discovery friction. |

## Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend | React + Vite | Component-based architecture, fast development server, well-documented, integrates directly with the Supabase JavaScript client |
| Styling | Tailwind CSS | Utility-first CSS that is fast to learn and produces clean, responsive layouts without custom CSS files |
| Backend and Database | Supabase (PostgreSQL) | Managed PostgreSQL with a built-in REST API, authentication, file storage, and Edge Functions - removes the need for a separate backend server |
| Authentication | Supabase Auth | Built-in email and password login with role-based access control and minimal setup required |
| Image Storage | Supabase Storage | Portfolio and review photo uploads handled without a separate storage service |
| Server-side Logic | Supabase Edge Functions | Lightweight serverless functions for Charm Score calculation, order validation, and notification triggers - planned for Milestone 2 |
| Payments | Stripe API | Best-documented payment API with PayNow support and a full test mode - planned for Milestone 3 |
| Deployment | Vercel | Zero-config deployment connected directly to GitHub - auto-deploys on every push to main |
| PWA | Web App Manifest + Service Worker | Enables the app to be installed on any phone home screen without App Store or Play Store submission |

## System Architecture

![Architecture Diagram](https://drive.google.com/uc?export=view&id=1fYY2TSqZhtNRTBU7byj3R9hWnnTvlPIa)

## Database Schema

11 tables created in Supabase PostgreSQL with explicit foreign key constraints and NOT NULL constraints enforcing data integrity. Row Level Security policies will be applied in Milestone 2.

| Table | Purpose |
|---|---|
| `users` | All user accounts with role (customer / owner / admin) and profile information |
| `hbb_profiles` | HBB business details - name, category, area, about, charm_score, verified status, owner foreign key |
| `products` | Items or services listed by each HBB - name, description, price, linked to hbb_profiles |
| `availability` | Available date and time slots set by each owner - date, time, max slots, slots remaining |
| `orders` | Customer orders linked to user, HBB, products, and availability slot - tracks order status |
| `reviews` | Customer reviews gated to completed orders, supports photo upload, linked to order foreign key |
| `points` | Gem Points balance and full transaction history per user |
| `notifications` | In-app notifications - order updates, points earned, flash deals, new gems nearby |
| `verification_requests` | Owner submissions for admin review - business name, supporting documents, status |
| `portfolio_items` | Photos uploaded by owners to showcase their work - linked to hbb_profiles |
| `loyalty_pools` | Linked pools shared between partner HBBs - enables cross-business point earning and redemption |

![ER Diagram](https://drive.google.com/uc?export=view&id=1oZmYa59GbsDeWIzDj2mbBaTWTkGfq76a)

## Wireframes and Mockups

### Built - Milestone 1

**Login and Create Account**

<img src="https://drive.google.com/uc?export=view&id=1ojhgidDG90hCYjSN4KkALvCj_U04qs15" width="250" alt="Login"/>

**Discovery Page**

<img src="https://drive.google.com/uc?export=view&id=1rPccnqWM-gUt3kBvKx471twrnPvNG2-f" width="250" alt="Discovery"/>

**HBB Profile Page**

<img src="https://drive.google.com/uc?export=view&id=1qfSZ-94i3Tcj_RoSDjoIh-w_qyfbqoFM" width="250" alt="Profile"/>

**Owner Dashboard**

<img src="https://drive.google.com/uc?export=view&id=1FBBtR1ipMDYBpYPFgLZdP3MHkQIKbiYY" width="250" alt="Dashboard"/>

### Designed - Milestone 2 and 3

**Notifications**

<img src="https://drive.google.com/uc?export=view&id=1CAgMicBu7I9tMJPyTlmrciVbf5U-GcgR" width="250" alt="Notifications"/>

**Order and Booking Flow**

<img src="https://drive.google.com/uc?export=view&id=1AcsAZwp0_PWukKUruAaLS_WZbUPhZi08" width="250" alt="Order Booking"/>

**Seller Dashboard**

<img src="https://drive.google.com/uc?export=view&id=1CsfljSI7x-kyl4DibFxQAlL_0h8-uSq9" width="250" alt="Seller Dashboard"/>

**My Gems - Loyalty and Points**

<img src="https://drive.google.com/uc?export=view&id=16FX90fAeQqnPB_cRjNkib59Ia0dsbRQe" width="250" alt="Gems"/>

## Software Engineering Practices

**1. Agile Development with Sprints**

Development is structured into two-week sprints aligned to each Orbital milestone. Tasks are tracked on a GitHub Projects Kanban board with columns for backlog, in progress, review, and done. A weekly sync is used to review progress and address blockers.

**2. Version Control and Branching**

All code is managed on GitHub using a feature-branch workflow. Each feature or bug fix is developed on a dedicated branch (e.g. `feature/discovery-filters`, `fix/auth-redirect`). Pull requests require peer review before merging into main. A separate development branch is maintained to avoid disrupting the live Vercel deployment while work is in progress.

**3. Component-Based Architecture and Separation of Concerns**

The frontend separates code into four clear layers:
- `src/pages/` - page-level components (DiscoveryPage, ProfilePage, AuthPage, DashboardPage)
- `src/components/` - reusable UI components (HBBCard, Navbar, DiamondIcon, ProtectedRoute)
- `src/hooks/` - custom React hooks encapsulating repeated data access logic
- `src/lib/` - Supabase client and utility functions

**4. Environment Variable Security**

Supabase keys are stored in `.env` and never committed to the repository. A `.env.example` file documents required variable names with blank values for any developer cloning the repo.

**5. CI/CD Pipeline**

Vercel is connected directly to GitHub. Every push to main triggers an automatic production deployment with no manual steps required. This gives a complete CI/CD loop throughout development.

**6. Mobile-First Design**

Built with Tailwind CSS mobile-first utility classes. All pages are tested on real devices at the live Vercel URL across iOS and Android.

## Testing Plan

Testing will be introduced from Milestone 2 onward:

- **Unit tests (Vitest):** Core logic functions - Charm Score computation, points balance updates, lead time calculator, and slot availability checks - will each have dedicated unit tests run on every pull request via GitHub Actions.
- **Integration tests:** Supabase query functions and authentication flows (sign up, login, role redirect, session persistence) will be tested against a dedicated test database.
- **End-to-end tests (Playwright):** Critical user flows - signing up, creating a profile, placing an order, leaving a verified review, and redeeming points - will be covered by automated browser tests run against a staging environment before each milestone submission.

## Known Limitations

The following are known limitations in the Milestone 1 proof of concept that will be resolved in Milestone 2:

- **Email confirmation is disabled:** Supabase email confirmation has been turned off for development so test accounts can be created instantly. This will be re-enabled in Milestone 2 with proper email templates configured.
- **Manual users table entry required:** When a new account is registered via Supabase Auth, a corresponding row in the `users` table must currently be created manually via the Supabase dashboard. A database trigger will automate this in Milestone 2.
- **RLS policies not yet implemented:** Row Level Security is currently disabled on all tables during development. Full RLS policies ensuring owners can only access their own data and customers can only access their own orders will be applied in Milestone 2.
- **Owner profile not linked to HBB listings:** Owners can log in and see the dashboard, but the dashboard does not yet display their linked HBB profile. This connection will be built in Milestone 2.
- **No order flow:** The ordering feature is fully designed and mockuped but not yet built. It is the primary goal for Milestone 2.

## Planned Features - Milestone 2 and 3

**Milestone 2 (end of June 2026)**
- Business verification and admin review flow
- Owner profile creation and editing
- In-app ordering with availability calendar, lead time validation, and deposit collection
- Verified buyer review system with photo upload
- Charm Score calculation via Supabase Edge Function
- Announcements and stories for owners
- Unit and end-to-end test suite

**Milestone 3 (end of July 2026)**
- Stripe and PayNow payment integration
- CDC Voucher redemption at checkout
- Gem Points loyalty system with cross-business loyalty pools
- Owner analytics dashboard
- Admin verification panel
- Google Maps area-based discovery
- Push notifications for followers
- AI-assisted recommendation engine

## Live Deployment

**https://hiddengems-five.vercel.app/**

The following features are live and testable:
- Register and log in as a customer or owner
- Browse the Discovery page - search by name, filter by category and area, view real HBB listings from Supabase
- Click any HBB card to view the full profile - about, portfolio, menu with prices, contact and socials, Charm Score
- Log in as an owner to see the Owner Dashboard
- Install as a PWA from the live URL on iOS or Android

**Test accounts:**

| Role | Email | Password |
|---|---|---|
| Owner | owner@gmail.com | 123456 |
| Customer | customer@gmail.com | 78910 |

## Running Locally

```bash
# Clone the repository
git clone https://github.com/Ruitingg/hiddengems.git
cd hiddengems

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Open .env and fill in your Supabase project URL and anon key

# Start the development server
npm run dev
```

Required environment variables (see `.env.example`):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

*HiddenGems - NUS Orbital 2026 - Apollo 11*