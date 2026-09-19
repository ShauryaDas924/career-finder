# Privacy

## Scope

This document describes the behavior implemented by the Where to Look application. It is an engineering record of the current privacy posture, not a promise about every service operated by the hosting provider or by external resource owners.

Where to Look is intentionally privacy-light: it presents a curated directory and lets a visitor search and filter that directory in the browser.

## What the application does not implement

The source code contains no:

- account, sign-in, or user-profile system
- application-owned user database
- resume upload or storage
- job-application storage or tracking
- favorites or saved-resource feature
- analytics, advertising, or behavioral-tracking integration
- contact or resource-suggestion submission
- cookie-setting logic
- `localStorage`, `sessionStorage`, or IndexedDB use

The “Suggest a resource” control opens an informational dialog. It explicitly says that no contact method is configured and does not collect or send a submission.

## Search and filter data

Search text, the active category, the active college year, and the expanded/collapsed library state are React component state held in memory. They are not written to browser storage, included in the URL, or sent to an application API. Reloading the page resets them. The college-year filter does not create a student profile or change this privacy posture.

The resource dataset is bundled with the application. The browser does not send a query to resource providers when a visitor types into the guide.

## First-party requests and hosting

Visitors request the application, its JavaScript and CSS, the favicon, and the social image from the deployment host. The repository does not add custom analytics or telemetry to those requests.

The hosting platform and network infrastructure may still process ordinary operational information such as IP addresses, user agents, timestamps, request paths, security events, and error logs. Their collection and retention are controlled outside this repository. Review the active OpenAI Sites and Cloudflare settings and policies before making public claims about hosting-level data.

For that reason, do not summarize this posture as “the site collects zero data.” A precise statement is: **the application does not implement collection or storage of personal information, but its hosting infrastructure may maintain operational logs.**

## External career resources

Every career-resource card links to a third-party website. Following one of those links leaves Where to Look and makes a request to that site's operator. The destination may have its own:

- account requirements
- cookies and analytics
- application forms
- eligibility questions
- privacy policy and terms
- data-retention practices

Where to Look does not control those practices. Visitors should review the destination's privacy information before creating an account or submitting personal material.

Resource links use `target="_blank"` with `rel="noopener noreferrer"`. This prevents the new page from receiving a live `window.opener` reference and asks the browser not to send referrer information. It does not change what the destination collects after the visitor arrives.

The application embeds no third-party job listings, trackers, iframes, fonts, or remote images. Resource providers are reached through ordinary links rather than background API calls.

## Data access, correction, and deletion

There is currently no application-owned personal-data store and therefore no application-level profile, search history, favorite list, resume, or application record to access, correct, or delete. Hosting-log questions belong to the operator of the deployed service.

No privacy contact address is represented in the repository. Add one here only after a real monitored contact channel exists.

## Changes that require a privacy review

Update this document before releasing any of the following:

- analytics, error reporting, session replay, advertising, or tracking pixels
- accounts, authentication, profiles, or personalization
- a database, form submission, email integration, or resource-suggestion inbox
- saved searches, favorites, or other browser persistence
- resume, document, or application uploads
- embedded third-party media, widgets, or fonts
- URL-based search state that may appear in logs or shared links
- a new hosting provider or materially different logging configuration

When the privacy posture changes, document what is processed, why, where it is stored, who receives it, and how long it is retained. Keep public claims aligned with both the application code and the production hosting configuration.
