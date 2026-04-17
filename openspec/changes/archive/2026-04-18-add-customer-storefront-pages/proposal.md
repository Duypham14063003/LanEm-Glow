# Add Customer Storefront Pages

## Why

The project now has a design foundation and a working catalog read layer, but customers still cannot browse the storefront in a real product experience. The current root page is only a theme preview and there are no customer-facing routes for homepage, catalog listing, search/filter, or product detail.

Milestone 3 is the point where the product becomes a usable storefront: customers should be able to land on the site, explore featured products, navigate by skin concern, browse the catalog, and inspect product details before the quick-order flow is introduced.

## What Changes

- Replace the temporary preview homepage with a real customer-facing homepage.
- Add a dedicated site layout with customer-oriented header, footer, and shared page section wrappers.
- Add storefront-specific components for product cards, trust content, concern navigation, and social proof.
- Add a products listing page with:
  - search
  - chip filters
  - empty states
  - product grid rendering
- Add a product detail page with gallery, summary block, content sections, and related products.
- Use the existing catalog read layer and public settings service as the data source for storefront pages.

## Non-Goals

- Quick order submission flow
- Shared selected-product state
- Sticky quick-order bar
- Bottom-sheet filter UI
- Admin pages
- Order creation or notification flows

## Scope Notes

This change is intentionally focused on browse-and-discover storefront experiences. Calls to action may be present visually, but the real quick-order behavior remains part of the next milestone.

## Success Criteria

- Customers can view a real homepage instead of the placeholder preview page.
- Customers can browse products through a dedicated listing page and filter/search results.
- Customers can open a product detail page and inspect its main content and related products.
- The storefront uses the existing theme foundation consistently and consumes normalized catalog data from the service layer.
- The change preserves a clean boundary between storefront browse UI and the later quick-order flow.
