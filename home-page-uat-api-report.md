# UAT Home Page Performance Optimization Report

**Date:** 22 June 2026
**Page:** https://uatcxotv.techplusmedia.com/
**Prepared by:** Ramkumawat
**HAR Source:** `uatcxotv.techplusmedia.com.har`

---

## Executive Summary

The UAT homepage currently makes **48 backend API calls** per page load, while only **26 unique endpoints** exist. This means **22 calls (46%) are unnecessary duplicates** caused by component re-rendering issues.

### Key Findings

| Metric | Current Value |
|---|---:|
| Total backend API calls | 48 |
| Unique API endpoints | 26 |
| Duplicate calls (waste) | 22 (46%) |
| Non-backend network calls | 14 |

### Recommendation

Implement a **3-phase optimization plan** over 4 weeks to reduce API calls from 48 to 0-3 per page load — a **94% reduction**.

---

## Current State Analysis

### API Calls by Section

| Section | Calls | Duplicates | Root Cause |
|---|---:|---:|---|
| Section top cards | 20 | 10 | Array re-creation on each render |
| NewsSection | 12 | 6 | Array re-creation on each render |
| TwoCategoryData (block 1) | 4 | 2 | Array re-creation on each render |
| TwoCategoryData (block 2) | 4 | 2 | Array re-creation on each render |
| Navbar | 2 | 0 | — |
| Footer | 1 | 1 | Duplicate dispatch with Navbar |
| HomeSlider | 2 | 0 | — |
| Home ads | 1 | 0 | — |
| Header social popup | 1 | 0 | — |
| Innovation Shorts | 1 | 0 | — |
| **Total** | **48** | **22** | — |

### Root Causes (Plain Language)

1. **Configuration arrays recreated on every render** — The home page defines category lists and section names inside the component. Each time the page re-renders (which happens frequently due to loading states), these lists are recreated as new objects. Child components see them as "changed" and re-fetch data unnecessarily.

2. **Footer duplicates Navbar's data fetch** — Both the navigation bar and the footer request the same menu data on page load, even though it's identical.

3. **Social media links fetched eagerly** — The social media popup component fetches its data on page load, even though the popup is hidden by default and most users never open it.

4. **Server-side pre-fetch is broken** — The code attempts to load ads data on the server before sending to the browser, but a property name mismatch means this data is always empty, forcing a redundant client-side fetch.

---

## Optimization Roadmap

### Phase 1: Quick Wins

**Duration:** 3.35 hours
**Impact:** Eliminate all 22 duplicate calls
**Risk:** Very Low

| Change | Description | Impact |
|---|---|---|
| Stabilize configuration arrays | Move static category lists outside the component so they don't get recreated on each render | Eliminates 20 duplicate API calls |
| Remove Footer duplicate fetch | Stop the footer from requesting menu data that Navbar already provides | Eliminates 1 duplicate call |
| Lazy-load social media links | Only fetch social media data when the user opens the popup, not on page load | Eliminates 1 unnecessary call |
| Fix server-side ads pre-fetch | Correct the property name so server-side data loading works as intended | Fixes broken feature, prevents redundant client fetch |

**After Phase 1:** 48 calls → 26 unique calls (zero duplicates)

---

### Phase 2: Server-Side Pre-Fetching

**Duration:** 6-8 hours
**Impact:** Move data loading from browser to server
**Risk:** Medium

| Change | Description | Impact |
|---|---|---|
| Server-side navigation data | Load categories and menu items on the server before sending HTML to browser | 2 fewer client-side calls, faster initial render |
| Aggregate home page data | Create a single server-side request that fetches all home page data at once instead of 26 individual browser calls | Reduces client calls from 26 to 0-3 |

**After Phase 2:** 26 client calls → 0-3 client calls

---

### Phase 3: Caching Layer

**Duration:** 4-5 hours
**Impact:** Prevent redundant calls even if duplicates occur
**Risk:** Low

| Change | Description | Impact |
|---|---|---|
| Request deduplication | If the same API request is already in progress, share the response instead of making a new request | Safety net against future regressions |
| Response caching with TTL | Cache API responses for 60 seconds (matching existing page cache interval) | Prevents redundant calls within cache window |

**After Phase 3:** 0-3 client calls with caching safety net

---

### Phase 4: Long-term Architecture (Backlog)

**Duration:** 10-20 hours
**Impact:** Zero duplicates by design
**Risk:** High (requires full regression testing)

| Change | Description | Impact |
|---|---|---|
| Migrate to RTK Query | Replace manual data fetching with a built-in caching and deduplication system | Automatic deduplication and caching |
| Consolidate API calls | Combine multiple category requests into fewer bulk requests | Reduces backend load |
| Increase page cache duration | Extend from 60 seconds to 5 minutes with automatic refresh when content changes | Fewer page rebuilds |

---

## Implementation Timeline

```
Week 1: Phase 1 — Quick Wins (3.35 hours)
  ├── Stabilize configuration arrays (0.5h)
  ├── Remove Footer duplicate (0.25h)
  ├── Lazy-load social media (0.25h)
  └── Fix server-side ads bug (0.1h)

Week 2-3: Phase 2 — Server-Side Pre-Fetching (6-8 hours)
  ├── Server-side navigation data (3-4h)
  └── Aggregate home page data (3-4h)

Week 3-4: Phase 3 — Caching Layer (4-5 hours)
  ├── Request deduplication (2h)
  └── Response cache with TTL (2-3h)

Backlog: Phase 4 — Long-term Architecture
  ├── RTK Query migration (10-16h)
  └── Strapi bulk queries (3-4h)
```

---

## Expected Business Impact

### Performance Improvements

| Metric | Before | After Phase 1 | After Phase 2 |
|---|---:|---:|---:|
| Backend API calls | 48 | 26 | 0-3 |
| Duplicate calls | 22 | 0 | 0 |
| Server requests per user | 48 | 26 | 1-3 |
| Page load time | Baseline | ~30% faster | ~70% faster |

### User Experience

- **Faster page load** — Users see content sooner
- **Reduced server load** — Backend handles 94% fewer requests
- **Better SEO** — Improved Core Web Vitals scores
- **Mobile improvement** — Especially beneficial for slower connections

### Cost Savings

- Reduced server compute costs (fewer API requests)
- Reduced bandwidth usage
- Improved capacity handling during traffic spikes

---

## Risk Assessment

| Change | Risk Level | Mitigation |
|---|---|---|
| Stabilize arrays | Very Low | Pure refactor, no behavior change |
| Remove Footer fetch | Low | Navbar always renders first |
| Lazy-load social media | Low | Data loads on-demand with loading state |
| Fix server-side bug | Very Low | Bug fix, not a behavior change |
| Server-side pre-fetch | Medium | Thorough testing required |
| Caching layer | Low-Medium | Short TTL, automatic invalidation |
| RTK Query migration | High | Full regression testing needed |

---

## Appendix A: All API Endpoints

### Backend API Calls (26 unique)

| Section | Endpoint |
|---|---|
| Header | `/api/social-media-links` |
| Navbar | `/api/categories?populate[0]=subcategories&pagination[pageSize]=60` |
| Navbar/Footer | `/api/navbars?populate[0]=list&populate[1]=list.image` |
| Ads | `/api/costom-ads?populate=image` |
| HomeSlider | `/api/news?populate=*&sort=publishedAt:DESC&pagination[pageSize]=30` |
| Trending | `/api/news?populate=*&filters[$or][0][categories][name][$eq]=Trending%20News&filters[$or][1][subcategories][name][$eq]=Trending%20News&sort=publishedAt:DESC` |
| Shorts | `/api/shortss?populate=*&sort=publishedAt:DESC&pagination[pageSize]=1` |
| Section ×10 | `/api/news?populate=*&sort=publishedAt:DESC&filters[$or][0][categories][name][$eq]={name}&filters[$or][1][subcategories][name][$eq]={name}&pagination[pageSize]=1` |
| NewsSection ×6 | `/api/news?populate=*&filters[$or][0][categories][name][$eq]={name}&filters[$or][1][subcategories][name][$eq]={name}&sort=publishedAt:DESC` |
| TwoCategory ×4 | `/api/news?populate=*&filters[$or][0][categories][name][$eq]={name}&filters[$or][1][subcategories][name][$eq]={name}&sort=publishedAt:DESC` |

### Section Top Card Names (10 endpoints)

Tech Priorities, Tech Thursday, Interviews, CFO Playbook, Developers, Cyberwatch, CXO Talk, Marketing Mondays, Talks with Kalpana, CEO Talk

### NewsSection Categories (6 endpoints)

Tech Thursday, BFSI, Health Technology, Education Technology, Marketing Mondays, Technology

### TwoCategoryData Categories (4 endpoints)

Technology, Interviews, what's popular, editor's choice

---

## Appendix B: Non-Backend Network Calls

The HAR also captured 14 non-backend requests (Next.js route prefetches and third-party services):

| Type | URL |
|---|---|
| Route prefetch | `https://uatcxotv.techplusmedia.com/Innovation?_rsc=7n24v` |
| Route prefetch | `https://uatcxotv.techplusmedia.com/innovation` |
| Route prefetch | `https://uatcxotv.techplusmedia.com/cfo-playbook/...` |
| Route prefetch | `https://uatcxotv.techplusmedia.com/cyberwatch/...` |
| Route prefetch | `https://uatcxotv.techplusmedia.com/developers/...` |
| Route prefetch | `https://uatcxotv.techplusmedia.com/interviews/...` |
| Route prefetch | `https://uatcxotv.techplusmedia.com/technology/...` |
| YouTube | `https://www.youtube.com/getDatasyncIdsEndpoint` |
| YouTube | `https://www.youtube.com/youtubei/v1/log_event?alt=json` ×2 |
| Google | `https://googleads.g.doubleclick.net/pagead/id` |
| Google | `https://www.gstatic.com/youtube/img/lottie/...` ×2 |
| Google | `https://jnn-pa.googleapis.com/$rpc/google.internal.waa.v1.Waa/GenerateIT` |

These are not backend API calls and are not included in the optimization count.

---

*End of Report*
