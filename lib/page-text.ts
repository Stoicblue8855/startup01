/**
 * Every editable piece of website wording lives in the Supabase table
 * `page_content` (one row per piece of text). The values below are the
 * built-in defaults, used only when a row is missing from the table.
 * Edit the text in Supabase (Table Editor -> page_content -> "value" column);
 * the site picks up changes within about a minute.
 */
export type TextDef = { value: string; section: string; note: string }

const d = (section: string, note: string, value: string): TextDef => ({ value, section, note })

export const PAGE_TEXT_DEFAULTS: Record<string, TextDef> = {
  /* ---------- Google / SEO ---------- */
  'seo.title': d('SEO (Google)', 'Main website title shown on Google and in the browser tab', 'SamayChakkra — Time, made to be inherited.'),
  'seo.description': d('SEO (Google)', 'Main description shown under the title on Google', 'SamayChakkra — watches for men and women: bracelet, leather strap, steel and digital watches, plus couple sets. Delivery all over India.'),
  'seo.keywords': d('SEO (Google)', 'Search keywords, separated by commas', 'SamayChakkra, watches India, men’s watches, women’s watches, couple watches, leather strap watch, steel watch, digital watch, buy watches online India'),
  'seo.share_description': d('SEO (Google)', 'Short description shown when the site link is shared on WhatsApp, Facebook, Twitter', 'Watches for men and women, couple sets and more. Delivery all over India.'),
  'seo.business_description': d('SEO (Google)', 'Business description given to Google (structured data)', 'SamayChakkra sells watches for men and women, with delivery all over India.'),

  /* ---------- Menu ---------- */
  'nav.watches': d('Menu', 'Menu link: shop', 'Watches'),
  'nav.heritage': d('Menu', 'Menu link: about page', 'Heritage'),
  'nav.journal': d('Menu', 'Menu link: journal page', 'Journal'),

  /* ---------- Home page ---------- */
  'home.collections.eyebrow': d('Home page', 'Small heading above the collections row', 'The Collections'),
  'home.collections.title': d('Home page', 'Heading of the collections row', 'Shop by category.'),
  'home.spotlight.label': d('Home page', 'Small label of the big featured watch', 'Signature model'),
  'home.spotlight.word': d('Home page', 'Large faint background word behind the featured watch', 'Signature'),
  'home.spotlight.button': d('Home page', 'Button under the featured watch', 'Discover the piece'),
  'home.craft1.eyebrow': d('Home page', 'First story block: small heading', 'Craftsmanship'),
  'home.craft1.title': d('Home page', 'First story block: heading', 'Assembled by a single pair of hands.'),
  'home.craft1.body': d('Home page', 'First story block: paragraph', 'No caliber leaves the atelier having passed through more than two watchmakers. Each bridge is bevelled, each screw head polished, each balance regulated until it is not merely finished, but beautiful.'),
  'home.craft1.cta': d('Home page', 'First story block: button', 'Inside the atelier'),
  'home.craft2.eyebrow': d('Home page', 'Second story block: small heading', 'Heritage'),
  'home.craft2.title': d('Home page', 'Second story block: heading', 'A century and a half, unhurried.'),
  'home.craft2.body': d('Home page', 'Second story block: paragraph', 'Since 1874 we have worked from the same mountains, to the same standard, answering to no one but the movement itself. Independence is not our strategy. It is our nature.'),
  'home.craft2.cta': d('Home page', 'Second story block: button', 'Our story'),
  'home.film.1.label': d('Home page', 'Making-of slideshow: step 1 label', 'Design'),
  'home.film.1.quote': d('Home page', 'Making-of slideshow: step 1 quote', 'Every great thing begins with a single idea.'),
  'home.film.2.label': d('Home page', 'Making-of slideshow: step 2 label', 'Casting'),
  'home.film.2.quote': d('Home page', 'Making-of slideshow: step 2 quote', 'From fire and metal, precision is born.'),
  'home.film.3.label': d('Home page', 'Making-of slideshow: step 3 label', 'Assembly'),
  'home.film.3.quote': d('Home page', 'Making-of slideshow: step 3 quote', 'Patience is the first tool of any master.'),
  'home.film.4.label': d('Home page', 'Making-of slideshow: step 4 label', 'Finishing'),
  'home.film.4.quote': d('Home page', 'Making-of slideshow: step 4 quote', 'Perfection is never rushed. It is earned.'),
  'home.film.5.label': d('Home page', 'Making-of slideshow: step 5 label', 'Inspection'),
  'home.film.5.quote': d('Home page', 'Making-of slideshow: step 5 quote', 'The smallest details define the greatest work.'),
  'home.film.6.label': d('Home page', 'Making-of slideshow: step 6 label', 'The Reveal'),
  'home.film.6.quote': d('Home page', 'Making-of slideshow: step 6 quote', 'Some things are not made. They are crafted, for a lifetime.'),
  'home.arrivals.eyebrow': d('Home page', 'Latest watches: small heading', 'The Collection'),
  'home.arrivals.title': d('Home page', 'Latest watches: heading', 'Pieces to be discovered.'),
  'home.arrivals.button': d('Home page', 'Latest watches: button', 'View all watches'),
  'home.materials.eyebrow': d('Home page', 'Materials block: small heading', 'Materials & Innovation'),
  'home.materials.title': d('Home page', 'Materials block: heading', 'Only what endures.'),
  'home.materials.description': d('Home page', 'Materials block: paragraph', 'Every substance that enters the atelier is chosen for a single reason: it must still be beautiful in a hundred years.'),
  'home.testimonials.label': d('Home page', 'Customer reviews: small heading', 'In their words'),
  'home.newsletter.eyebrow': d('Home page', 'Email signup block: small heading', 'The Correspondence'),
  'home.newsletter.title': d('Home page', 'Email signup block: heading', 'An invitation, rarely extended.'),
  'home.newsletter.body': d('Home page', 'Email signup block: paragraph', 'New arrivals and offers, sent to your inbox now and then.'),

  /* ---------- Heritage (About) page ---------- */
  'about.meta.title': d('Heritage page', 'Google / browser tab title', 'Heritage'),
  'about.meta.description': d('Heritage page', 'Google description', 'A century and a half of independent watchmaking, from a single bench in the Jura mountains.'),
  'about.eyebrow': d('Heritage page', 'Small heading at the top', 'Heritage'),
  'about.title': d('Heritage page', 'Main heading', 'A century and a half, unhurried.'),
  'about.description': d('Heritage page', 'Paragraph under the main heading', 'Since 1874 we have worked from the same mountains, to the same standard, answering to no one but the movement itself.'),
  'about.timeline.eyebrow': d('Heritage page', 'Timeline: small heading', 'The Timeline'),
  'about.timeline.title': d('Heritage page', 'Timeline: heading', 'Every decade, a decision to stay small.'),
  'about.founder.eyebrow': d('Heritage page', "Founder's note: small heading", 'Founder’s note'),
  'about.founder.quote': d('Heritage page', "Founder's note: big quote", '“We have never confused speed with progress.”'),
  'about.founder.body': d('Heritage page', "Founder's note: paragraph", 'Every watch that leaves this atelier carries the same conviction the first one did: that a thing worth making is worth making slowly, by hand, by people who will still be here to stand behind it in twenty years. That has never been a business strategy. It is simply how we were taught, and how we intend to teach the next generation of watchmakers who will one day sit at these same benches.'),

  /* ---------- Sustainability page ---------- */
  'sustain.meta.title': d('Sustainability page', 'Google / browser tab title', 'Sustainability'),
  'sustain.meta.description': d('Sustainability page', 'Google description', 'Materials chosen to last a century, sourced with the same discipline as our craft.'),
  'sustain.eyebrow': d('Sustainability page', 'Small heading at the top', 'Sustainability'),
  'sustain.title': d('Sustainability page', 'Main heading', 'Only what endures.'),
  'sustain.description': d('Sustainability page', 'Paragraph under the main heading', 'A watch designed to be inherited is, by its nature, a sustainable object. We take the rest of the process just as seriously.'),
  'sustain.pillar1.title': d('Sustainability page', 'Point 1: heading', 'Responsibly sourced metals'),
  'sustain.pillar1.body': d('Sustainability page', 'Point 1: paragraph', 'All gold and platinum used in our ateliers is certified through the Responsible Jewellery Council chain of custody, tracing each ounce back to its mine.'),
  'sustain.pillar2.title': d('Sustainability page', 'Point 2: heading', 'A watch built to be repaired'),
  'sustain.pillar2.body': d('Sustainability page', 'Point 2: paragraph', 'Every caliber is designed to be serviced, not replaced. Spare parts for house movements remain in production for a minimum of thirty years.'),
  'sustain.pillar3.title': d('Sustainability page', 'Point 3: heading', 'Packaging that decomposes'),
  'sustain.pillar3.body': d('Sustainability page', 'Point 3: paragraph', 'Our boxes are FSC-certified wood and undyed cotton — no plastic film, no laminated foam, nothing that outlives the watch inside it.'),
  'sustain.materials.eyebrow': d('Sustainability page', 'Materials: small heading', 'Materials'),
  'sustain.materials.title': d('Sustainability page', 'Materials: heading', 'Chosen for a hundred years, not for this season.'),

  /* ---------- Shop and Journal pages ---------- */
  'shop.meta.description': d('Shop page', 'Google description', 'Browse the full collection — ladies’ bracelet watches, couple sets, leather strap watches, steel and chronograph-style watches, and digital sports watches.'),
  'shop.eyebrow': d('Shop page', 'Small heading at the top', 'The Collection'),
  'shop.title': d('Shop page', 'Main heading', 'Every watch we make.'),
  'shop.description': d('Shop page', 'Paragraph under the main heading', 'Bracelet, leather and digital watches for men and women, plus matching couple sets.'),
  'journal.meta.title': d('Journal page', 'Google / browser tab title', 'The Journal'),
  'journal.meta.description': d('Journal page', 'Google description', 'Notes on craft, materials and philosophy from the atelier.'),
  'journal.eyebrow': d('Journal page', 'Small heading at the top', 'The Journal'),
  'journal.title': d('Journal page', 'Main heading', 'Notes from the atelier.'),
  'journal.description': d('Journal page', 'Paragraph under the main heading', 'Short, occasional writing on craft, materials and the philosophy behind what we make.'),

  /* ---------- Contact, Careers, FAQ pages ---------- */
  'contact.meta.description': d('Contact page', 'Google description', 'Reach the house directly — general enquiries, orders and press.'),
  'contact.title': d('Contact page', 'Main heading', 'Reach the house directly.'),
  'contact.description': d('Contact page', 'Paragraph under the main heading', 'For orders, press or simply a question — write to us directly and we will get back to you.'),
  'contact.account.title': d('Contact page', 'Heading when opened from the account link', 'Your account, by way of a person.'),
  'contact.account.description': d('Contact page', 'Paragraph when opened from the account link', 'Having trouble signing in or placing an order? Tell us what you need and we will help.'),
  'contact.label.email': d('Contact page', 'Label above the email', 'Email'),
  'contact.label.phone': d('Contact page', 'Label above the phone number', 'Phone'),
  'contact.label.hours': d('Contact page', 'Label above the hours', 'Hours'),
  'careers.meta.description': d('Careers page', 'Google description', 'Join the atelier — open roles in watchmaking, retail and design.'),
  'careers.title': d('Careers page', 'Main heading', 'Join the atelier.'),
  'careers.description': d('Careers page', 'Paragraph under the main heading', 'We hire slowly and keep people for decades. If that sounds like the wrong incentive, this may not be the place for you.'),
  'careers.roles.eyebrow': d('Careers page', 'Small heading above the open roles', 'Open roles'),
  'careers.note': d('Careers page', 'Note under the open roles', 'Don’t see the right role? Apply anyway — the form is the same either way.'),
  'faq.meta.description': d('FAQ page', 'Google description', 'Answers on ordering, delivery, payment and our policies.'),
  'faq.title': d('FAQ page', 'Main heading', 'Answers, before you have to ask.'),
  'faq.description': d('FAQ page', 'Paragraph under the main heading', 'If you don\'t find what you need here, our contact page reaches a person, not a queue.'),

  /* ---------- Product page, cart and ordering ---------- */
  'product.policy.title': d('Product page', 'Heading of the Delivery & policy fold-out', 'Delivery & policy'),
  'product.policy.body': d('Product page', 'Text inside the Delivery & policy fold-out', 'We deliver all over India. Delivery charges depend on the distance and are added at the end of your order booking. All watches are sold without warranty, and all sales are final — no returns.'),
  'product.related.eyebrow': d('Product page', 'Small heading above related watches', 'You may also like'),
  'product.related.title': d('Product page', 'Heading above related watches', 'More from the house.'),
  'cart.note': d('Cart', 'Note above the Request order button', 'No warranty. No returns. Delivery charges are added at the end of your order booking.'),
  'cart.empty': d('Cart', 'Message when the cart is empty', 'Your selection is empty.'),
  'order.details.title': d('Order page', 'Heading of the delivery details form', 'Delivery details.'),
  'order.delivery.note': d('Order page', 'Note about delivery charges under the total', 'Delivery charges are calculated by distance and added at the end of your order booking.'),
  'order.notice.strong': d('Order page', 'Bold part of the no-warranty box', 'No warranty. No returns.'),
  'order.notice.body': d('Order page', 'Rest of the no-warranty box', 'All sales are final. Please check your selection carefully before placing your order.'),
  'order.accept': d('Order page', 'Tick-box text the customer must accept', 'I understand and accept that there is no warranty and no returns on my order.'),
  'order.placed.title': d('Order page', 'Heading after an order is placed', 'Your order is placed.'),
  'order.placed.delivery': d('Order page', 'Delivery line after an order is placed', 'Delivery charges will be added at the end of your order booking.'),

  /* ---------- Sign-in screen ---------- */
  'signin.title': d('Sign-in screen', 'Heading', 'Sign in to continue'),
  'signin.text': d('Sign-in screen', 'First paragraph', 'Sign in with Google or email to view prices, add watches to your cart and place orders.'),
  'signin.subtext': d('Sign-in screen', 'Second paragraph', 'New to SamayChakkra? Your account is created automatically the first time you sign in.'),
  'signin.button': d('Sign-in screen', 'Button', 'Sign in'),

  /* ---------- Page not found ---------- */
  'notfound.title': d('Page not found (404)', 'Heading', 'This moment has passed.'),
  'notfound.body': d('Page not found (404)', 'Paragraph', 'The page you’re looking for doesn’t exist, or has moved on — much like time itself.'),

  /* ---------- Show or hide pages and sections (yes / no) ---------- */
  'show.page.about': d('Show or hide pages and sections', 'Heritage page: type yes to show it (menu, footer and page), no to hide it', 'no'),
  'show.page.journal': d('Show or hide pages and sections', 'Journal pages: type yes to show them (menu, footer and pages), no to hide them', 'no'),
  'show.page.sustainability': d('Show or hide pages and sections', 'Sustainability page: type yes to show it (footer and page), no to hide it', 'no'),
  'show.page.careers': d('Show or hide pages and sections', 'Careers page: type yes to show it (footer and page), no to hide it', 'no'),
  'show.home.craftsmanship': d('Show or hide pages and sections', 'Home page: Craftsmanship and Heritage blocks (yes / no)', 'no'),
  'show.home.brand_film': d('Show or hide pages and sections', 'Home page: brand film section (yes / no)', 'no'),
  'show.home.materials': d('Show or hide pages and sections', 'Home page: Materials section (yes / no)', 'no'),
  'show.home.testimonials': d('Show or hide pages and sections', 'Home page: customer quotes and press names (yes / no)', 'no'),
  'footer.legal': d('Footer', 'Footer: line after the copyright and brand name', 'All rights reserved.'),
  'home.hero.stat1': d('Home page top', 'Home top section: first small line under the buttons', 'Delivery all over India'),
  'home.hero.stat2': d('Home page top', 'Home top section: second small line under the buttons', 'Team available 24/7'),
}
