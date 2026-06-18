# WEDE5020 POE Website Project Template

## Student Information
- **Student Name:** Kananelo Mokgasi
- **Student Number:** ST10540015
- **Module:** Web Development (Introduction) - WEDE5020
- **Lecturer:** Thabo Mofokeng
- **Selected Organisation:** Peak Performance Fitness
- **Repository URL:** [Paste GitHub repository link here]
- **Deployed Website URL:** [Paste deployment link here in Part 3]

## Project Overview
Peak Performance Fitness is a fitness business established in 2021 that focuses on helping individuals improve their health and well-being. The business provides personalised workout plans, group training sessions, and nutritional guidance to ensure clients achieve long-term fitness goals.

The purpose of this project is to design and develop a professional website that will allow the business to expand its reach, provide detailed information about its services, and enable users to book training sessions easily. The website will act as both a marketing platform and a functional tool for managing client interactions.



## Website Goals and Objectives
The main goal of the website is to attract and convert potential clients into active customers. It aims to:

- Promote fitness services effectively
- Provide clear and detailed information
- Enable easy booking of training sessions

## Key Features and Functionality
- Five web pages which are each designed for their own purpose
- Semantic HTML structure
- Responsive CSS design
- Enquiry and contact forms
- JavaScript functionality
- SEO elements (title, description, keywords, alt text, sitemap.xml)

## Sitemap
```text
Home (index.html)
├── About (about.html)
├── Services / Products (services.html)
├── Enquiry (enquiry.html)
└── Contact (contact.html)
```

## File and Folder Structure
```text
.
├── index.html
├── about.html
├── services.html
├── enquiry.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   ├── enquiry.js
│   └── contact.js
├── images/
└── README.md
```

## Part 1 Details
### Proposal Summary
- Proposal Option 1: Peak Performance Fitness. this organization focuses on the health of its clients.
- Proposal Option 2: The kasi Bakery. this is an organization that focuses on the needs of the consumers. the focus on the taste buds of the customers
- Approved Organisation: Peak performance Fitness

### Research Notes
Summarise your sources, content plan, legal asset sourcing, and intended audience.

### Timeline and Milestones
| Milestone | Planned Date | Status |
|---|---|---|
| Proposal submission | 10/04/2026 |Done|
| HTML structure complete | 18/04/2026 | [Done ] |
| CSS styling complete | 27/05/2026 | [Done ] |
| JavaScript complete | 12/06/2026 | [Done ] |
| Deployment complete | 19/06/2026 | [Pending] |

## Part 2 Details
The stylesheet uses a tight three-colour system built around deep charcoal (#1a252f), energetic orange (#e67e22), and a light grey-white (#f4f6f7). The charcoal anchors the header and footer, giving the site a strong professional frame, while the orange serves as the action colour, appearing on button backgrounds, hover states, list borders, and input focus highlights. The light grey-white sits behind the main content to keep everything clean and easy to read, with muted silver (#bdc3c7) used for secondary text inside the header and footer.
For typography, the stylesheet uses the Segoe UI font stack, a clean system-safe sans-serif that renders well across devices. The base body size is set to 14pt with 1.5px letter-spacing, giving the text a slightly open, airy feel, and a line-height of 1.6 keeps paragraphs comfortable to read. One conflict worth noting is that headings are styled with charcoal (#1a252f) early in the file but then overridden at the bottom to silver (#bdc3c7), meaning all h1 and h2 elements will render silver regardless of where they appear on the page.
The desktop layout centres all content using max-width: 800px with auto margins on sections, forms, and lists, which keeps the reading area focused on wide screens. The header is built with flexbox in a column direction, stacking the site title and navigation vertically and centering both. The nav itself also uses flexbox with a gap of 15px for evenly spaced links. At 1024px and above, a container class is given a width of 90%, though this only takes effect where that class is actually applied in the HTML.
Three media query breakpoints handle responsiveness. On mobile at 767px and below, the font size drops to 14px. On tablets between 481px and 1024px, the container narrows to 95% width. On desktop at 1024px and above, the container sits at 90%. All three breakpoints also apply a lightblue background, which overrides the default #f4f6f7 across every screen size, so it is worth checking whether that was intentional or left over from testing. Additionally, images are defined twice in the file, first with max-width: 90% and then with a fixed width of 300px, with the second rule winning and potentially causing layout issues on smaller screens.

## Part 3 Details
Both files are wrapped in a DOMContentLoaded event listener, ensuring all scripts run only after the page is fully parsed. The contact page introduces two notable interactive features. The first is a location tab system that dynamically removes the static paragraph-based location list and replaces it with clickable tab buttons for the Bloemfontein and Pretoria branches, each revealing an address, phone number, operating hours, and a Google Maps link. The second is a smooth scroll jump button injected at the top of the main element, giving visitors a quick way to reach the contact form without manually scrolling. The enquiry page takes a similar approach with its service selector, replacing the plain HTML select dropdown with a visual tab strip showing Personal Training, Group Training, and Nutrition Plan, each with a description and a badge label. It also appends a fully functional FAQ accordion section below the form, where each question expands and collapses on click with an aria-expanded attribute toggling for accessibility.
SEO
There is no direct SEO work done within the JavaScript files themselves, which is appropriate since JavaScript is generally not the right place for it. However, the scripts do make some accessibility-conscious decisions that indirectly support SEO, such as using role, aria-modal, aria-labelledby, and aria-live attributes on the modal and toast elements. These help search engines and screen readers better understand the page structure. The modal on the enquiry page also uses semantic dialog roles and keyboard support including Escape key dismissal and focus management, which contributes to a better overall user experience signal.
Form Validation
Both pages implement client-side validation with a consistent pattern. Each field gets an error span injected directly after it in the DOM, and errors are cleared in real time as the user types, preventing the frustrating experience of stale error messages. The name field checks that it is not empty, is at least two characters long, and contains only letters, spaces, hyphens, or apostrophes. The email field is tested against a regular expression that requires a proper format with an at-sign and a domain. The message field on the contact page adds an upper limit of 1000 characters on top of the minimum 10-character requirement, and a live character counter is injected beneath the textarea to give users constant feedback on their progress. The enquiry page applies the same lower limit to the message but omits the upper cap since it is a less formal submission.
Form Processing
The two pages handle submission differently. The contact page uses a mailto approach, building a pre-filled email link addressed to info@peakfitness.com with the user's name, email, and message encoded into the subject and body, then redirecting the browser to open the user's local email client. A toast notification then appears confirming that the email client has been opened. The enquiry page takes a purely front-end approach, showing a success modal that confirms the submission with the user's name and chosen service, and promises a coach will follow up within one to two business days. Neither page sends data to a real server or API, meaning no data is actually stored or transmitted beyond what the user's email client handles on the contact page.

## Changelog
june 19,2026
deployment of the website and final submission of the Final POE
june 18, 2026
added all the files to github and modified things such as the file names, the names of the image files. 
June 17, 2026
linked all the javascript files to the relevent html file in the assignment
June 16, 2026
Completed form validation on both pages. Implemented real-time inline error messages for name, email, and message fields. Added the 1000-character limit and live character counter to the Contact page textarea. Built the success modal on the Enquiry page with accessibility attributes and keyboard support. Implemented the mailto form submission on the Contact page with a toast notification. Appended the FAQ accordion section to the Enquiry page. Final review and submission.
 June 2, 2026
Introduced JavaScript interactivity. Created enquiry.js and contact.js as separate page-specific files. Built the interactive service tab system on the Enquiry page replacing the plain select dropdown. Built the location tab system on the Contact page replacing static paragraph-based branch listings. Added the smooth scroll jump button on the Contact page linking directly to the form.
June 1, 2026
started with the planning of the Final POE for Web development

## Screenshots
### Desktop
(<Assets/Screenshot 2026-05-28 144513.png>)

### Tablet
(<Assets/Screenshot 2026-05-28 144108.png>)

### Mobile
(<Assets/Screenshot 2026-05-28 144051.png>)

## References
HubSpot (2023) Website marketing statistics. Available at: https://www.hubspot.com (Accessed: 18 April 2026).
World Health Organization (2022) Physical activity guidelines. Available at: https://www.who.int (Accessed: 18 April 2026).
Statista (2024) Digital fitness trends. Available at: https://www.statista.com (Accessed: 18 April 2026).
Interaction Design Foundation (2023) UX design principles. Available at: https://www.interaction-design.org (Accessed: 18 April 2026).
Google (2023) Mobile-friendly design guidelines. Available at: https://developers.google.com (Accessed: 18 April 2026).
Mozilla (2024) Web development fundamentals. Available at: https://developer.mozilla.org (Accessed: 18 April 2026).
Netlify (2024) Hosting services. Available at: https://www.netlify.com (Accessed: 18 April 2026)


## Autograding Feedback
This project may be checked automatically in GitHub Classroom on every push.
Use the Actions or autograding results to see which requirements still need improvement.
